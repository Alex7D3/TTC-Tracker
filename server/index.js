require("dotenv").config();
const express = require("express");
const cors = require("cors");
const busRouter = require("./controllers/busRouter.js");
const userRouter = require("./controllers/userRouter.js");
const authRouter = require("./controllers/authRouter.js");
const cookieParser = require("cookie-parser");
const authenticate = require("./middleware/authenticate.js");

const app = express();
app.use(cors({
    origin: [process.env.URI],
    methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
    credentials: true, 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/bus", busRouter);
app.use("/user", authenticate, userRouter);
app.use("/auth", authRouter);

app.use((error, req, res, next) => {
    const code = error.statusCode || 500;
    res.status(code).json({ 
        error: code, 
        message: error.message 
    });
});

const port = process.env.SERVER_PORT || 5000;
app.listen(port, () => {
    
    console.log(`listening at port ${port}`);
});