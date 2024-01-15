import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Route({ from, to, direction, id }) {
    return (
        <tr className="col-lg-8">
            <td>{from}</td>
            <td>{to}</td>
            <td>{"a"}</td>
            <td>
                <Link 
                    className="btn btn-link" 
                    to={`/edit/${id}`}>Edit</Link>
            </td>
        </tr>
    );
}

export default function RouteList() {
    const [routes, setRoutes] = useState([]);
    useEffect(() => {
        (async () => {
            const response = await axios.get(`/`)
            .then(setRoutes)
            .catch(error => 
                window.alert(`The response genereated an error: ${response.statusText}`)
            );

        })();
    }, [routes.length]);


    return (
        <div className="row pt-3 pb-5">
            <div className="container">
                <div className="row">
                    <div className="col-auto"><h3>Routes</h3></div>
                    <div className="col">
                        <Link to="/create">
                            <button className="btn btn-success">Add</button>
                        </Link>
                    </div>
                </div>
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Stop</th>
                        <th>Route</th>
                        <th>Direction</th>
                    </tr>
                </thead>
                <tbody>
                {}
                </tbody>
            </table>
        </div>
    );
}