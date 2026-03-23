import { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Box,
  Container,
  Divider,
  Stack,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LanguageSwitcher from "../ui/LanguageSwitcher";
import ThemeToggle from "../ui/ThemeToggle";
import logoSvg from "../../assets/logo.svg";
import logoIconSvg from "../../assets/logo-icon.svg";

const navLinks = [
  { to: "/", labelKey: "nav.home" },
  { to: "/about", labelKey: "nav.about" },
  { to: "/contact", labelKey: "nav.contact" },
] as const;

export default function PublicNavbar() {
  const { t } = useTranslation("common");
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <AppBar position="sticky">
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ gap: 1, minHeight: { xs: 56, sm: 64 } }}>
            {/* Logo */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              component={RouterLink}
              to="/"
              sx={{
                textDecoration: "none",
                color: "inherit",
                flexGrow: { xs: 1, md: 0 },
                mr: { md: 1 },
              }}
            >
              <Box
                component="img"
                src={logoSvg}
                alt={t("appName")}
                sx={{ height: 48, display: { xs: "none", sm: "block" } }}
              />
              <Box
                component="img"
                src={logoIconSvg}
                alt={t("appName")}
                sx={{ height: 40, display: { xs: "block", sm: "none" } }}
              />
            </Stack>

            {/* Desktop nav links */}
            <Stack
              direction="row"
              spacing={0.5}
              sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, ml: 2 }}
            >
              {navLinks.map((link) => (
                <Button
                  key={link.to}
                  component={RouterLink}
                  to={link.to}
                  sx={{
                    color: location.pathname === link.to ? "primary.main" : "text.secondary",
                    fontWeight: location.pathname === link.to ? 600 : 500,
                    fontSize: "0.9rem",
                    px: 2,
                    borderRadius: 2,
                    "&:hover": {
                      color: "primary.main",
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  {t(link.labelKey)}
                </Button>
              ))}
            </Stack>

            {/* Desktop actions */}
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              <ThemeToggle />
              <LanguageSwitcher />
              <Button
                component={RouterLink}
                to="/login"
                variant="text"
                sx={{
                  color: "text.primary",
                  fontWeight: 600,
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                {t("nav.login")}
              </Button>
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                size="medium"
                sx={{
                  background: (theme) => theme.palette.gradients.primaryButton,
                  "&:hover": {
                    background: (theme) => theme.palette.gradients.primaryButton,
                    opacity: 0.9,
                  },
                }}
              >
                {t("nav.register")}
              </Button>
            </Stack>

            {/* Mobile actions */}
            <Box sx={{ display: { md: "none" } }}>
              <ThemeToggle />
              <LanguageSwitcher />
            </Box>
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{ display: { md: "none" } }}
              aria-label="Open menu"
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{ display: { md: "none" } }}
        slotProps={{ paper: { sx: { width: 300 } } }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              component="img"
              src={logoSvg}
              alt={t("appName")}
              sx={{ height: 40 }}
            />
          </Stack>
          <IconButton onClick={() => setMobileOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List sx={{ px: 1, py: 2 }}>
          {navLinks.map((link) => (
            <ListItemButton
              key={link.to}
              component={RouterLink}
              to={link.to}
              selected={location.pathname === link.to}
              onClick={() => setMobileOpen(false)}
            >
              <ListItemText primary={t(link.labelKey)} />
            </ListItemButton>
          ))}
        </List>
        <Divider />
        <Stack spacing={1.5} sx={{ p: 2.5 }}>
          <Button
            component={RouterLink}
            to="/login"
            variant="outlined"
            fullWidth
            size="large"
            onClick={() => setMobileOpen(false)}
          >
            {t("nav.login")}
          </Button>
          <Button
            component={RouterLink}
            to="/register"
            variant="contained"
            fullWidth
            size="large"
            onClick={() => setMobileOpen(false)}
            sx={{
              background: (theme) => theme.palette.gradients.primaryButton,
            }}
          >
            {t("nav.register")}
          </Button>
        </Stack>
      </Drawer>
    </>
  );
}
