import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AtendenteRoute() {
    const { permission } = useAuth();

    if (permission != "Atendente") {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}