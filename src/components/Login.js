import { useRef, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";

export default function Login() {
    const { auth, setAuth } = useAuth();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const isLogin = location.pathname === "/login";
    const navigate = useNavigate();
    const errRef = useRef();
    const [errMsg, setErrMsg] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    axios.defaults.withCredentials = true;

    function onSubmit(e) {
        e.preventDefault();
        axios.post("/" + location.pathname, 
        (isLogin ? 
            { username_or_email: username, password } : 
            { username, email, password } 
        ))
        .then((result) => {
            setAuth(result);
            setEmail("");
            setUsername("");
            setPassword("");
            navigate("/home", { replace: true });
        })
        .catch(err => {
            if(err.response) setErrMsg(err.message);
            else setErrMsg("Something went wrong. Try again later.");
        });
    }

    return (<div className="row d-flex justify-content-center align-items-center bg-dark vh-100">
        <div className="col p-3 bg-white">
            <h2>{isLogin ? "Signup" : "Login"}</h2>
            <form className="form needs-validation" noValidate autoComplete="off" onSubmit={onSubmit}>
                {isLogin || <div className="form-row mb-3">
                    <label htmlFor="email"><strong>Email</strong></label>
                    <input
                        type="email"
                        placeholder="Enter Email"
                        name="email"
                        className="form-control"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>}
                <div className="form-row mb-3">
                    <label htmlFor="name"><strong>{isLogin ? "Username" : "Username or Email"}</strong></label>
                    <input
                        type="text"
                        placeholder={isLogin ? "Enter Username or Email" : "Enter UserName"}
                        name="name"
                        className="form-control"
                        onChange={(e) => setUsername(e.target.value)}
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
                        value={isLogin ? "Login" : "Register"}
                        name="pass"
                        className="btn-primary"
                    />
                </div>
                <div className="form-row mb-3">
                    <label htmlFor="login">{isLogin ? "New Account" : "Login"}</label>
                    <Link to={isLogin ? "/signup" : "/login"} name="login">
                        {isLogin ? "Register" : "Login"}
                    </Link>
                </div>
            </form>
        </div>
    </div>);
}