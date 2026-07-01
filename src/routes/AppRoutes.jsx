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
import Carrinho from "../pages/Carrinho";
import Checkout from "../pages/Checkout/Checkout";
import CheckoutSuccess from "../pages/Checkout/CheckoutSuccess";
import CheckoutFailure from "../pages/Checkout/CheckoutFailure";
import CheckoutPending from "../pages/Checkout/CheckoutPending";
import ProductDetail from "../pages/ProductDetail";
import MyOrders from "../pages/MyOrders";
import Order from "../pages/Order";


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
          <Route path="/carrinho" element={<Carrinho />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/checkout/failure" element={<CheckoutFailure />} />
          <Route path="/checkout/pending" element={<CheckoutPending />} />
        </Route>


        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/profile" element={<Perfil />} />
            <Route path="/my-tickets" element={<MyTickets />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/my-orders/:id" element={<Order />} />
            <Route path="/tickets/:id" element={<Ticket />} />
            <Route path="/checkout" element={<Checkout />} />
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