import { useState, useRef } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
    const { pathname } = useLocation();
    const state = useRef(pathname === "/signup");
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    axios.defaults.withCredentials = true;

    function onSubmit(e) {
        e.preventDefault();
        axios.post(`${process.env.REACT_APP_BASE_URI}${pathname}`, { name, password, email })
        .then((result) => {
            if(result.ok) navigate("/");
            else {
                //put the error message sent here
            }
            
        })
        .catch(console.error);
    }

    return (
        <div className="row d-flex justify-content-center align-items-center bg-dark vh-100">
            <div className="col p-3 bg-white">
                <h2>{state.current ? "Signup" : "Login"}</h2>
                <form className="form needs-validation" noValidate autoComplete="off" onSubmit={onSubmit}>
                    <div className="form-row mb-3">
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            name="email"
                            className="form-control"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-row mb-3">
                        <label htmlFor="name"><strong>Username</strong></label>
                        <input
                            type="text"
                            placeholder="Enter Username"
                            name="name"
                            className="form-control"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="form-row mb-3">
                        <label htmlFor="pass"><strong>Password</strong></label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            name="pass"
                            className="form-control"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-row mb-3">
                        <input
                            type="submit"
                            value={state.current ? "Register" : "Login"}
                            name="pass"
                            className="btn-primary"
                        />
                    </div>
                    <div className="form-row mb-3">
                        <label htmlFor="login">{state.current ? "Existing account" : "New Account"}</label>
                        <Link to={state.current ? "/login" : "/signup"} name="login">
                            {state.current ? "Login" : "Register"}
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}