import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { authApi } from "../../api/auth";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Box,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

export default function ResetPassword() {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authApi.resetPassword({
        email: searchParams.get("email") ?? "",
        token: searchParams.get("token") ?? "",
        password,
        password_confirmation: passwordConfirmation,
      });
      navigate("/login");
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
            <LockIcon />
          </Box>
          <Typography variant="h4">{t("resetPassword.title")}</Typography>
        </Box>

        <Stack component="form" onSubmit={handleSubmit} spacing={2.5}>
          <TextField
            label={t("resetPassword.password")}
            type="password"
            required
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />

          <TextField
            label={t("resetPassword.confirmPassword")}
            type="password"
            required
            fullWidth
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            autoComplete="new-password"
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? t("common:actions.loading") : t("resetPassword.submit")}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
