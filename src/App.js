
import "./styles/App.css";
import MapWindow from "./components/MapWindow";
import { useState, useEffect, createContext } from "react";
import axios from "axios";
import Nav from "./components/Nav"
import RouteList from "./components/RouteList";
import Create from "./components/Create";
import Schedule from "./components/Schedule.js";
import Login from "./components/Login.js";
import Home from "./components/Home.js";
import AppRoutes from "./components/AppRoutes.js";
import { Routes, Route, Outlet } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.js";

function Layout() {
    return (
        <div className="App">
            <Nav/>
            <main className="container">
                <Outlet/>
            </main>
            <footer>
                Not affiliated with the TTC. Created by Alexander Odorico.
            </footer>
        </div>
    );
}

function App() {
    return (<Routes>
        <Route element={<Layout/>}>
            {/* public */}
            <Route path="/" element={<></>}/>
            <Route path="login" element={<Login/>}/>
            <Route path="signup" element={<Login/>}/>

            {/* protected */}
            <Route element={<ProtectedRoute/>}>
                <Route path="home" element={<Home/>}>
                    <Route path="routes" index element={<RouteList/>}/>
                    <Route path="schedule" element={<Schedule/>}/>
                    <Route path="create" element={<Create/>}/>
                    <Route path="edit" element={<Create/>}/>
                </Route>
            </Route>

            {/* missing */}
            <Route path="*" element={<></>}/>
        </Route>
    </Routes>);
}

export default App;