import { Outlet } from "react-router";
import { useTranslation } from "react-i18next";
import { Box, Container, Typography, Stack } from "@mui/material";
import LanguageSwitcher from "../ui/LanguageSwitcher";

export default function AuthLayout() {
  const { t } = useTranslation("common");

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", display: "flex", flexDirection: "column" }}>
      {/* Minimal header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 3, py: 2 }}>
        <Typography
          variant="h6"
          component="a"
          href="/"
          sx={{ fontWeight: 700, color: "primary.main", textDecoration: "none" }}
        >
          {t("appName")}
        </Typography>
        <LanguageSwitcher />
      </Stack>

      {/* Centered form */}
      <Container maxWidth="sm" sx={{ flexGrow: 1, display: "flex", alignItems: "center", py: 4 }}>
        <Box sx={{ width: "100%" }}>
          <Outlet />
        </Box>
      </Container>
    </Box>
  );
}
