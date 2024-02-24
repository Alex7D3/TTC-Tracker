import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from "./hooks/useAuth";

export default function Nav() {
    const token = null
    //const { token } = useAuth();//include username in auth too
    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark">
            <div className="container">
                <NavLink className="navbar-brand" to={token ? "/home" : "/"}>
                    <h2>TTC Tracker</h2>
                </NavLink>
                <NavLink className="navbar-brand" to={token ? "/logout" : "/"}>
                    <strong>{token ? "Logout" : "Login"}</strong>
                </NavLink>
                {token || <NavLink className="navbar-brand" to="/signup">
                    <strong>Signup</strong>
                </NavLink>}
            </div>
        </nav>
    );
}