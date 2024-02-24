const express = require("express");
const { getDB } = require("./dbConnect");
const crypto = require('crypto');
const { ObjectId, UUID } = require("mongodb");

const busRouter = express.Router();

busRouter.route("/stoplist/:_id/:dirTag").get(async (request, response) => {
    try {
        const result = await getDB().collection("route_info").aggregate([
            { "$match": { _id: new ObjectId(request.params._id) } },
            { "$unwind": "$direction" },
            { "$match": { "direction.tag": `${request.params.dirTag}` } },
            {
                "$lookup": {
                    "from": "stop_info",
                    "localField": "direction.stops",
                    "foreignField": "tag",
                    "as": "stops"
                }
            },
            { "$project": { "stops": 1, "title": 1 } }
        ]).toArray();
        console.log(result);
        response.status(200).json(result);
    } catch(e) {
        response.status(500).send(e.message);
    }
});

busRouter.route("/:_id").get(async (request, response) => {
    try {
        const result = await getDB().collection("route_info").findOne({ _id: new ObjectId(request.params._id) });
        response.status(200).json(result);
    } catch(e) {
        response.status(500).send(e.message);
    }
    
});

busRouter.route("/stops/:stopId").get(async (request, response) => {
    try {
        const result = await getDB().collection("stop_info").findOne({ stopId: request.params.stopId });
        response.status(200).json(result);
    } catch(e) {
        response.status(500).send(e.message);
    }
});

busRouter.route("/autocomplete/:route").get(async (request, response) => {
    try {
        const results = await getDB().collection("route_info").aggregate([
            {
                "$search": {
                    "autocomplete": {
                        "query": `${request.params.route}`,
                        "path": "title",
                        "fuzzy": { "maxEdits": 2 },
                        "score": { "boost": { "value": 5 } }
                    },
                }
            }, { "$limit": 4 }, 
            { "$project": { "title": 1, "tag": 1, "direction": 1, "latMin": 1, "latMax": 1, "lonMin": 1, "lonMax": 1 } }
        ]).toArray();
        response.status(200).send(results);
    } catch(e) {
        response.status(500).send(e.message);
    }
});

busRouter.route("/autocomplete/:routeTag/:dir").get(async (request, response) => {
    try {
        const results = await getDB().collection("stop_info").aggregate([   
            {
                "$search": {
                    "compound": {
                        "must": {
                            "text": {
                                "path": "busTags",
                                "query": `${request.params.routeTag}`
                            }
                        },
                        "should": { 
                            "autocomplete": {
                                "query": `${request.params.dir}`,
                                "path": "title",
                                "fuzzy": { "maxEdits": 2 },
                                "score": { "boost": { "value": 5 } }
                            }
                        }
                    }
                }
            }, 
            { "$limit": 4 }
        ]).toArray();
        response.status(200).send(results);
    } catch(e) {
        response.status(500).send(e.message);
    }
});

module.exports = busRouter;