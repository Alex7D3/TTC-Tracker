const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../pgConnect.js");
const authenticate = require("../middleware/authenticate.js");
const authRouter = express.Router();

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

authRouter.route("/").get(authenticate, (req, res) => {
    return res.status(200).send("successful login");
});

authRouter.route("/signup").post(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        if(!username || !email || !password) 
            return res.status(400).send("All fields are required.");
        
        const hash = await bcrypt.hash(password, 10);
        await db.query(`
            INSERT INTO users(email, username, password_hash) VALUES
            ($1, $2, $3)
        `, [email, username, hash]);
        return res.status(200).send("User created successfully.");
    } catch(err) {
        if(err.code === "23505")
            return res.status(500).send("username or email already exists.");
        next(err);
    }
});

authRouter.route("/login").post(async (req, res, next) => {
    try {
        const { username_or_email, password } = req.body;

        if(!username_or_email || !password) 
            res.status(400).send("All fields are required.");

        const { rows } = await db.query(`
            SELECT *
            FROM users 
            WHERE lower(email) = lower($1) OR lower(username) = lower($1)
            LIMIT 1`,
            [username_or_email]);

        if(!rows.length) 
            return res.status(404).send(`The username or email does not exist.`);
        const user = rows[0];
        bcrypt.compare(password, user.password_hash, (err, success) => {
            if(err) throw err;
            if(!success) return res.status(401).send("The password is incorrect.");
            delete user.password_hash;
            const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: "50s" });
            const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: "200s" });
            res.status(200)
                .header("Authentication", accessToken)
                .cookie("refresh-token", refreshToken, { httpOnly: true, sameSite: "strict" })
                .json(user);
        });
    } catch(err) {
        next(err);
    }
});

authRouter.route("/refresh").post((req, res, next) => {
    const refresh_token = req.cookies["refresh-token"];
    if(!refresh_token)
        return res.status(401).send("Access denied. No refresh token.");
    try {
        const user = jwt.verify(refresh_token, REFRESH_TOKEN_SECRET);
        const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET);
        delete user.iat;
        delete user.exp;
        res.status(200)
            .header("Authentication", accessToken)
            .send(user);
    } catch(err) {
        next(err);
    }
});

module.exports = authRouter;