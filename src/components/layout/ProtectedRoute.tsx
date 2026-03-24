import { useEffect } from "react";
import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../../store/authStore";
import { Box, CircularProgress } from "@mui/material";

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading, user, hydrate } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && !user) {
      hydrate();
    }
  }, [isAuthenticated, user, hydrate]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading || !user) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return <Outlet />;
}
