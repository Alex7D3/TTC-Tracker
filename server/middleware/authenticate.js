const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../pgConnect.js");
require("dotenv").config();

module.exports = (req, res, next) => {
    const token = req.headers["authentication"];
    if(!token) return res.status(401).send("Token unavailable");
    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if(err) throw err;
            req.user = user;
            console.log(user)
            next();
        });
    } catch(err) {
        next(err);
    }
};