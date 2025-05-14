import { 
    createContext,
    useContext,
    useState,
    ReactNode,
} from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";

type Auth = {
    id: number;
    name: string;
    accessToken: string;
};

type AuthContextType = {
    auth: Auth | null;
    setAuth: React.Dispatch<React.SetStateAction<Auth | null>>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [auth, setAuth] = useState<Auth | null>(null);
    
    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);