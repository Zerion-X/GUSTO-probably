import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser } from "../utils/userStorage";

export default function ProtectedRoute() {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
