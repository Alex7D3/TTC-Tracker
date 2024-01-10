const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.ATLAS_URI);

module.exports = {
    connect: async function(callback) {
        client.connect((err, db) => {
            if(db) {
                db = db.db('');
                console.log('connected to mongoDB');
            }
            return callback(err);
        });
    },

};