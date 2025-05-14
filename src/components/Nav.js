import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from "./hooks/useAuth";

export default function Nav() {
    const { auth } = useAuth();//include username in auth too
    return (
        <div>
            <nav className="navbar navbar-expand navbar-dark bg-dark">
                <div className="container">
                    <NavLink className="navbar-brand" to="/home">
                        <h2>TTC Tracker</h2>
                    </NavLink>
                    <NavLink className="navbar-brand" to={auth ? "/logout" : "/"}>
                        <strong>{auth ? "Logout" : "Login"}</strong>
                    </NavLink>
                    {auth || <NavLink className="navbar-brand" to="/signup">
                        <strong>Signup</strong>
                    </NavLink>}
                </div>
            </nav>
            <Outlet/>
        </div>

    );
}