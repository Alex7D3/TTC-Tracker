require("dotenv").config();
const express = require("express");
const cors = require("cors");
const busRouter = require("./busRouter.js");
const userRouter = require("./userRouter.js");
const { connectToServer, getDB } = require("./dbConnect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cors({
    origin: [process.env.URI],
    methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
    credentials: true, 
}));
app.use(express.json());
app.use(cookieParser());
app.use("/bus-route", busRouter);
app.use("/user-route", userRouter);

function authenticateToken(request, response, next) {
    const token = request.cookies.token;
    if(!token) return response.sendStatus(401).send("Token unavailable");
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (e, user) => {
        if(e) return response.status(500).send(e.message);
        request.user = user;
        next();
    });
}

app.get("/", authenticateToken, (request, response) => {
    response.status(200).send("successful login");
});

app.post("/signup", async (request, response) => {
    try {
        const { username, password } = request.body;
        const hash = await bcrypt.hash(password, 10);

        const result = await getDB().collection("user_route").insertOne({ username, hash, routes: [] });
        response.status(200).json(result);
    } catch(e) {
        response.status(500).send(e.message);
    }
});

app.post("/login", async (request, response) => {
    try {
        const{ username, password } = request.body.username;
        const result = await getDB().collection("user_route").findOne({ username });
        if(!result) 
            response.status(404).send(`The username ${username} does not exist.`);

        bcrypt.compare(password, result.data.password, (e, success) => {
            if(e) throw e;
            if(success) {
                const accessToken = jwt.sign({ name: username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "3d" });
                response.cookie("token", accessToken);
                response.status(200).json({ accessToken });
            }
            else response.status(401).send("The password is incorrect.");
        });
    } catch(e) {
        response.status(500).send(e.message);
    }
});

const port = process.env.SERVER_PORT || 5000;
app.listen(port, () => {
    connectToServer(console.error);
    console.log(`listening at port ${port}`);
});