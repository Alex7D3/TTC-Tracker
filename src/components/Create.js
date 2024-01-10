import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Trie from '../trie.js';

export default function Create() {
    const [route, setRoute] = useState({
        from: "",
        to: ""
    });
    const navigate = useNavigate();
    
    async function onSubmit(e) {
        e.preventDefault();
        const createdRoute = { ...route };
        await axios()
    }

    function onChange() {
        
    }

    return (
        <div>
            <h3>Create Bus Route</h3>
            <form onSubmit={onSubmit}>
                <div className="form-box">

                </div>
            </form>
        </div>
    );
}