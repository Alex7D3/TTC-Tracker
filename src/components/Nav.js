import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Nav() {
    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark">
            <div class="container">
                <NavLink className="navbar-brand" to="/"><h2>TTC Tracker</h2></NavLink>
            </div>
        </nav>
    )
}