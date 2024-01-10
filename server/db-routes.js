const express = require('express');
const db = require('./dbConnect');
const { ObjectId } = require('mongodb');

const dbRoutes = express.Router();

dbRoutes.route('/bus-route').get((req, res) => {
    const connection = db.getDb('user-routes');
    connection.collection('x-user').find({})
        .toArray((err, db_res) => {
            if(err) throw err;
            res.json(db_res);
        });
});

dbRoutes.route('/bus-route/:id').get((req, res) => {
    const connection = db.getDb();
    connection.collection('bus-routes')
        .findOne({ _id: ObjectId(req.params.id) }, (err, db_res) => {
            if(err) throw err;
            res.json(db_res);
        });
});

dbRoutes.route('/bus-route/add').post((req, res) => {
    const connection = db.getDb();
    const bus_route = {
        
    };
    connection.collection('bus-routes').insertOne(bus_route, (err, db_res) => {
        if(err) throw err;
        db_res.json(res);
    });
});

dbRoutes.route('/:id').delete((req, res) => {
    const connection = db.getDb();
    connection.collection('bus-routes')
        .deleteOne({ _id: ObjectId(req.params.id) }, (err, obj) => {
            if(err) throw err;
            console.log('bus route deleted');
            res.json(obj);
        })
})

module.exports = dbRoutes;