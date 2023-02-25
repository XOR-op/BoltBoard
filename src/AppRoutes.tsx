import {lazy} from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import PrivateRoute from "./core/components/PrivateRoute";

// Admin
const Admin = lazy(() => import("./admin/pages/Admin"));
const Dashboard = lazy(() => import("./admin/pages/Dashboard"));
const Home = lazy(() => import("./admin/pages/Home"));

// Auth
const Login = lazy(() => import("./proxy/Login"));

// Core
const Forbidden = lazy(() => import("./core/pages/Forbidden"));
const NotFound = lazy(() => import("./core/pages/NotFound"));

// Landing
const ConnectionPage = lazy(() => import("./connection/ConnectionPage"));

// Users
const ProxyPage = lazy(() => import("./proxy/ProxyPage"));

const AppRoutes = () => {
    const endpoint = 'http://localhost:18086'
    return (
        <Routes basename={process.env.PUBLIC_URL}>
            <Route path="/" element={<Login/>}/>
            <PrivateRoute path="admin" element={<Admin/>}>
                <PrivateRoute path="/" element={<Home/>}/>
                <PrivateRoute path="dashboard" element={<Dashboard/>}/>
                <PrivateRoute path="proxy" element={<ProxyPage endpoint={endpoint}/>}/>
                <PrivateRoute path="connection" element={<ConnectionPage endpoint={endpoint}/>}/>
            </PrivateRoute>
            {/*<Route path="login" element={<Login/>}/>*/}
            <Route path="403" element={<Forbidden/>}/>
            <Route path="404" element={<NotFound/>}/>
            <Route
                path="*"
                element={<Navigate to={`/${process.env.PUBLIC_URL}/404`} replace/>}
            />
        </Routes>
    );
};

export default AppRoutes;
