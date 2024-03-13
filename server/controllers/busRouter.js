const express = require("express");
const { getDB } = require("../dbConnect");
const crypto = require('crypto');
const { ObjectId, UUID } = require("mongodb");

const busRouter = express.Router();

busRouter.route("/stoplist/:_id/:dirTag").get(async (request, response) => {
    try {
        
        
        response.status(200).json(result);
    } catch(e) {
        response.status(500).send(e.message);
    }
});

busRouter.route("/:_id").get(async (request, response) => {
    try {
        
        response.status(200).json(result);
    } catch(e) {
        response.status(500).send(e.message);
    }
    
});

busRouter.route("/stops/:stopId").get(async (request, response) => {
    try {
        
        response.status(200).json(result);
    } catch(e) {
        response.status(500).send(e.message);
    }
});

busRouter.route("/autocomplete/:route").get(async (request, response) => {
    try {
        
        
        response.status(200).send(results);
    } catch(e) {
        response.status(500).send(e.message);
    }
});

busRouter.route("/autocomplete/:routeTag/:dir").get(async (request, response) => {
    try {
        
        response.status(200).send(results);
    } catch(e) {
        response.status(500).send(e.message);
    }
});

module.exports = busRouter;