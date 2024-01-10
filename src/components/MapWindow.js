import { useState } from "react";
import "./styles/mapwindow.css";
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
        <APIProvider apiKey={process.env.REACT_APP_MAPS_KEY}>
            <div id="map-box" >
                <Map zoom={12} center={toronto} mapId={process.env.REACT_APP_MAP_ID}>
                    <AdvancedMarker position={toronto}></AdvancedMarker>
                </Map>
            </div>
            
        </APIProvider>
    );
}