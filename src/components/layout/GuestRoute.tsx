import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../../store/authStore";

export default function GuestRoute() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return <Outlet />;
}
