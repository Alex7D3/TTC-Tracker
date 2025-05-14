import axiosProtected from "../util/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import { useAuth } from "./useAuth";
import axios, { AxiosError, AxiosResponse } from "axios";

export default function useAxiosProtected() {
    const { auth } = useAuth();
    const refresh = useRefreshToken();
    useEffect(() => {
        const reqIntercept = axiosProtected.interceptors.request.use(
            (reqConfig: IConfig) => {
                if(!reqConfig.headers["Authentication"])
                    reqConfig.headers["Authentication"] = "Bearer " + auth?.accessToken;
                return reqConfig;
            },
            (err) => Promise.reject(err)
        );

        const resIntercept = axiosProtected.interceptors.response.use(
            (res: AxiosResponse) => res,
            async (err: AxiosError) => {
                const prevReq = err.config;
                if(err?.response?.status === 403 && !prevReq?.retry) {
                    prevReq.retry = true;
                    const accessToken = await refresh();
                    
            }
        );

        return () => {
            axiosProtected.interceptors.request.eject(reqIntercept);
            axiosProtected.interceptors.response.eject(resIntercept);
        };
    }, [auth])
    return axiosPrivate;

}