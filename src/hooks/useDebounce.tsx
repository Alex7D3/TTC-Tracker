import { useState, useEffect } from "react";

export default function useDebounce<T>(payload: T, time: number): T {
    const [debouncedPayload, setDebouncedPayload] = useState<T>(payload);  

    useEffect(() => {
        const timeoutID = setTimeout(() => {
            setDebouncedPayload(payload);
        }, time || 2000);
        
        return () => { clearTimeout(timeoutID); };
    }, [payload, time]);

    return debouncedPayload;
}