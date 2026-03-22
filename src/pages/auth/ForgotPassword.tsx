import { useState } from "react";
import { Link as RouterLink } from "react-router";
import { useTranslation } from "react-i18next";
import { authApi } from "../../api/auth";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  Link,
  Box,
} from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";

export default function ForgotPassword() {
  const { t } = useTranslation("auth");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authApi.forgotPassword({ email });
      setSent(true);
    } finally {
      setIsLoading(false);
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
            <LockResetIcon />
          </Box>
          <Typography variant="h4">{t("forgotPassword.title")}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {t("forgotPassword.subtitle")}
          </Typography>
        </Box>

        {sent ? (
          <Stack spacing={2} alignItems="center">
            <Alert severity="success" sx={{ width: "100%" }}>
              {t("forgotPassword.sent")}
            </Alert>
            <Link component={RouterLink} to="/login" underline="hover" fontWeight={600}>
              {t("forgotPassword.backToLogin")}
            </Link>
          </Stack>
        ) : (
          <Stack component="form" onSubmit={handleSubmit} spacing={2.5}>
            <TextField
              label={t("forgotPassword.email")}
              type="email"
              required
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? t("common:actions.loading") : t("forgotPassword.submit")}
            </Button>

            <Typography variant="body2" sx={{ textAlign: "center" }}>
              <Link component={RouterLink} to="/login" underline="hover">
                {t("forgotPassword.backToLogin")}
              </Link>
            </Typography>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
