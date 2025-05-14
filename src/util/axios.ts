import axios from "axios";
import api from "api.json";

const protectedAxios = axios.create({
    baseURL: `${process.env.REACT_APP_BASE_URI}/auth`,
    headers: { "Content-Type": "application/json" },
    withCredentials: true
});

protectedAxios.interceptors.response.use(
    (response) => response,
    async (err) => {
        const {}
        if(err?.response?.status === 403 && !prevSent?.sent) {
            prevReuquest.sent = true;
            const accessToken = await refresh
        }
            
    }
);

const ttcAxios = axios.create({
    baseURL: api.base_url
});

export default axios.create({
    baseURL: process.env.REACT_APP_BASE_URI
});

export { protectedAxios, ttcAxios };