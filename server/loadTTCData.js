require("dotenv").config();
const { parseString } = require("xml2js");
const { connectToServer, getDB } = require("./dbConnect");
const axios = require("axios");
const { base_url, a, commands } = require("../src/api.json");

async function getDataAsJSON(params) {
    const { data } = await axios.get(base_url, { params });
    return new Promise((resolve, reject) => {
        parseString(data, (error, result) => {
            if(error) reject(error);
            else resolve(result);
        });
    });
}

(async () => {
    try {
        const [{ body: { route } }] = await Promise.all([
            getDataAsJSON({ a, command: commands[0] }), connectToServer(console.error)
        ]);
        const routes = await Promise.all(
            route.map(async ({"$": { tag }}) => 
                await getDataAsJSON({ a, command: commands[1], r: tag, verbose: true })
            )
        );
        const titleMap = new Map();
        for(let i = 0; i < routes.length; i++) {
            routes[i] = routes[i].body.route[0];
            Object.assign(routes[i], routes[i]["$"]);
            delete routes[i]["$"];

            routes[i].stopList = routes[i].stop.map(item => item["$"]);
            delete routes[i].stop;

            routes[i].latMin = parseFloat(routes[i].latMin);
            routes[i].latMax = parseFloat(routes[i].latMax);
            routes[i].lonMin = parseFloat(routes[i].lonMin);
            routes[i].lonMax = parseFloat(routes[i].lonMax);
            
            const tagMap = new Map();
            for(const stop of routes[i].stopList) {
                tagMap[stop.tag] = stop;
            }
            
            routes[i].direction = routes[i].direction.filter(dir => JSON.parse(dir["$"].useForUI))
            .map(item => ({
                ...item["$"],
                  stops: item.stop
            }));
            for(const dir of routes[i].direction) {
                for(let i = 0; i < dir.stops.length; i++) {
                    dir.stops[i] = dir.stops[i]["$"].tag;
                }
                for(const tag of dir.stops) {
                    const detailedStop = tagMap[tag];
                    if(titleMap.has(detailedStop.title)) {
                        titleMap.get(detailedStop.title).busTags.push(dir.tag);
                        titleMap.get(detailedStop.title).tagPairs[dir.tag] = tag;
                    }
                    else {
                        titleMap.set(detailedStop.title, {
                            ...detailedStop,
                            lat: parseFloat(detailedStop.lat),
                            lng: parseFloat(detailedStop.lon),
                            busTags: [dir.tag],
                            tagPairs: { [dir.tag]: tag }
                        });
                    }
                }   
            }
            routes[i].path = routes[i].path.map((segment) => ({
                tags: segment.tag.map(tag => tag["$"].id),
                points: segment.point.map(coords => ({  
                    lat: parseFloat(coords["$"].lat), 
                    lng: parseFloat(coords["$"].lon) 
                }))
            }));
        }
        console.log(routes.length);
        console.log([...titleMap.values()].length)
        const db = getDB();

        await Promise.all([
            db.collection("route_info").deleteMany({})
            .then(() => db.collection("route_info").insertMany(routes)),

            db.collection("stop_info").deleteMany({})
            .then(() => db.collection("stop_info").insertMany([...titleMap.values()])),

            db.collection("user_routes").deleteMany({})
        ]);

        console.log("done");
    } catch(e) {
        console.error(e);
    }
})();

