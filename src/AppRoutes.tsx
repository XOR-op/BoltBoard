import {lazy} from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import PrivateRoute from "./core/components/PrivateRoute";

// Admin
const Admin = lazy(() => import("./admin/pages/Admin"));
const Dashboard = lazy(() => import("./admin/pages/Dashboard"));
const Home = lazy(() => import("./admin/pages/Home"));
const Profile = lazy(() => import("./admin/pages/Profile"));
const ProfileActivity = lazy(() => import("./admin/pages/ProfileActivity"));
const ProfileInformation = lazy(
    () => import("./admin/pages/ProfileInformation")
);
const ProfilePassword = lazy(() => import("./admin/pages/ProfilePassword"));

// Auth
const Login = lazy(() => import("./auth/pages/Login"));
const Register = lazy(() => import("./auth/pages/Register"));

// Core
const Forbidden = lazy(() => import("./core/pages/Forbidden"));
const NotFound = lazy(() => import("./core/pages/NotFound"));

// Landing
const Landing = lazy(() => import("./landing/pages/Landing"));

// Users
const UserManagement = lazy(() => import("./users/pages/UserManagement"));
const ProxyPage = lazy(() => import("./proxy/ProxyPage"));

const AppRoutes = () => {
    const endpoint = 'http://localhost:18086'
    return (
        <Routes basename={process.env.PUBLIC_URL}>
            <Route path="/" element={<Landing/>}/>
            <PrivateRoute path="admin" element={<Admin/>}>
                <PrivateRoute path="/" element={<Home/>}/>
                <PrivateRoute path="proxy" element={<ProxyPage endpoint={endpoint}/>}/>
                <PrivateRoute path="dashboard" element={<Dashboard/>}/>
                <PrivateRoute path="profile" element={<Profile/>}>
                    <PrivateRoute path="/" element={<ProfileActivity/>}/>
                    <PrivateRoute path="information" element={<ProfileInformation/>}/>
                    <PrivateRoute path="password" element={<ProfilePassword/>}/>
                </PrivateRoute>

                <PrivateRoute path="user-management" element={<UserManagement/>}/>
            </PrivateRoute>
            <Route path="login" element={<Login/>}/>
            <Route path="register" element={<Register/>}/>
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
