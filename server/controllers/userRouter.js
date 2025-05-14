const express = require("express");
const crypto = require('crypto');
const { ObjectId, UUID } = require("mongodb");

const userRouter = express.Router();

// userRouter.route("/").get(async (request, response) => {
//     try {
        
//         response.status(200).json(result);
//     } catch(e) {
//         response.status(500).send(e.message);
//     }
// });


// userRouter.route("/:_id").patch(async(request, response) => {
//     try {
        
         
//         response.status(200).json(result);
//     } catch(e) {
//         response.status(500).send(e.message);
//     }
// });

// userRouter.route("/delete/:_id").delete(async (request, response) => {
//     try {
        
//         response.status(200).json(result);
//     } catch(e) {
//         response.status(500).send(e.message);
//     }
// });

module.exports = userRouter;