import React, { useReducer, useContext, useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import { useNavigate, Link, useLocation, useOutletContext } from "react-router-dom";
import axios from "axios";
import PopupList from "./PopupList";

export default function Create() {

    const { state: route } = useLocation();
    
    function useDebounce(callback, time) {
        useEffect(() => {
            let timeoutID = setTimeout(() => {
    
            }, time);
            return () => clearTimeout(timeoutID);
        }, [state.busTitle]);
    }

    const initialState = route || {
        busTitle: "",
        busTag: "",
        dirTitle: "",
        dirTag: "",
        stopTitle: "",
        stopTag: "",
        stopId: "",
        name: "",
        busList: [],
        dirList: [],
        stopList: []
    };
    
    const [state, dispatch] = useReducer((state, action) => {
        switch(action.type) {
            case "CLEAR": {
                return { ...initialState };
            }
            case "NAME-TYPE": {
                return { ...state, name: action.name };
            }
            case "BUS-SUGGEST": {
                return { ...state, busList: action.busList };
            }
            case "BUS-TYPE": {
                return { 
                    ...state,
                    busTitle: action.title,
                    busTag: "",
                    dirList: [],
                    dirTitle: "",
                    dirTag: "",
                    stopTitle: "",
                    stopId: "",
                };
            }
            case "BUS-SUBMIT": {
                const { busList } = state;
                if(busList.length) {
                    const dirList = busList[action.idx].direction;
                    return {
                        ...state,
                        busTitle: busList[action.idx].title,
                        busTag: busList[action.idx].tag,
                        bus_id: busList[action.idx]._id,
                        dirList,
                        dirTitle: dirList[0].branch,
                        dirTag: dirList[0].tag,
                        latMin: busList[0].latMin,
                        latMax: busList[0].latMax,
                        lngMin: busList[0].lonMin,
                        lngMax: busList[0].lonMax,
                        busList: []
                    };
                }
                return state;
            }
            case "DIR-SELECT": {
                const { dirList } = state;
                return {
                    ...state,
                    dirTitle: dirList[action.idx].title,
                    dirTag: dirList[action.idx].tag,
                    stopTitle: "",
                    stopId: "",
                    stopList: []
                };
            }
            case "STOP-SUGGEST": {
                return { ...state, stopList: action.stopList };
            }
            case "STOP-TYPE": {
                return { ...state, stopTitle: action.title, stopTag: "" };
            }
            case "STOP-SUBMIT": {
                const { stopList } = state;
                if(stopList.length) {
                    return {
                        ...state,
                        stopTitle: stopList[action.idx].title,
                        stopId: stopList[action.idx].stopId,
                        stopTag: stopList[action.idx].tagPairs[state.dirTag],
                        stopList: []
                    };
                }
                return state;
            }
            default: throw Error(`Unknown action ${action.type}`);
        }
    }, 
    { ...initialState }); 

    const navigate = useNavigate();

    async function onSubmit(e) {
        e.preventDefault();
        if(route) {
            delete state._id;
            await axios.patch(`${process.env.REACT_APP_BASE_URI}/user-route/${route._id}`, 
                state, { headers: { "Content-Type": "application/json" }}
            ).catch(window.alert);
        } else {
            await axios.post(`${process.env.REACT_APP_BASE_URI}/user-route`, 
                state, { headers: { "Content-Type": "application/json" } }
            ).catch(window.alert);
        }
        console.log(state);
        dispatch({ type: "CLEAR" });
        navigate("/");
    }

    async function onBusChange(e) {
        e.preventDefault();
        const input = e.target.value.replaceAll("/", "").replaceAll("\\", "");
        if(input.length) {
            axios.get(`${process.env.REACT_APP_BASE_URI}/bus-route/autocomplete/${input}`)
            .then(res => dispatch({ type: "BUS-SUGGEST", busList: res.data }))
            .catch(console.error);
            
        }
        dispatch({ type: "BUS-TYPE", title: input });
    }

    async function onStopChange(e) {
        e.preventDefault();
        const input = e.target.value.replaceAll("/", "").replaceAll("\\", "");
        if(input.length && state.busTag.length) {
            axios.get(`${process.env.REACT_APP_BASE_URI}/bus-route/autocomplete/${state.dirTag}/${input}`)
            .then(res => dispatch({ type: "STOP-SUGGEST", stopList: res.data }))
            .catch(console.error);
        }
        dispatch({ type: "STOP-TYPE", title: input });
    }

    return (
        <div className="row mt-3">
            <h3 className="col-auto">{route ? "Edit" : "Create"} Bus Route</h3>
            <div className="col">
                <Link to="/" className="btn btn-danger" onClick={() => {
                    dispatch({ type: "CLEAR" });
                }}>Cancel
                </Link>
            </div>
            <form onSubmit={onSubmit} noValidate autoComplete="off" className="form needs-validation">
                <div className="form-row pb-5">
                    <div className="col">
                        <label htmlFor="name" className="sr-only">Route Name</label>
                        <input
                            type="text"
                            maxLength="20"
                            id="name"
                            className="form-control"
                            placeholder="Enter Name"
                            value={state.name}
                            required
                            onKeyDown={e => e.code === "Enter" && e.preventDefault()}
                            onChange={e => dispatch({ type: "NAME-TYPE", name: e.target.value })}
                        />
                    </div>
                </div>
                <div className="form-row py-5">
                    <div className="col">
                        <label htmlFor="bus" className="sr-only">Bus</label>
                        <input
                            type="text"
                            maxLength="40"
                            id="bus"
                            className={`form-control${state.busTitle.length ? " was-validated": ""}`}
                            placeholder="Enter bus route"
                            value={state.busTitle}
                            onBlur={() => dispatch({ type: "BUS-SUBMIT", idx: 0 })}
                            onChange={onBusChange}
                            onKeyDown={e => e.code === "Enter" && e.preventDefault()}
                            required
                            disabled={!state.name.length}
                        />
                        <PopupList 
                            items={state.busList} 
                            clickFunction={idx => dispatch({ type: "BUS-SUBMIT", idx })}
                        />
                    </div>
                </div>
                <div className="form-row py-5">
                    <div className="col">
                        <label htmlFor="direction" className="sr-only">Direction</label>
                        <select 
                            id="direction" 
                            className="form-select"
                            defaultValue="Incoming" 
                            onChange={e => dispatch({ type: "DIR-SELECT", idx: e.target.value })}
                            disabled={!state.name.length || !state.busTitle.length}
                        >
                            {state.dirList.map((dir, idx) =>
                                <option key={idx} value={idx} >
                                    {dir.title}
                                </option>
                            )}  
                        </select>
                    </div>
                </div>
                <div className="form-row py-5 mb-auto">
                    <label htmlFor="stop" className="sr-only">Stop</label>
                    <div className="col input-group">
                        <input
                            type="text"
                            maxLength="50"
                            id="stop"
                            className={`form-control${state.stopTitle.length ? " was-validated": ""}`}
                            placeholder="Enter stop"
                            value={state.stopTitle}
                            onBlur={() => dispatch({ type: "STOP-SUBMIT", idx: 0 })}
                            onChange={onStopChange}
                            onKeyDown={e => e.code === "Enter" && e.preventDefault()}
                            required
                            disabled={!state.name.length || !state.busTitle.length}
                        />
                        <input
                            type="submit"
                            value={route ? "Set Route" : "Create Route"}
                            disabled={!state.name.length || !state.busTag.length || !state.stopId.length}
                            className="btn btn-primary"
                        />
                    </div>
                    <div className="col"><PopupList 
                            items={state.stopList}
                            clickFunction={idx => dispatch({ type: "STOP-SUBMIT", idx })}
                        /></div>
                </div>
            </form>
        </div>       
    );
}