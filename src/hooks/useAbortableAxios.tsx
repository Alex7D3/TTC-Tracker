import { useState, useEffect } from "react";
import { AxiosInstance } from "axios";

export default function useAbortableAxios(axios: AxiosInstance): AxiosInstance {
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

    });
}