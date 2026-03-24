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
import SearchIcon from "@mui/icons-material/Search";
import { subscriptionsApi } from "../../api/subscriptions";
import { subscriptionTemplates, templateCategories, getLogoUrl } from "../../data/subscriptionTemplates";
import SubscriptionLogo from "../../components/subscriptions/SubscriptionLogo";
import type { SubscriptionTemplate } from "../../data/subscriptionTemplates";
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
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState("");
  const [pickerCategory, setPickerCategory] = useState("all");
  const [editing, setEditing] = useState<Subscription | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<SubscriptionTemplate | null>(null);
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
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditing(null); setSelectedTemplate(null); setPickerOpen(true); }}>
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
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
                      <SubscriptionLogo name={sub.name} size={36} />
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body1" fontWeight={600} noWrap>{sub.name}</Typography>
                        {sub.provider && (
                          <Typography variant="caption" color="text.secondary">{sub.provider}</Typography>
                        )}
                      </Box>
                    </Stack>
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

      {/* ── Template Picker Dialog ── */}
      <Dialog open={pickerOpen} onClose={() => setPickerOpen(false)} maxWidth="md" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <DialogTitle>
          <Typography variant="h6" fontWeight={700}>Choose a Subscription</Typography>
          <Typography variant="body2" color="text.secondary">Pick from popular services or create a custom one</Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2.5}>
            {/* Search */}
            <TextField
              placeholder="Search subscriptions..."
              value={pickerSearch}
              onChange={(e) => setPickerSearch(e.target.value)}
              fullWidth
              slotProps={{ input: { startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} /> } }}
            />

            {/* Category Tabs */}
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip
                label="All"
                onClick={() => setPickerCategory("all")}
                variant={pickerCategory === "all" ? "filled" : "outlined"}
                sx={{ fontWeight: pickerCategory === "all" ? 600 : 400 }}
              />
              {templateCategories.map((cat) => (
                <Chip
                  key={cat.key}
                  label={`${cat.icon} ${cat.label}`}
                  onClick={() => setPickerCategory(cat.key)}
                  variant={pickerCategory === cat.key ? "filled" : "outlined"}
                  sx={{ fontWeight: pickerCategory === cat.key ? 600 : 400 }}
                />
              ))}
            </Stack>

            {/* Template Grid */}
            <Grid container spacing={1.5}>
              {subscriptionTemplates
                .filter((t) => pickerCategory === "all" || t.category === pickerCategory)
                .filter((t) => !pickerSearch || t.name.toLowerCase().includes(pickerSearch.toLowerCase()) || t.provider.toLowerCase().includes(pickerSearch.toLowerCase()))
                .map((tpl) => (
                  <Grid size={{ xs: 6, sm: 4, md: 3 }} key={tpl.name}>
                    <Card
                      sx={{
                        border: 1, borderColor: "divider", cursor: "pointer",
                        "&:hover": { borderColor: tpl.color, bgcolor: alpha(tpl.color, 0.03) },
                        transition: "all 0.15s",
                      }}
                      onClick={() => { setSelectedTemplate(tpl); setPickerOpen(false); setDialogOpen(true); }}
                    >
                      <CardContent sx={{ p: 2, textAlign: "center" }}>
                        <Box sx={{ display: "flex", justifyContent: "center", mb: 0.5 }}>
                          {tpl.domain ? (
                            <Box
                              component="img"
                              src={getLogoUrl(tpl.domain, 80)!}
                              alt={tpl.name}
                              sx={{ width: 32, height: 32, objectFit: "contain" }}
                              onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.style.display = "none"; if (e.currentTarget.nextElementSibling) { (e.currentTarget.nextElementSibling as HTMLElement).style.display = "flex"; } }}
                            />
                          ) : null}
                          <Box sx={{ fontSize: 28, display: tpl.domain ? "none" : "flex", alignItems: "center", justifyContent: "center" }}>{tpl.icon}</Box>
                        </Box>
                        <Typography variant="body2" fontWeight={600} noWrap>{tpl.name}</Typography>
                        {tpl.defaultAmount && (
                          <Typography variant="caption" color="text.secondary">
                            ~{tpl.defaultAmount} MAD/{tpl.defaultFrequency ?? "month"}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setPickerOpen(false)} color="inherit">{t("actions.cancel")}</Button>
          <Button variant="outlined" onClick={() => { setSelectedTemplate(null); setPickerOpen(false); setDialogOpen(true); }}>
            Custom Subscription
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Add/Edit Dialog ── */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <form onSubmit={handleSave}>
          <DialogTitle>
            <Stack direction="row" spacing={1.5} alignItems="center">
              {selectedTemplate && (
                <SubscriptionLogo name={selectedTemplate.name} size={36} />
              )}
              <span>{editing ? "Edit Subscription" : selectedTemplate ? `Add ${selectedTemplate.name}` : "Add Custom Subscription"}</span>
            </Stack>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              {error && <Alert severity="error">{error}</Alert>}
              <TextField name="name" label="Name" required fullWidth defaultValue={editing?.name ?? selectedTemplate?.name ?? ""} placeholder="e.g. Netflix, Gym..." />
              <TextField name="amount" label="Amount (MAD)" type="number" required fullWidth defaultValue={editing?.amount ?? selectedTemplate?.defaultAmount ?? ""} slotProps={{ htmlInput: { step: "0.01", min: "0.01" } }} />
              <TextField name="currency" select label="Currency" fullWidth defaultValue={editing?.currency ?? "MAD"}>
                {["MAD", "EUR", "USD", "GBP"].map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
              <TextField name="frequency" select label="Frequency" fullWidth defaultValue={editing?.frequency ?? selectedTemplate?.defaultFrequency ?? "monthly"}>
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </TextField>
              <TextField name="provider" label="Provider (optional)" fullWidth defaultValue={editing?.provider ?? selectedTemplate?.provider ?? ""} />
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
