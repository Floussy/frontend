import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Typography, Card, CardContent, Stack, Box, Button, Chip, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  IconButton, alpha, CircularProgress, Alert, Tabs, Tab,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { subscriptionsApi } from "../../api/subscriptions";
import type { Subscription, SubscriptionStatus } from "../../types/subscription";

function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat("fr-MA", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount) + " " + currency;
}

const statusColors: Record<SubscriptionStatus, string> = {
  active: "#1AA251",
  paused: "#F59E0B",
  cancelled: "#EF4444",
};

export default function Subscriptions() {
  const { t } = useTranslation("common");
  const qc = useQueryClient();
  const [tab, setTab] = useState<SubscriptionStatus | "all">("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: async () => {
      const res = await subscriptionsApi.list();
      return { items: res.data.data as Subscription[], meta: res.data.meta };
    },
  });

  const allSubs = data?.items ?? [];
  const meta = data?.meta ?? { monthly_total: 0, annual_total: 0 };
  const filtered = tab === "all" ? allSubs : allSubs.filter((s) => s.status === tab);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get("name"),
      amount: Number(fd.get("amount")),
      currency: fd.get("currency"),
      frequency: fd.get("frequency"),
      provider: fd.get("provider") || null,
      billing_day: fd.get("billing_day") ? Number(fd.get("billing_day")) : null,
      started_at: fd.get("started_at"),
      notes: fd.get("notes") || null,
    };
    try {
      if (editing) {
        await subscriptionsApi.update(editing.id, payload);
      } else {
        await subscriptionsApi.create(payload);
      }
      qc.invalidateQueries({ queryKey: ["subscriptions"] });
      setDialogOpen(false);
      setEditing(null);
    } catch {
      setError(t("messages.error"));
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(id: number, action: "pause" | "resume" | "cancel" | "delete") {
    try {
      if (action === "pause") await subscriptionsApi.pause(id);
      else if (action === "resume") await subscriptionsApi.resume(id);
      else if (action === "cancel") await subscriptionsApi.cancel(id);
      else await subscriptionsApi.delete(id);
      qc.invalidateQueries({ queryKey: ["subscriptions"] });
    } catch { /* silently fail */ }
  }

  if (isLoading) return <Stack alignItems="center" py={6}><CircularProgress /></Stack>;

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Subscriptions</Typography>
          <Typography variant="body2" color="text.secondary">
            {formatMoney(meta.monthly_total, "MAD")}/month &middot; {formatMoney(meta.annual_total, "MAD")}/year
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditing(null); setDialogOpen(true); }}>
          Add Subscription
        </Button>
      </Stack>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}>
        <Tab label={`All (${allSubs.length})`} value="all" />
        <Tab label={`Active (${allSubs.filter((s) => s.status === "active").length})`} value="active" />
        <Tab label={`Paused (${allSubs.filter((s) => s.status === "paused").length})`} value="paused" />
        <Tab label={`Cancelled (${allSubs.filter((s) => s.status === "cancelled").length})`} value="cancelled" />
      </Tabs>

      {filtered.length === 0 ? (
        <Card sx={{ border: 1, borderColor: "divider" }}>
          <CardContent sx={{ py: 6, textAlign: "center" }}>
            <Typography color="text.secondary">No subscriptions yet.</Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {filtered.map((sub) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={sub.id}>
              <Card sx={{ border: 1, borderColor: "divider" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body1" fontWeight={600} noWrap>{sub.name}</Typography>
                      {sub.provider && (
                        <Typography variant="caption" color="text.secondary">{sub.provider}</Typography>
                      )}
                    </Box>
                    <Chip
                      label={sub.status}
                      size="small"
                      sx={{ bgcolor: alpha(statusColors[sub.status], 0.1), color: statusColors[sub.status], fontWeight: 600, fontSize: 11, textTransform: "capitalize" }}
                    />
                  </Stack>

                  <Typography variant="h6" fontWeight={700} sx={{ mt: 2 }}>
                    {formatMoney(sub.amount, sub.currency)}
                    <Typography component="span" variant="caption" color="text.secondary"> /{sub.frequency}</Typography>
                  </Typography>

                  {sub.next_billing_date && (
                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1 }}>
                      <CalendarTodayIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                      <Typography variant="caption" color="text.secondary">
                        Next: {new Date(sub.next_billing_date).toLocaleDateString("fr-MA")}
                      </Typography>
                    </Stack>
                  )}

                  <Stack direction="row" spacing={0.5} sx={{ mt: 2 }}>
                    {sub.status === "active" && (
                      <IconButton size="small" onClick={() => handleAction(sub.id, "pause")} title="Pause">
                        <PauseIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    )}
                    {sub.status === "paused" && (
                      <IconButton size="small" onClick={() => handleAction(sub.id, "resume")} title="Resume">
                        <PlayArrowIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    )}
                    {sub.status !== "cancelled" && (
                      <IconButton size="small" color="warning" onClick={() => handleAction(sub.id, "cancel")} title="Cancel">
                        <CancelIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    )}
                    <IconButton size="small" onClick={() => { setEditing(sub); setDialogOpen(true); }} title="Edit">
                      <EditOutlinedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleAction(sub.id, "delete")} title="Delete">
                      <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* ── Add/Edit Dialog ── */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <form onSubmit={handleSave}>
          <DialogTitle>{editing ? "Edit Subscription" : "Add Subscription"}</DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              {error && <Alert severity="error">{error}</Alert>}
              <TextField name="name" label="Name" required fullWidth defaultValue={editing?.name ?? ""} placeholder="e.g. Netflix, Gym..." />
              <TextField name="amount" label="Amount" type="number" required fullWidth defaultValue={editing?.amount ?? ""} slotProps={{ htmlInput: { step: "0.01", min: "0.01" } }} />
              <TextField name="currency" select label="Currency" fullWidth defaultValue={editing?.currency ?? "MAD"}>
                {["MAD", "EUR", "USD", "GBP"].map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
              <TextField name="frequency" select label="Frequency" fullWidth defaultValue={editing?.frequency ?? "monthly"}>
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </TextField>
              <TextField name="provider" label="Provider (optional)" fullWidth defaultValue={editing?.provider ?? ""} />
              <TextField name="billing_day" label="Billing Day (1-31)" type="number" fullWidth defaultValue={editing?.billing_day ?? ""} slotProps={{ htmlInput: { min: 1, max: 31 } }} />
              <TextField name="started_at" label="Start Date" type="date" required fullWidth defaultValue={editing?.started_at?.split("T")[0] ?? new Date().toISOString().split("T")[0]} slotProps={{ inputLabel: { shrink: true } }} />
              <TextField name="notes" label="Notes (optional)" multiline rows={2} fullWidth defaultValue={editing?.notes ?? ""} />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setDialogOpen(false)} color="inherit">{t("actions.cancel")}</Button>
            <Button type="submit" variant="contained" disabled={loading}>{loading ? t("actions.loading") : t("actions.save")}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
