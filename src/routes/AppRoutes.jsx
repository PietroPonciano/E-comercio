import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Layout from "../pages/Layout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Password from "../pages/Password";
import ProtectedRoute from "../pages/ProtectedRoute";
import Perfil from "../pages/Perfil";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<Password />} />
        </Route>

        
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/profile" element={<Perfil />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}