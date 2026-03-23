import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../store/authStore";
import {
  Typography, Card, CardContent, Avatar, Stack, Box, Chip,
  TextField, Button, MenuItem, Alert, Divider, Grid, alpha,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CloseIcon from "@mui/icons-material/Close";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import StarIcon from "@mui/icons-material/Star";
import apiClient from "../../api/client";

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 1.5 }}>
      <Box sx={{ color: "text.secondary", display: "flex" }}>{icon}</Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11.5, textTransform: "uppercase", letterSpacing: 0.5 }}>
          {label}
        </Typography>
        <Typography variant="body2" fontWeight={500}>{value}</Typography>
      </Box>
    </Stack>
  );
}

export default function Profile() {
  const { t } = useTranslation("common");
  const { user, setUser, logout } = useAuthStore();

  // Edit profile dialog
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Change password dialog
  const [pwOpen, setPwOpen] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwError, setPwError] = useState("");

  // Delete account dialog
  const [deleteOpen, setDeleteOpen] = useState(false);

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setSuccess("");
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await apiClient.put("/user", {
        name: fd.get("name"),
        profile_type: fd.get("profile_type"),
        default_currency: fd.get("default_currency"),
      });
      setUser(res.data.data);
      setSuccess(t("messages.success"));
      setTimeout(() => { setEditOpen(false); setSuccess(""); }, 1200);
    } catch {
      setError(t("messages.error"));
    } finally {
      setSaving(false);
    }
  }

  async function handlePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPwSaving(true);
    setPwSuccess("");
    setPwError("");
    const fd = new FormData(e.currentTarget);
    try {
      await apiClient.put("/user/password", {
        current_password: fd.get("current_password"),
        password: fd.get("password"),
        password_confirmation: fd.get("password_confirmation"),
      });
      setPwSuccess(t("messages.success"));
      setTimeout(() => { setPwOpen(false); setPwSuccess(""); }, 1200);
    } catch {
      setPwError(t("messages.error"));
    } finally {
      setPwSaving(false);
    }
  }

  async function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0]) return;
    const fd = new FormData();
    fd.append("avatar", e.target.files[0]);
    try {
      const res = await apiClient.post("/user/avatar", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser({ ...user!, avatar: res.data.data.avatar });
    } catch { /* silently fail */ }
  }

  async function handleDeleteAvatar() {
    try {
      await apiClient.put("/user", { avatar: null });
      setUser({ ...user!, avatar: null });
    } catch { /* silently fail */ }
  }

  if (!user) return null;

  const profileTypeLabel: Record<string, string> = {
    employee: "Employee",
    freelancer: "Freelancer",
    business_owner: "Business Owner",
    student: "Student",
  };

  return (
    <>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>{t("nav.profile")}</Typography>

      {/* ── User Card ── */}
      <Card sx={{ border: 1, borderColor: "divider", mb: 2.5 }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems={{ sm: "center" }} justifyContent="space-between">
            <Stack direction="row" spacing={3} alignItems="center">
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={user.avatar ? `${import.meta.env.VITE_API_URL?.replace("/api/v1", "")}/storage/${user.avatar}` : undefined}
                  sx={{ width: 88, height: 88, fontSize: 36, fontWeight: 700, bgcolor: "primary.main", border: "4px solid", borderColor: alpha("#0072E5", 0.15) }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                <Stack
                  direction="row"
                  spacing={0.5}
                  sx={{ position: "absolute", bottom: -6, left: "50%", transform: "translateX(-50%)" }}
                >
                  <Button
                    component="label"
                    size="small"
                    sx={{
                      minWidth: 30, width: 30, height: 30, borderRadius: "50%",
                      bgcolor: "background.paper", border: 1, borderColor: "divider",
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <CameraAltIcon sx={{ fontSize: 14 }} />
                    <input type="file" accept="image/*" hidden onChange={handleAvatar} />
                  </Button>
                  {user.avatar && (
                    <Button
                      size="small"
                      onClick={handleDeleteAvatar}
                      sx={{
                        minWidth: 30, width: 30, height: 30, borderRadius: "50%",
                        bgcolor: "background.paper", border: 1, borderColor: "divider",
                        color: "error.main",
                        "&:hover": { bgcolor: alpha("#EB0014", 0.05) },
                      }}
                    >
                      <DeleteOutlineIcon sx={{ fontSize: 14 }} />
                    </Button>
                  )}
                </Stack>
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700}>{user.name}</Typography>
                <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Chip
                    label={profileTypeLabel[user.profile_type] ?? user.profile_type}
                    size="small"
                    sx={{ bgcolor: alpha("#0072E5", 0.08), color: "#0072E5", fontWeight: 600 }}
                  />
                  <Chip label={user.default_currency} size="small" variant="outlined" />
                  {user.is_premium && (
                    <Chip icon={<StarIcon sx={{ fontSize: 14 }} />} label="Premium" size="small" sx={{ bgcolor: alpha("#DEA500", 0.1), color: "#DEA500", fontWeight: 600 }} />
                  )}
                </Stack>
              </Box>
            </Stack>

            <Button
              variant="outlined"
              startIcon={<EditOutlinedIcon />}
              onClick={() => setEditOpen(true)}
              sx={{ alignSelf: { xs: "flex-start", sm: "center" }, borderColor: "divider", color: "text.primary", "&:hover": { borderColor: "text.disabled", bgcolor: "action.hover" } }}
            >
              {t("actions.edit")}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* ── User Details ── */}
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ border: 1, borderColor: "divider", height: "100%" }}>
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Personal Information</Typography>
              <Divider sx={{ mb: 1 }} />
              <InfoRow icon={<PersonOutlinedIcon sx={{ fontSize: 20 }} />} label="Full Name" value={user.name} />
              <InfoRow icon={<EmailOutlinedIcon sx={{ fontSize: 20 }} />} label="Email" value={user.email} />
              <InfoRow icon={<BadgeOutlinedIcon sx={{ fontSize: 20 }} />} label="Profile Type" value={profileTypeLabel[user.profile_type] ?? user.profile_type} />
              <InfoRow icon={<CurrencyExchangeIcon sx={{ fontSize: 20 }} />} label="Default Currency" value={user.default_currency} />
              <InfoRow icon={<CalendarTodayIcon sx={{ fontSize: 20 }} />} label="Member Since" value={new Date(user.created_at).toLocaleDateString("fr-MA", { year: "numeric", month: "long", day: "numeric" })} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={2.5}>
            {/* Security */}
            <Card sx={{ border: 1, borderColor: "divider" }}>
              <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Security</Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={2} alignItems="center">
                    <LockOutlinedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                    <Box>
                      <Typography variant="body2" fontWeight={500}>Password</Typography>
                      <Typography variant="caption" color="text.secondary">Last changed: unknown</Typography>
                    </Box>
                  </Stack>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setPwOpen(true)}
                    sx={{ borderColor: "divider", color: "text.primary", "&:hover": { borderColor: "text.disabled" } }}
                  >
                    Change
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card sx={{ border: "1px solid", borderColor: alpha("#EB0014", 0.2) }}>
              <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                <Typography variant="subtitle1" fontWeight={700} color="error.main" sx={{ mb: 2 }}>Danger Zone</Typography>
                <Stack spacing={1.5}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="body2" fontWeight={500}>Log out</Typography>
                      <Typography variant="caption" color="text.secondary">Sign out of your account</Typography>
                    </Box>
                    <Button variant="outlined" color="error" size="small" onClick={() => logout()}>
                      Logout
                    </Button>
                  </Stack>
                  <Divider />
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="body2" fontWeight={500}>Delete account</Typography>
                      <Typography variant="caption" color="text.secondary">Permanently delete your account and all data</Typography>
                    </Box>
                    <Button variant="outlined" color="error" size="small" onClick={() => setDeleteOpen(true)}>
                      Delete
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {/* ── Edit Profile Dialog ── */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <form onSubmit={handleUpdate}>
          <DialogTitle sx={{ pb: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight={700}>{t("actions.edit")} {t("nav.profile")}</Typography>
              <IconButton onClick={() => setEditOpen(false)} size="small"><CloseIcon /></IconButton>
            </Stack>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              {success && <Alert severity="success">{success}</Alert>}
              {error && <Alert severity="error">{error}</Alert>}
              <TextField name="name" label="Full Name" fullWidth defaultValue={user.name} required />
              <TextField name="profile_type" select label="Profile Type" fullWidth defaultValue={user.profile_type}>
                <MenuItem value="employee">Employee</MenuItem>
                <MenuItem value="freelancer">Freelancer</MenuItem>
                <MenuItem value="business_owner">Business Owner</MenuItem>
                <MenuItem value="student">Student</MenuItem>
              </TextField>
              <TextField name="default_currency" select label="Default Currency" fullWidth defaultValue={user.default_currency}>
                <MenuItem value="MAD">MAD — Moroccan Dirham</MenuItem>
                <MenuItem value="EUR">EUR — Euro</MenuItem>
                <MenuItem value="USD">USD — US Dollar</MenuItem>
                <MenuItem value="GBP">GBP — British Pound</MenuItem>
                <MenuItem value="CAD">CAD — Canadian Dollar</MenuItem>
                <MenuItem value="TRY">TRY — Turkish Lira</MenuItem>
              </TextField>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setEditOpen(false)} color="inherit">{t("actions.cancel")}</Button>
            <Button type="submit" variant="contained" disabled={saving} sx={{ bgcolor: "text.primary", "&:hover": { bgcolor: "text.secondary" }, px: 4 }}>
              {saving ? t("actions.loading") : t("actions.save")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ── Change Password Dialog ── */}
      <Dialog open={pwOpen} onClose={() => setPwOpen(false)} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <form onSubmit={handlePassword}>
          <DialogTitle sx={{ pb: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight={700}>Change Password</Typography>
              <IconButton onClick={() => setPwOpen(false)} size="small"><CloseIcon /></IconButton>
            </Stack>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              {pwSuccess && <Alert severity="success">{pwSuccess}</Alert>}
              {pwError && <Alert severity="error">{pwError}</Alert>}
              <TextField name="current_password" label="Current Password" type="password" required fullWidth autoComplete="current-password" />
              <TextField name="password" label="New Password" type="password" required fullWidth autoComplete="new-password" />
              <TextField name="password_confirmation" label="Confirm New Password" type="password" required fullWidth autoComplete="new-password" />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setPwOpen(false)} color="inherit">{t("actions.cancel")}</Button>
            <Button type="submit" variant="contained" disabled={pwSaving} sx={{ bgcolor: "text.primary", "&:hover": { bgcolor: "text.secondary" }, px: 4 }}>
              {pwSaving ? t("actions.loading") : t("actions.save")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ── Delete Account Confirmation ── */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <DialogTitle>
          <Typography variant="h6" fontWeight={700} color="error.main">Delete Account</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete your account? This action is permanent and cannot be undone. All your data (transactions, goals, budgets) will be lost.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDeleteOpen(false)} color="inherit">{t("actions.cancel")}</Button>
          <Button variant="contained" color="error" onClick={() => logout()}>
            Delete My Account
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
