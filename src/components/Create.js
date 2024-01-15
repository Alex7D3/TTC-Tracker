import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import MapWindow from './MapWindow';
import PopupList from './PopupList';

export default function Create() {

    const [route, setRoute] = useState({
        stop: '',
        route: '',
        direction: ''
    });
    const [stopExists, setStopExists] = useState(false);
    const [routeExists, setRouteExists] = useState(false);
    const [stopList, setStopList] = useState([]);
    const [routeList, setRouteList] = useState([]);

    const navigate = useNavigate();
    
    function isRouteValid(text) {

        //if route exists
    }

    function isStopValid(route, text) {
        //if route has stop
    }

    async function onSubmit(e) {
        e.preventDefault();
        const createdRoute = { ...route };
        if(true) {

        }
        await axios.post(`${process.env.BASE_URI}/bus-route/add`, {
            headers: { "Content-Type": 'application/json' },
            body: JSON.stringify(createdRoute)
        })
        .catch(window.alert);
        setRoute({
            stop: '',
            route: '',
            direction: ''
        });
        navigate('/');
    }

    async function onStopChange({ target: { value } }) {
        setRoute(prev => ({...prev, stop: value }));
        if(value.length) {
            // await axios
            // .get(`${process.env.BASE_URI}/bus-route/add/autocomplete/stop/${value}`)
            // .then((res) => setStopList(res));
        }
        else {
            setStopList([]);
        }
        if(value.length && isStopValid(value)) {
            setStopExists(true);
        }
        else {
            setStopExists(false);
        }
    }

    async function onRouteChange({ target: { value } }) {
        setRoute(prev => ({...prev, route: value }));
        if(value.length) {
            // await axios
            // .get(`${process.env.BASE_URI}/bus-route/add/autocomplete/route/${value}`)
            // .then((res) => setRouteList(res));
        }
        else {
            setRouteList([]);
        }
        if(value.length && isRouteValid(value)) {
            setRouteExists(true);
        }
        else {
            setRouteExists(false);
        }
    }

    return (
        <div className="row pt-3">
            <h3>Create Bus Route</h3>
            <form onSubmit={onSubmit} nonvalidate className="form-inline">
                <div className="row form-group align-items-center pb-5">
                    <div className="col my-1">
                        <label for="route" className="sr-only">Bus Route</label>
                        <input
                            type="text"
                            id="route"
                            className={`form-control${routeExists ? " was-validated": ""}`}
                            placeholder="Enter bus route"
                            value={route.route}
                            onChange={onRouteChange}
                        />
                        <PopupList isOpen={route.route.length} items={routeList} />
                    </div>
                    <div className="col my-1">
                        <label for="stop" className="sr-only">Stop</label>
                        <input
                            type="text"
                            id="stop"
                            className={`form-control${stopExists ? " was-validated": ""}`}
                            placeholder="Enter stop"
                            value={route.stop}
                            onChange={onStopChange}
                            disabled={!routeExists}
                        />
                        <PopupList isOpen={route.stop.length} items={stopList} />
                    </div>
                </div>
                <div className="row pt-5 mt-5">
                    <div className="col-sm-3 col-md-5">
                        <select class="form-select" disabled={!routeExists || !stopExists}>
                            <option selected>Incoming</option>
                            <option>Outgoing</option>
                        </select>
                    </div>
                    
                    <div className="col btn-group">
                        <input
                            type="submit"
                            value="Create Route"
                            disabled={!stopExists || !routeExists}
                            className="btn btn-primary"
                        />
                        <Link to="/" className="btn btn-danger" onClick={() => {
                                setRoute({ stop: '', route: '', direction: ''});
                            }}>
                            Cancel
                        </Link>
                       
                    </div>   
                </div>
            </form>
        </div>
    );
}