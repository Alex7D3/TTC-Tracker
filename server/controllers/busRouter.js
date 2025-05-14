const express = require("express");
const db = require("../pgConnect.js");

const busRouter = express.Router();

// busRouter.get("/stoplist/:_id/:dirTag", async (req, res) => {
//     try {
        
        
//         res.status(200).json(result);
//     } catch(e) {
//         res.status(500).send(e.message);
//     }
// });

// busRouter.get("/:_id", async (req, res) => {
//     try {
        
//         res.status(200).json(result);
//     } catch(e) {
//         res.status(500).send(e.message);
//     }
    
// });

// busRouter.get("/stops/:stopId", async (req, res) => {
//     try {
        
//         res.status(200).json(result);
//     } catch(e) {
//         res.status(500).send(e.message);
//     }
// });

//ts_rank(route_name_vector, plainto_tsquery('streetname',$1)) AS r, similarity(route_short_name || ' ' || route_long_name, $1) AS s
busRouter.get("/search", async (req, res) => {
    try {
        const { q } = req.query;
        const { rows } = await db.query(`
            SELECT route_short_name, route_long_name, route_id
            FROM route_query
            WHERE (route_name_vector @@ plainto_tsquery('english', $1)) OR (route_long_name % $1)
            ORDER BY similarity(route_long_name, $1) + ts_rank(route_name_vector, plainto_tsquery('english', $1)) DESC
            LIMIT 5`, 
            [q]
        );
        res.status(200).send(rows);
    } catch(e) {
        res.status(500).send(e.message);
    }
});

busRouter.get("/search/:route_id", async (req, res) => {
    try {
        const { route_id } = req.params;
        const { q } = req.query;
        const { rows } = await db.query(`
            SELECT stop_name, stop_id
            FROM stop_query
            WHERE route_id = $2 AND ((stop_name_vector @@ plainto_tsquery('english', $1)) OR (stop_name % $1))
            ORDER BY similarity(stop_name, $1) + 
            LIMIT 5`, 
            [q, route_id]
        );
        res.status(200).send(rows);
    } catch(e) {
        res.status(500).send(e.message);
    }
});

module.exports = busRouter;