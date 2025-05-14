const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
    const header = req.headers["Authorization"];
    if(!header?.startsWith("Bearer ")) 
        return res.status(403).send("Token unavailable");
    
    const token = header.substr("Bearer ".length);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if(err) { //change
            next(err)
        }
        req.user = decoded;
        console.log(decoded);
        next();
    });

};