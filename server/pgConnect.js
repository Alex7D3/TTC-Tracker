require("dotenv").config({ path: "server/.env" });
const { Pool } = require("pg");
const { PG_DATABASE, PG_HOST, PG_PORT, PG_USER, PG_PASSWORD } = process.env; 

const pool = new Pool({
    host: PG_HOST,
    port: PG_PORT,
    database: PG_DATABASE,
    user: PG_USER,
    password: PG_PASSWORD,
    ssl: {
        rejectUnauthorized: false
    }
});

async function query(text, params) {
    const start = Date.now();
    const res = await pool.query(text, params);
    const dif = Date.now() - start;
    console.log(`${text}\n${params}\ntime: ${dif}`);
    return res;
}
   
async function getClient() {
    const client = await pool.connect();
    const { query, release } = client;

    const timeoutID = setTimeout(() => {
        console.error('A client has been checked out for more than 5 seconds!');
        console.error(`The last executed query on this client was: ${client.lastQuery}`);
    }, 5000);
    
    client.query = function(...args) {
        client.lastQuery = args;
        return query.apply(client, args);
    }
    client.release = function() {
        clearTimeout(timeoutID);
        client.query = query;
        client.release = release;
        return release.apply(client);
    }
    return client;
}

module.exports = { query, getClient };