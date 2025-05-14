const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../pgConnect.js");
const authenticate = require("../middleware/authenticate.js");

const authRouter = express.Router();
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

authRouter.route("/").get(authenticate, (req, res) => {
    return res.status(200).send("authenticated action.");
});

authRouter.route("/signup").post(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        if(!username || !email || !password) 
            return res.status(400).send("All fields are required.");
        
        const hash = await bcrypt.hash(password, 10);
        await db.query(`
            INSERT INTO users(email, username, password_hash) VALUES
            ($1, $2, $3)`,
            [email, username, hash]);

        return res.status(200);
    } catch(err) {
        if(err.code === "23505")
            return res.status(500).send("username or email already exists.");
        next(err);
    }
});

authRouter.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) 
            res.status(400).send("All fields are required.");

        const { rows } = await db.query(`
            SELECT *
            FROM users 
            WHERE lower(email) = lower($1)
            LIMIT 1`,
            [email]
        );

        if(!rows.length) 
            return res.status(404).send(`The username or email does not exist.`);
        const user = rows[0];
        bcrypt.compare(password, user.password_hash, (err, success) => {
            if(err) throw err;
            if(!success) return res.status(401).send("The password is incorrect.");

            delete user.password_hash;
            const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
            const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: "2h" });

            res.status(200)
                .header("Authorization", "Bearer " + accessToken)
                .cookie("refresh-token", refreshToken, { httpOnly: true, sameSite: "strict", secure: true })
                .json(user);
        });
    } catch(err) {
        next(err);
    }
});

authRouter.delete("/logout").post(authenticate, async (req, res, next) => {
    const refreshToken = req.cookies?.refreshToken;
    if(!refreshToken) res.status(204).send("No token to clear.");
    try {
        // if() {
        //     res.clearCookie("refresh-token", { httpOnly: true, sameSite: "None", secure: true })
        // }
    } catch(err) {
        next(err);
    }

});

authRouter.route("/refresh").post((req, res, next) => {
    const refreshToken = req.cookies["refresh-token"];
    if(!refreshToken)
        return res.status(401).send("Access denied. No refresh token.");
    try {
        jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
            if(err) {
                return res.status(403).send("Expired refresh token.");
            }

            const accessToken = jwt.sign(decoded, ACCESS_TOKEN_SECRET);
            res.status(200)
                .header("Authorization", "Bearer " + accessToken)
                .json(decoded);
        });
    } catch(err) {
        next(err);
    }
});

module.exports = authRouter;