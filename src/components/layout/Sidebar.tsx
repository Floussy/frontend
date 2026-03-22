import { NavLink, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../../store/appStore";
import { useAuthStore } from "../../store/authStore";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
  Avatar,
  Stack,
  alpha,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/DashboardOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUpOutlined";
import TrendingDownIcon from "@mui/icons-material/TrendingDownOutlined";
import FlagIcon from "@mui/icons-material/FlagOutlined";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import BarChartIcon from "@mui/icons-material/BarChartOutlined";
import RepeatIcon from "@mui/icons-material/RepeatOutlined";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import PersonIcon from "@mui/icons-material/PersonOutlined";
import CloseIcon from "@mui/icons-material/Close";
import logoSvg from "../../assets/logo.svg";

const DRAWER_WIDTH = 250;

const mainNav = [
  { to: "/app/dashboard", icon: <DashboardIcon />, labelKey: "nav.dashboard" },
  { to: "/app/incomes", icon: <TrendingUpIcon />, labelKey: "nav.incomes" },
  { to: "/app/expenses", icon: <TrendingDownIcon />, labelKey: "nav.expenses" },
  { to: "/app/recurring", icon: <RepeatIcon />, labelKey: "nav.recurring" },
  { to: "/app/goals", icon: <FlagIcon />, labelKey: "nav.goals" },
  { to: "/app/budgets", icon: <AccountBalanceWalletIcon />, labelKey: "nav.budgets" },
  { to: "/app/reports", icon: <BarChartIcon />, labelKey: "nav.reports" },
] as const;

const bottomNav = [
  { to: "/app/settings", icon: <SettingsIcon />, labelKey: "nav.settings" },
  { to: "/app/profile", icon: <PersonIcon />, labelKey: "nav.profile" },
] as const;

export default function Sidebar() {
  const { t } = useTranslation("common");
  const { user } = useAuthStore();
  const { sidebarOpen, setSidebarOpen } = useAppStore();
  const location = useLocation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: "#F8F8F8",
      }}
    >
      {/* Logo */}
      <Box sx={{ px: 2.5, py: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box
          component="img"
          src={logoSvg}
          alt={t("appName")}
          sx={{ height: 28 }}
        />
        {!isDesktop && (
          <IconButton onClick={() => setSidebarOpen(false)} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ borderColor: "#EDEDED" }} />

      {/* Main navigation */}
      <List sx={{ flexGrow: 1, px: 1.5, pt: 1.5 }}>
        {mainNav.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <ListItemButton
              key={item.to}
              component={NavLink}
              to={item.to}
              onClick={() => !isDesktop && setSidebarOpen(false)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                mx: 0,
                px: 2,
                py: 0.9,
                bgcolor: isActive ? "white" : "transparent",
                boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                border: isActive ? "1px solid #EDEDED" : "1px solid transparent",
                color: isActive ? "text.primary" : "text.secondary",
                "&:hover": {
                  bgcolor: isActive ? "white" : alpha("#000", 0.03),
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 34,
                  color: isActive ? "primary.main" : "text.secondary",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={t(item.labelKey)}
                primaryTypographyProps={{
                  fontSize: 13.5,
                  fontWeight: isActive ? 600 : 500,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ borderColor: "#EDEDED" }} />

      {/* Bottom navigation */}
      <List sx={{ px: 1.5, py: 1 }}>
        {bottomNav.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <ListItemButton
              key={item.to}
              component={NavLink}
              to={item.to}
              onClick={() => !isDesktop && setSidebarOpen(false)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                mx: 0,
                px: 2,
                py: 0.9,
                bgcolor: isActive ? "white" : "transparent",
                boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                border: isActive ? "1px solid #EDEDED" : "1px solid transparent",
                color: isActive ? "text.primary" : "text.secondary",
                "&:hover": {
                  bgcolor: isActive ? "white" : alpha("#000", 0.03),
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 34,
                  color: isActive ? "primary.main" : "text.secondary",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={t(item.labelKey)}
                primaryTypographyProps={{
                  fontSize: 13.5,
                  fontWeight: isActive ? 600 : 500,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      {/* User card */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2.5,
            bgcolor: "white",
            border: "1px solid #EDEDED",
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              src={user?.avatar ? `${import.meta.env.VITE_API_URL?.replace("/api/v1", "")}/storage/${user.avatar}` : undefined}
              sx={{
                width: 34,
                height: 34,
                fontSize: 14,
                fontWeight: 600,
                bgcolor: "primary.main",
              }}
            >
              {user?.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" fontWeight={600} noWrap sx={{ fontSize: 13 }}>
                {user?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: 11.5 }}>
                {user?.email}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { lg: DRAWER_WIDTH }, flexShrink: { lg: 0 } }}>
      <Drawer
        variant="temporary"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": { width: DRAWER_WIDTH, border: "none" },
        }}
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", lg: "block" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            position: "relative",
            height: "100vh",
            border: "none",
            borderRight: "1px solid #EDEDED",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}

export { DRAWER_WIDTH };
