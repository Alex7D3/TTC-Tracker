const express = require('express');
const { connectToServer } = require('./dbConnect');
const { ObjectId } = require('mongodb');

const dbRoutes = express.Router();
let db;
connectToServer()
.then(response => db = response);

let current_location;

dbRoutes.route('/bus-route').get((req, res) => {
    db.collection('user_routes').find({})
        .toArray((err, result) => {
            if(err) throw err;
            res.json(result);
        });
});

dbRoutes.route('/bus-route/:id').get((req, res) => {
    db.collection('user_routes')
        .findOne({ _id: ObjectId(req.params.id) }, (err, result) => {
            if(err) throw err;
            res.json(result);
        });
});

dbRoutes.route('/bus-route/add').post((req, res) => {
    const bus_route = { req };
    db.collection('user_routes').insertOne(bus_route, (err, result) => {
        if(err) throw err;
        res.json(result);
    });
});

dbRoutes.route('/bus-route/add/autocomplete/:route', async (req, res) => {

    const results = await itemCollection.aggregate(
        [
            {
                "$search": {
                    "index": 'stopname_autocomplete',
                    "autocomplete": {
                        "query": req.params.route,
                        "path": 'stop.name'
                    },
                    "highlight": { "path": ['stop.name'] }
                }
            }, 
            { "$limit": 5 },
            {
                "$project": {
                    "stop.name": 1,
                    "highlights": { "$meta": 'searchHighlights' }
                }
            }
        ]
    )
    .toArray();
    res.send(results).status(200);
});

dbRoutes.route('/bus-route/add/autocomplete/:route/:stop', async (req, res) => {

    const results = await itemCollection.aggregate(
        [
            {
                "$search": {
                    "index": 'stopname_autocomplete',
                    "autocomplete": {
                        "query": req.params.input,
                        "path": 'stop.name'
                    },
                    "highlight": { "path": ['stop.name'] }
                }
            }, 
            { "$limit": 5 },
            {
                "$project": {
                    "stop.name": 1,
                    "highlights": { "$meta": 'searchHighlights' }
                }
            }
        ]
    )
    .toArray();
    res.send(results).status(200);
});

dbRoutes.route('/delete/:id').delete((req, res) => {
    db.collection('user_routes')
        .deleteOne({ _id: ObjectId(req.params.id) }, (err, obj) => {
            if(err) throw err;
            console.log('bus route deleted');
            res.json(obj);
        })
})

module.exports = dbRoutes;