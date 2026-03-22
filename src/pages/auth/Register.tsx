import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../store/authStore";
import type { ProfileType } from "../../types/auth";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  Link,
  MenuItem,
  Box,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

export default function Register() {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    profile_type: "employee" as ProfileType,
    default_currency: "MAD",
  });
  const [error, setError] = useState("");

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await register(form);
      navigate("/app/dashboard");
    } catch {
      setError(t("register.error", { defaultValue: "Registration failed" }));
    }
  }

  return (
    <Card>
      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: "primary.main",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2,
            }}
          >
            <PersonAddIcon />
          </Box>
          <Typography variant="h4">{t("register.title")}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {t("register.subtitle")}
          </Typography>
        </Box>

        <Stack component="form" onSubmit={handleSubmit} spacing={2.5}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label={t("register.name")}
            required
            fullWidth
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            autoComplete="name"
          />

          <TextField
            label={t("register.email")}
            type="email"
            required
            fullWidth
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            autoComplete="email"
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label={t("register.profileType")}
              select
              fullWidth
              value={form.profile_type}
              onChange={(e) => update("profile_type", e.target.value)}
            >
              <MenuItem value="employee">{t("profileTypes.employee")}</MenuItem>
              <MenuItem value="freelancer">{t("profileTypes.freelancer")}</MenuItem>
              <MenuItem value="business_owner">{t("profileTypes.business_owner")}</MenuItem>
            </TextField>

            <TextField
              label={t("register.currency")}
              select
              fullWidth
              value={form.default_currency}
              onChange={(e) => update("default_currency", e.target.value)}
            >
              <MenuItem value="MAD">{t("common:currency.MAD")} (MAD)</MenuItem>
              <MenuItem value="EUR">{t("common:currency.EUR")} (EUR)</MenuItem>
              <MenuItem value="USD">{t("common:currency.USD")} (USD)</MenuItem>
              <MenuItem value="GBP">{t("common:currency.GBP")} (GBP)</MenuItem>
            </TextField>
          </Stack>

          <TextField
            label={t("register.password")}
            type="password"
            required
            fullWidth
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            autoComplete="new-password"
          />

          <TextField
            label={t("register.confirmPassword")}
            type="password"
            required
            fullWidth
            value={form.password_confirmation}
            onChange={(e) => update("password_confirmation", e.target.value)}
            autoComplete="new-password"
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? t("common:actions.loading") : t("register.submit")}
          </Button>
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mt: 3 }}>
          {t("register.hasAccount")}{" "}
          <Link component={RouterLink} to="/login" underline="hover" fontWeight={600}>
            {t("register.signIn")}
          </Link>
        </Typography>
      </CardContent>
    </Card>
  );
}
