import {lazy} from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import PrivateRoute from "./core/components/PrivateRoute";
import InterceptPage from "./app/intercept/InterceptPage";
import {homePath, loginPath} from "./app/Const";

// Admin
const Admin = lazy(() => import("./admin/pages/Admin"));
const Dashboard = lazy(() => import("./app/dashboard/Dashboard"));
const Entry = lazy(() => import("./app/dashboard/Entry"));

// Auth
const Login = lazy(() => import("./admin/pages/Login"));

// Core
const Forbidden = lazy(() => import("./core/pages/Forbidden"));
const NotFound = lazy(() => import("./core/pages/NotFound"));

// Landing
const ConnectionPage = lazy(() => import("./app/connection/ConnectionPage"));

// Users
const ProxyPage = lazy(() => import("./app/proxy/ProxyPage"));

const LogsPage = lazy(() => import("./app/logs/LogsPage"))

const AppRoutes = () => {
    return (
        <Routes basename="/">
            <Route path={"/"} element={<Entry/>}/>
            <Route path={loginPath} element={<Login/>}/>
            <PrivateRoute path={homePath} element={<Admin/>}>
                <PrivateRoute path="/" element={<Dashboard/>}/>
                <PrivateRoute path="proxy" element={<ProxyPage/>}/>
                <PrivateRoute path="connection" element={<ConnectionPage/>}/>
                <PrivateRoute path="intercept" element={<InterceptPage/>}/>
                <PrivateRoute path="logs" element={<LogsPage/>}/>
            </PrivateRoute>
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
