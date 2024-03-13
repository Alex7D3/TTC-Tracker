const express = require("express");
const { getDB } = require("../dbConnect");
const crypto = require('crypto');
const { ObjectId, UUID } = require("mongodb");

const userRouter = express.Router();

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