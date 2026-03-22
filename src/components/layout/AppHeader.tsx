import { useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../../store/appStore";
import { useAuthStore } from "../../store/authStore";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Stack,
  Button,
  Breadcrumbs,
  Link,
  alpha,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/LogoutOutlined";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import LanguageSwitcher from "../ui/LanguageSwitcher";

export default function AppHeader() {
  const { t } = useTranslation("common");
  const { toggleSidebar } = useAppStore();
  const { logout } = useAuthStore();
  const location = useLocation();

  // Build breadcrumbs from path
  const pathParts = location.pathname.split("/").filter(Boolean);
  const pageKey = pathParts[pathParts.length - 1] ?? "dashboard";

  return (
    <AppBar
      position="sticky"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer - 1,
        bgcolor: "white",
        color: "text.primary",
        borderBottom: "1px solid #EDEDED",
        backdropFilter: "none",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 52, sm: 56 }, px: { xs: 2, sm: 3 } }}>
        {/* Mobile menu */}
        <IconButton
          onClick={toggleSidebar}
          edge="start"
          sx={{ display: { lg: "none" }, mr: 1.5 }}
          aria-label="Open sidebar"
        >
          <MenuIcon />
        </IconButton>

        {/* Breadcrumbs */}
        <Breadcrumbs
          separator={<NavigateNextIcon sx={{ fontSize: 16 }} />}
          sx={{ flexGrow: 1 }}
        >
          <Link
            underline="hover"
            color="text.secondary"
            href="/app/dashboard"
            sx={{ fontSize: 13.5, fontWeight: 500 }}
          >
            {t("appName")}
          </Link>
          <Typography
            sx={{ fontSize: 13.5, fontWeight: 600, color: "text.primary" }}
          >
            {t(`nav.${pageKey}`, pageKey.charAt(0).toUpperCase() + pageKey.slice(1))}
          </Typography>
        </Breadcrumbs>

        {/* Right actions */}
        <Stack direction="row" spacing={0.5} alignItems="center">
          <LanguageSwitcher />

          <IconButton size="small" sx={{ color: "text.secondary" }}>
            <NotificationsNoneIcon sx={{ fontSize: 20 }} />
          </IconButton>

          <Button
            onClick={() => logout()}
            size="small"
            startIcon={<LogoutIcon sx={{ fontSize: 18 }} />}
            sx={{
              display: { xs: "none", sm: "flex" },
              color: "text.secondary",
              fontSize: 13,
              fontWeight: 500,
              "&:hover": {
                color: "error.main",
                bgcolor: alpha("#EB0014", 0.06),
              },
            }}
          >
            {t("nav.logout")}
          </Button>
          <IconButton
            onClick={() => logout()}
            sx={{
              display: { sm: "none" },
              color: "text.secondary",
              "&:hover": { color: "error.main" },
            }}
            aria-label={t("nav.logout")}
          >
            <LogoutIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
