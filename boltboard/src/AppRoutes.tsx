import {lazy} from "react";
import {Navigate, Route, Routes} from "react-router-dom";
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
const LogsPage = lazy(() => import("./app/logs/LogsPage"))

const AppRoutes = () => {
    return (
        <Routes basename="/">
            <Route path={"/"} element={<Entry/>}/>
            <Route path={loginPath} element={<Login/>}/>
            <Route path={homePath} element={<Admin/>}>
                <Route path="/" element={<Dashboard/>}/>
                <Route path="connection" element={<ConnectionPage/>}/>
                <Route path="intercept" element={<InterceptPage/>}/>
                <Route path="logs" element={<LogsPage/>}/>
            </Route>
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
