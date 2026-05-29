import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePage";
import MenuPage from "../pages/MenuPage";
import AboutUsPage from "../pages/AboutUsPage";
import ReservationPage from "../pages/ReservationPage";
import Login from "../pages/Login";
import ReservationList from "../pages/admin/reservations/ReservationsList";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicLayout from "../components/layout/PublicLayout";
import AdminLayout from "../components/layout/AdminLayout";
import CategoriesIndex from "../pages/admin/categories/CategoriesIndex";
import CategoryAdd from "../pages/admin/categories/CategoryAdd";
import CategoryDetail from "../pages/admin/categories/CategoryDetail";
import CategoryEdit from "../pages/admin/categories/CategoryEdit";
import MenuIndex from "../pages/admin/menu/MenuIndex";
import MenuAdd from "../pages/admin/menu/MenuAdd";
import MenuDetail from "../pages/admin/menu/MenuDetail";
import MenuEdit from "../pages/admin/menu/MenuEdit";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/menu" replace />} />
          <Route path="menu" element={<MenuIndex />} />
          <Route path="menu/add" element={<MenuAdd />} />
          <Route path="menu/:id" element={<MenuDetail />} />
          <Route path="menu/:id/edit" element={<MenuEdit />} />
          <Route path="categories" element={<CategoriesIndex />} />
          <Route path="categories/add" element={<CategoryAdd />} />
          <Route path="categories/:id" element={<CategoryDetail />} />
          <Route path="categories/:id/edit" element={<CategoryEdit />} />
          <Route path="reservations" element={<ReservationList />} />
        </Route>

        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/reservation" element={<ReservationPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
