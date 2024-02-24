import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext(null);

export default function AuthProvider ({ children }) {
    const[token, setToken] = useState(localStorage.getItem("token"));
    
    useEffect(() => {
        if(token) {
            axios.defaults.headers.common["authorization"] = `Bearer ${token}`;
            localStorage.setItem("token", token);
        } else {
            delete axios.defaults.headers.common["authorization"];
            localStorage.removeItem("token");
        }
    }, [token]);

    const value = useMemo(() => ({ token, setToken }), [token]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);