
import "./styles/App.css";
import MapWindow from "./components/MapWindow";
import { useState, useEffect, createContext } from "react";
import axios from "axios";
import Nav from "./components/Nav"
import RouteList from "./components/RouteList";
import Create from "./components/Create";
import Schedule from "./components/Schedule.js";
import Signup from "./components/Signup.js";
import Home from "./components/Home.js";
import AppRoutes from "./components/AppRoutes.js";
import { Route, Routes } from "react-router-dom";

function App() {
    return (
        <div className="App">
            <header className="App-header"></header>
            <Nav />
            <main className="container">
                <Routes>
                    <Route/>
                </Routes>
            </main>
            <footer className="footer pt-5 relative-bottom">
                <div className="container text-muted">
                    Not affiliated with the TTC. Created by Alex Odorico.
                </div>
            </footer>
        </div>
    );
}

export default App;