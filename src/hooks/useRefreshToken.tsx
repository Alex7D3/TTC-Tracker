import { useAuth } from "./useAuth";
import protectedAxios from "../util/axios";

export default function useRefreshToken() {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const res = await protectedAxios.get("/refresh");
        
        setAuth((prev) => {
            const { data: { accessToken }} = res;
            console.log(JSON.stringify(prev));
            console.log(accessToken);
            return {...prev, accessToken };
        });
        return accessToken;
    };
}