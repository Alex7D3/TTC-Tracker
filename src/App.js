
import './styles/App.css';

import MapWindow from './components/MapWindow';
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Nav from './components/Nav'
import RouteList from './components/RouteList';
import Create from './components/Create';
function App() {
    return (
        <div className="App">
            <header className="App-header"></header>
            <Nav />
            <main>
                <div className="container">
                    <MapWindow/>
                    <Routes>
                        <Route exact path="/" 
                            element={<RouteList/>}
                        />
                        <Route path="/create" 
                            element={<Create/>}
                        />
                    </Routes>
                </div>
            </main>
            <footer className="footer mt-auto pt-5 pl-2">
                <div className="container text-muted">
                    Not affliated with the TTC. Created by Alex Odorico.
                </div>
            </footer>
        </div>
    );
}

export default App;
