import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { ProtectedRoute } from "./ProtectedRoute";
import Signup from "./Signup";
import Home from "./Home";
import RouteList from "./RouteList";
import Schedule from "./Schedule";
import Create from "./Create";

export default function AppRoutes() {
    const { token } = useAuth();
    
    const noAuthRoutes = [
        { element}
        { path: "/", element: <div>TTCTracker blablabla</div> },//make simple noauth homepage
        { path: "/login", element: <Signup/> },
        { path: "/signup", element: <Signup/> }
    ];

    const authRoutes = [
        { 
            path: "/home",
            element: <Home/>,
            children: [
                { path: "routes", element: <RouteList/> },
                { path: "schedule", element: <Schedule/> },
                { path: "create", element: <Create/> },
                { path: "edit", element: <Create/> }

            ]
        },

    ];
    const router = createBrowserRouter(token ? authRoutes : noAuthRoutes);

    return (<RouterProvider router={router}/>);
}