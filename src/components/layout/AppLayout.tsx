import { Outlet } from "react-router";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import AppHeader from "./AppHeader";

export default function AppLayout() {
  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden", bgcolor: "action.hover" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <AppHeader />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflow: "auto",
            p: { xs: 2, sm: 2.5, md: 3 },
          }}
        >
          <Box sx={{ maxWidth: 1200, width: "100%", mx: "auto" }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
