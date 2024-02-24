import MapWindow from "./MapWindow";
import { useState, useEffect, createContext } from "react";
import { Route, Routes, useRoutes, Outlet } from "react-router-dom";
import axios from "axios";
import Nav from "./Nav"
import RouteList from "./RouteList";
import Create from "./Create";
import Schedule from "./Schedule.js";
import Signup from "./Signup.js";
import AuthProvider from "./hooks/useAuth";

export default function Home() {
    const [activeBusRoute, setActiveBusRoute] = useState(null);

    return (
        <div>
            <MapWindow busRoute={activeBusRoute}/>
            <Outlet/>
        </div>
    );
}