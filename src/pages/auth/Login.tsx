import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../store/authStore";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  Link,
  FormControlLabel,
  Checkbox,
  Box,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";

export default function Login() {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await login({ email, password });
      navigate("/app/dashboard");
    } catch {
      setError(t("login.error", { defaultValue: "Invalid credentials" }));
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
            <LoginIcon />
          </Box>
          <Typography variant="h4">{t("login.title")}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {t("login.subtitle")}
          </Typography>
        </Box>

        <Stack component="form" onSubmit={handleSubmit} spacing={2.5}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label={t("login.email")}
            type="email"
            required
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <TextField
            label={t("login.password")}
            type="password"
            required
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <FormControlLabel
              control={<Checkbox size="small" />}
              label={<Typography variant="body2">{t("login.rememberMe")}</Typography>}
            />
            <Link component={RouterLink} to="/forgot-password" variant="body2" underline="hover">
              {t("login.forgotPassword")}
            </Link>
          </Stack>

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? t("common:actions.loading") : t("login.submit")}
          </Button>
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mt: 3 }}>
          {t("login.noAccount")}{" "}
          <Link component={RouterLink} to="/register" underline="hover" fontWeight={600}>
            {t("login.signUp")}
          </Link>
        </Typography>
      </CardContent>
    </Card>
  );
}
