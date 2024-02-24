const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config({ path: 'server/../env' });
const client = new MongoClient(process.env.ATLAS_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        deprecationErrors: true,
      }
});

let db;
module.exports = {
    connectToServer: async function(callback) {
        await client.connect()
        .then((mongoDB, err) => {
            if(mongoDB) {
                db = mongoDB.db('ttc_db');
                db.command({ ping: 1 })
                console.log('connected to mongoDB');
            }
            else callback(err);
        });
    },
    getDB: () => db
};