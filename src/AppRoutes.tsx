import {lazy} from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import PrivateRoute from "./core/components/PrivateRoute";
import MitmPage from "./app/mitm/MitmPage";

// Admin
const Admin = lazy(() => import("./admin/pages/Admin"));
const Dashboard = lazy(() => import("./app/dashboard/Dashboard"));

// Auth
const Login = lazy(() => import("./admin/pages/Login"));

// Core
const Forbidden = lazy(() => import("./core/pages/Forbidden"));
const NotFound = lazy(() => import("./core/pages/NotFound"));

// Landing
const ConnectionPage = lazy(() => import("./app/connection/ConnectionPage"));

// Users
const ProxyPage = lazy(() => import("./app/proxy/ProxyPage"));

const AppRoutes = () => {
    const endpoint = 'http://localhost:18086'
    return (
        <Routes basename="/">
            <Route path="/" element={<Login/>}/>
            <PrivateRoute path="/admin" element={<Admin/>}>
                <PrivateRoute path="/" element={<Dashboard/>}/>
                <PrivateRoute path="proxy" element={<ProxyPage/>}/>
                <PrivateRoute path="connection" element={<ConnectionPage/>}/>
                <PrivateRoute path="mitm" element={<MitmPage/>}/>
            </PrivateRoute>
            {/*<Route path="login" element={<Login/>}/>*/}
            <Route path="403" element={<Forbidden/>}/>
            <Route path="404" element={<NotFound/>}/>
            <Route
                path="*"
                element={<Navigate to={`/404`} replace/>}
            />
        </Routes>
    );
};

export default AppRoutes;
