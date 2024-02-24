const express = require("express");
const { getDB } = require("./dbConnect");
const crypto = require('crypto');
const { ObjectId, UUID } = require("mongodb");

const userRouter = express.Router();

const MAX_RETRIES = 5;
const THROTTLE_TIME = 5000;
let retries = 0, errorMsg;
async function generateUUID() {
    if(retries === MAX_RETRIES) 
        throw new Error(`Reached max retries (${MAX_RETRIES}). Error message: ${errorMsg}`);
    let uuid;
    try {
        uuid = crypto.randomUUID();
        await getDB().collection("user_routes").insertOne({ _id: new UUID(uuid), routes: [] });
    } catch(e) {
        setTimeout(async () => {
            retries++;
            errorMsg = e.message;
            uuid = await generateUUID();
        }, THROTTLE_TIME);
    }
    return uuid;
}

userRouter.route("/uuid").post(async (request, response) => {
    try {
        const result = await generateUUID();
        response.status(200).send(result);
    } catch(e) {
        response.status(500).send(e.message);
    }
});

userRouter.route("/").get(async (request, response) => {
    try {
        const { uuid } = request.headers;
        const result = await getDB().collection("user_routes").find({}).toArray();
        response.status(200).json(result);
    } catch(e) {
        response.status(500).send(e.message);
    }
});

userRouter.route("/").post(async(request, response) => {
    try {
        const { body: route } = request;
        const result = await getDB().collection("user_routes").insertOne(route);
        response.status(200).json(result);
    } catch(e) {
        response.status(500).send(e.message);
    }
});

userRouter.route("/:_id").patch(async(request, response) => {
    try {
        const { body: route } = request;
        const result = await getDB().collection("user_routes")
        .replaceOne({ _id: new ObjectId(request.params._id) }, route);
        response.status(200).json(result);
    } catch(e) {
        response.status(500).send(e.message);
    }
});

userRouter.route("/delete/:_id").delete(async (request, response) => {
    try {
        const result = await getDB().collection("user_routes")
        .deleteOne({ _id: new ObjectId(request.params._id) });
        response.status(200).json(result);
    } catch(e) {
        response.status(500).send(e.message);
    }
});

module.exports = userRouter;