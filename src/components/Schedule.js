import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import api from "../api.json";
import axios from "axios";

const { base_url, a, commands } = api;
const parser = new DOMParser();

function Spinner() {
    return (
        <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
                <span className="sr-only"></span>
            </div>
        </div>
    );
}

export default function Schedule() {
    const { busTag, stopTag, dirTag, direction } = useParams();
    const [schedTitles, setSchedTitles] = useState([]);
    const [times, setTimes] = useState([]);

    useEffect(() => {
        axios.get(base_url, { 
            params: { a, command: commands[2], r: busTag } 
        })
        .then(({ data }) => {
            const doc = parser.parseFromString(data, "text/xml");
            setSchedTitles([...doc.querySelector("header").children]);
            setTimes([...doc.querySelectorAll("tr")].slice(0, 80));
        })
        .catch(console.error);

        axios.get(base_url, {
            params: { a, command: commands[3], r: busTag }
        })
        .then(({ data }) => {
            const doc = parser.parseFromString(data, "text/xml");

        })
        .catch(console.error)
        
    }, [busTag, stopTag]);

    
    return (
        <div className="row pt-3">
            <div className="col">
                <h3>Schedule: {direction} | {}</h3>
                
            </div>
            {!schedTitles.length ? <Spinner/> : 
            <div className="table-responsive">
                <table className="table table-striped">
                    
                    <thead className="table-dark text-nowrap">
                        <tr>{schedTitles.map((header, idx) => {
                            const tag = header.getAttribute("tag");
                            return (
                                <th key={idx} className={tag === stopTag ? "table-primary" : ""}>
                                {header.innerHTML + tag.contains("_ar") ? " (arrival)" : ""}</th>
                            );
                        })}</tr> 
                    </thead>
                    <tbody>
                        {times.map((block, idx) => 
                        <tr>{[...block.children].map(cell => {
                            const epoch = parseInt(cell.getAttribute("epochTime"));
                            return (
                                <td key={idx} className="text-center">{
                                    epoch !== -1 ? new Date(epoch).toLocaleTimeString('en-US', {
                                        timeZone:'UTC', hour12: true, hour: 'numeric', minute: 'numeric'
                                    }
                                  ) : "--"
                                }</td>
                            );
                        })}</tr>)}
                    </tbody>
                </table>
            </div>
                
            }
        </div>
    );
}