import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
}) {
  const storedUser =
    localStorage.getItem("user");

  const user =
    storedUser &&
    storedUser !== "undefined"
      ? JSON.parse(storedUser)
      : null;

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}