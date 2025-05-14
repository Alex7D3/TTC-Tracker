import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { act } from "react-dom/test-utils";
import api from "../api.json";

function BusRoute({ markDeletion, markActive, isActive, route }) {
    const { name, busTitle, stopTitle, dirTitle, busTag, stopTag, _id } = route;

    return (
        <tr className={isActive ? "table-active" : ""}>
            <td>{name}</td>
            <td>{busTitle}</td>
            <td>{stopTitle}</td>
            <td>{dirTitle}</td>
            <td>
                <div className="btn-group" role="group">
                    <button className="btn btn-primary" onClick={markActive} disabled={isActive}>
                        Activate
                    </button>
                    <Link className="btn btn-secondary" to={`/schedule/${busTag}/${stopTag}/${dirTitle}`}>
                        View Schedule
                    </Link>
                    <Link className="btn btn-warning" to="/edit" state={route} >
                        Edit
                    </Link>
                    <button className="btn btn-danger" data-bs-toggle="modal" data-bs-target={`#delete${_id}`}>
                        Delete
                    </button>
                </div>
                <div className="modal" id={`delete${_id}`} tabIndex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="confirmModalLabel">
                                    {`Delete Route "${name}", ${busTitle} @ ${stopTitle} (${dirTitle})`}</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                        <div className="modal-body">Are you sure you want to delete this Route?</div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={markDeletion}>
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </td>
        </tr>
    );
}

export default function RouteList({ setActiveBusRoute }) {
    const [busRoutes, setBusRoutes] = useState([]);
    const [activeIdx, setActiveIdx] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        axios.get(`/users`, {
            signal: controller.signal
        })
        .then(response => isMounted && setBusRoutes(response.data))
        .catch(console.error);

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    function deleteBusRoute(_id) {
        axios.delete(`${process.env.REACT_APP_BASE_URI}/user-route/delete/${_id}`, {
            
        })
        .then(() => {
            setBusRoutes(busRoutes.filter(route => route._id !== _id));
            setActiveBusRoute(null);
        })
        .catch(console.error);
    }

    function activateBusRoute(idx) {
        setActiveIdx(idx);
        setActiveBusRoute(busRoutes[idx]);
    }

    return (
        <div className="row pt-3 pb-5">
            <div className="col-auto"><h3>Routes</h3></div>
            <div className="col">
                <Link to="/create">
                    <button className="btn btn-success">Add</button>
                </Link>
            </div>
            <table className="table table-striped">
                <thead className="table-dark">
                    <tr>
                        <th>Name</th>
                        <th>Bus</th>
                        <th>Stop</th>
                        <th>Direction</th>
                        <th/>
                    </tr>
                </thead>
                <tbody>
                    {busRoutes.map((item, idx) => 
                        <BusRoute
                            key={idx}
                            route={item}
                            markDeletion={() => deleteBusRoute(item._id)}
                            markActive={() => activateBusRoute(idx)}
                            isActive={idx === activeIdx}
                        />
                    )}
                </tbody>
            </table>
        </div>
    );
}