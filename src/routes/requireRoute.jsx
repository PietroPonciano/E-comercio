import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireRoute({ requireAuth }) {
    const { permission } = useAuth();

    if (!requireAuth.includes(permission)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}