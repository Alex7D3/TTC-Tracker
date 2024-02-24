import { useState, useEffect } from "react";
import {
    APIProvider,
    Map,
    useMap,
    useMapsLibrary,
    AdvancedMarker,
    Pin,
    InfoWindow
} from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { GoogleMapsContext } from "@vis.gl/react-google-maps";
import * as mapstyles from "../mapstyles.json";
import axios from "axios";
import api from "../api.json";

// function getCoordinates(lat, lng, velocity, heading) {
//     const SEC_IN_HR = 1200;
//     const LAT_DEGREE = 110.574
//     const LNG_DEGREE = 111.320 * Math.cos(lat * Math.PI / 180);

//     const dist = velocity / SEC_IN_HR;
//     const angle = 90 - heading;
//     const dy = dist * Math.sin(angle * Math.PI / 180);
//     const dx = dist * Math.cos(angle * Math.PI / 180);
//     const delta_lat = dy / LAT_DEGREE;
//     const delta_lng = dx / LNG_DEGREE;

//     return [lat + delta_lat, lng + delta_lng];
// }

const FIFTEEN_SECONDS = 15000;
//const ONE_SECOND = 1000;
const parser = new DOMParser();
const { a, commands, base_roads_url } = api;

//https://en.wikipedia.org/wiki/Module:Location_map/data/Canada_Toronto
const toronto = {lat:  43.72, lng: -79.39};
const mapBounds = {
    north: 43.88,
    south: 43.57,
    east: -79.10,
    west: -79.68    
};

export default function MapWindow({ busRoute }) {
    const [startLocation, setStartLocation] = useState(toronto);
    const [vehicleData, setVehicleData] = useState({});
    const [path, setPath] = useState([]);
    
    useEffect(() => {
        if(!busRoute) return;
        axios.get(`${process.env.REACT_APP_BASE_URI}/bus-route/${busRoute.bus_id}`)
        .then(response => response.data.path
            .filter(segment => segment.tags.some(tag => tag.startsWith(busRoute.dirTag)))
        )
        .then(filtered => setPath(filtered.map(segment => segment.points)))
        .catch(console.error);

        axios.get(`${process.env.REACT_APP_BASE_URI}/bus-route/stops/${busRoute.stopId}`)
        .then(({ data: { lat, lng } }) => setStartLocation({ lat, lng }))
        .catch(console.error);

    }, [busRoute])

    useEffect(() => {
        setVehicleData({});
        if(!busRoute) return;
        let time = 0;
        const gpsIntervalID = setInterval(async () => { 
            const result = await axios.get(`${api.base_url}`, {
                params: new URLSearchParams({
                    a, 
                    command: commands[4],
                    r: busRoute.busTag,
                    t: time
                })
            }).catch(console.error);
            
            const vehicleDocument = parser.parseFromString(result.data, "text/xml");
            time = vehicleDocument.querySelector("lastTime").getAttribute("time");

            const vehicles = {};
            for(const node of vehicleDocument.querySelectorAll("vehicle")) {
                const vehicle = {};
                for(const attr of node.attributes) 
                    vehicle[attr.name] = attr.value;
                vehicle.lng = parseFloat(vehicle.lon);
                vehicle.lat = parseFloat(vehicle.lat);
                delete vehicle.lon;
                vehicles[node.getAttribute("id")] = vehicle;
                console.log(vehicle);
            }
            setVehicleData(prev => ({ ...prev, ...vehicles }));
        }, FIFTEEN_SECONDS);
        
        return () => {clearInterval(gpsIntervalID); time = 0;}
    }, [busRoute]);

    return (
        <APIProvider apiKey={process.env.REACT_APP_MAPS_KEY} loading="async">
            <div id="map-box" style={{height: "50vh"}} className="row">
                <Map zoom={20} center={startLocation} restriction={{ latLngBounds: mapBounds, strictBounds: false }}
                    options={{ disableDefaultUI: true }} 
                    mapId={process.env.REACT_APP_MAP_ID}>
                    <Markers id="busmarkers" points={Object.values(vehicleData)} icon="🚌"/>
                    <PlotPath id="busroutepath" path={path}/>
                    <AdvancedMarker position={busRoute && { lat: busRoute.latMin, lng: busRoute.lngMin}}></AdvancedMarker>
                </Map>
            </div> 
        </APIProvider>
    );
}

function Markers({ points, icon }) {
    const [markersOpen, setMarkersOpen] = useState({});
    console.log(points)
    useEffect(() => {
        setMarkersOpen(prev => {
            const updated = { ...prev };
            for(const { id } of points) 
                if(!updated[id]) updated[id] = false;
            return updated;
        });
    }, [points]);

    function toggleInfoWindow(id) {
        setMarkersOpen(prev => ({ ...prev, [id]: !prev[id] }));
    }

    return (
        <div>
            {points.map(({ lat, lng, routeTag, heading, id }, idx) => (
                <div key={idx}>
                    <AdvancedMarker position={{ lat, lng }}
                        onClick={() => toggleInfoWindow(id)}
                    ><span style={{fontSize: "1rem"}}>{icon}</span>
                    </AdvancedMarker>
                    {markersOpen[id] && <InfoWindow options={{ disableAutoPan: true, minWidth: 50 }}
                        position={{ lat, lng }} 
                        onCloseClick={() => toggleInfoWindow(id)}
                    ><h3>{routeTag}
                        <svg style={{transform: `rotate(${heading}deg)`}} xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-arrow-up" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5"/>
                        </svg>
                    </h3>
                        
                    </InfoWindow>}
                </div>            
            ))}
        </div>
    );
}

function PlotPath({ path }) {
    const map = useMap();
    const mapsLib = useMapsLibrary("maps");

    async function getNearRoadSegments(segments) {
        const response = await Promise.all(segments.map(segment => axios.get(`${base_roads_url}/nearestRoads`, {
                params: new URLSearchParams({
                    key: process.env.REACT_APP_MAPS_KEY,
                    points: segment.map(({ lat, lng }) => `${lat},${lng}`).join("|")
                })
            })
        ));
        return response.map(({ data: { snappedPoints } }) => snappedPoints
            .map(({ location }) => ({ lat: location.latitude, lng: location.longitude }))
        );
    }

    useEffect(() => {
        if(!mapsLib || !map) return;

        const polylines = [];

        getNearRoadSegments(path).then(snappedPath => {
            for(const segment of snappedPath) {
                polylines.push(new mapsLib.Polyline({
                    path: segment,
                    geodesic: true,
                    strokeColor: "#FF0000",
                    strokeOpacity: 0.75,
                    strokeWeight: 4
                }));
            }
            polylines.forEach(polyline => polyline.setMap(map));
        })
        .catch(console.error);

        return () => polylines.forEach(polyline => polyline.setMap(null));
    }, [mapsLib, map, path]);

    return null;
}