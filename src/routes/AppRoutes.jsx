import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Layout from "../pages/Layout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Password from "../pages/Password";
import ProtectedRoute from "./ProtectedRoute";
import Perfil from "../pages/Perfil";
import RequireRoute from "./requireRoute";
import Tickets from "../pages/Tickets";
import Contact from "../pages/Contact";
import MyTickets from "../pages/MyTickets";
import Ticket from "../pages/Ticket";
import { useAuth } from "../context/AuthContext";
import Dashboard from "../pages/Dashboard/Dashboard";


export default function AppRoutes() {
  const { Adm, Atendente } = useAuth();
  return (
    <BrowserRouter>
      <Routes>


        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<Password />} />
        </Route>


        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/profile" element={<Perfil />} />
            <Route path="/my-tickets" element={<MyTickets />} />
            <Route path="/tickets/:id" element={<Ticket />} />
          </Route>
        </Route>

        <Route element={<RequireRoute requireAuth={Adm} />}>
          <Route element={<Layout />}>
            <Route path="/painel" element={<Dashboard />} />
          </Route>
        </Route>

        <Route element={<RequireRoute requireAuth={[Atendente, Adm]} />}>
          <Route element={<Layout />}>
            <Route path="/tickets" element={<Tickets />} />
          </Route>
        </Route>



      </Routes>
    </BrowserRouter>
  );
}