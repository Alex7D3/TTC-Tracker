const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config({ path: 'server/../env' });
console.log(process.env.ATLAS_URI)
const client = new MongoClient(process.env.ATLAS_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
});

module.exports = {
    connectToServer: async function(callback) {
        let db;
        await client.connect()
        .then((mongoDB, err) => {
            if(mongoDB) {
                db = mongoDB.db('ttc_db');
                db.command({ ping: 1 })
                console.log('connected to mongoDB');
            }
            else callback(err);
        });
        return db;
    }
};