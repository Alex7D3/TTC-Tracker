require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dbRoutes = require('./dbRoutes.js');
const { connectToServer } = require('./dbConnect');

const app = express();
app.use(cors());
app.use(express.json());
app.use(dbRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    connectToServer(console.error);
    console.log(`listening at port ${port}`);
});