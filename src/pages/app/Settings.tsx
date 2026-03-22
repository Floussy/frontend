import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../store/authStore";
import {
  Typography, Card, CardContent, Stack, TextField, Button, Alert, Divider,
} from "@mui/material";
import apiClient from "../../api/client";

export default function Settings() {
  const { t } = useTranslation("common");
  const { logout } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handlePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setSuccess("");
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      await apiClient.put("/user/password", {
        current_password: fd.get("current_password"),
        password: fd.get("password"),
        password_confirmation: fd.get("password_confirmation"),
      });
      setSuccess(t("messages.success"));
      e.currentTarget.reset();
    } catch {
      setError(t("messages.error"));
    } finally { setSaving(false); }
  }

  return (
    <>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>{t("nav.settings")}</Typography>

      <Card sx={{ border: "1px solid #EDEDED", mb: 3 }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Change Password</Typography>
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Stack component="form" onSubmit={handlePassword} spacing={2.5}>
            <TextField name="current_password" label="Current Password" type="password" required fullWidth />
            <TextField name="password" label="New Password" type="password" required fullWidth />
            <TextField name="password_confirmation" label="Confirm New Password" type="password" required fullWidth />
            <Button type="submit" variant="contained" disabled={saving} sx={{ bgcolor: "#171717", "&:hover": { bgcolor: "#333" }, alignSelf: "flex-start", px: 4 }}>
              {saving ? t("actions.loading") : t("actions.save")}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ border: "1px solid #EDEDED" }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Typography variant="h6" fontWeight={700} color="error.main" sx={{ mb: 2 }}>Danger Zone</Typography>
          <Divider sx={{ mb: 2 }} />
          <Button variant="outlined" color="error" onClick={() => logout()}>
            {t("nav.logout")}
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
