import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollManager from "./ScrollManager";

export default function PublicLayout() {
  return (
    <>
      <ScrollManager />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}
