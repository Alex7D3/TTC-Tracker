const express = require('express');
const cors = require('cors');
const dbRoutes = require('./db-routes.js');
const db = require('./dbConnect');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(dbRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    db.connect(console.err);
    console.log(`listening at port ${port}`);
});