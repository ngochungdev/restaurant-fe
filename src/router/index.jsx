import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import HomePage from "../pages/HomePage";
import MenuPage from "../pages/MenuPage";
import AboutUsPage from "../pages/AboutUsPage";
import ReservationPage from "../pages/ReservationPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminMenu from "../pages/AdminMenu";
import ReservationList from "../components/reservation/ReservationsList";
import ProtectedRoute from "../components/ProtectedRoute";

export default function Router() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin/menu"
          element={
            <ProtectedRoute>
              <AdminMenu />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/reservations"
          element={
            <ProtectedRoute>
              <ReservationList />
            </ProtectedRoute>
          }
        />

        <Route path="/menu" element={<MenuPage />} />

        <Route path="/about-us" element={<AboutUsPage />} />

        <Route path="/reservation" element={<ReservationPage />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}
