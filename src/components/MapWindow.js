import { useState } from "react";
import {
    APIProvider,
    Map,
    AdvancedMarker,
    Pin,
    InfoWindow
} from "@vis.gl/react-google-maps";

export default function MapWindow() {
    const toronto = {lat:  43.65, lng: -79.34};
    return (
        <APIProvider apiKey={process.env.REACT_APP_MAPS_KEY} >
            <div id="map-box" style={{height: "50vh"}} className="row">
                <Map zoom={12} center={toronto} 
                    options={{ disableDefaultUI: true }} 
                    mapId={process.env.REACT_APP_MAP_ID}>
                    <AdvancedMarker position={toronto}></AdvancedMarker>
                </Map>
            </div>
            
        </APIProvider>
    );
}