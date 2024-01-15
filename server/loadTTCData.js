require('dotenv').config();
const { parseString } = require('xml2js');
const { connectToServer } = require('./dbConnect');
const axios = require('axios');
const { base_url, a, commands } = require('../api.json');

const params = new URLSearchParams({ a, command: commands[0] });

Promise.all([(async () => {
    const { data } = await axios.get(base_url, { params });
    return new Promise((resolve, reject) => {
        parseString(data, (error, result) => {
            if(error)
                reject(error);
            else 
                resolve(result);
        });
    });
})(), connectToServer(console.error)])
.then(([json, db]) => {
    db.collection('route_info').insertOne(json);
})
.catch(console.error);