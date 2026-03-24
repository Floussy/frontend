import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Typography, Card, CardContent, Stack, Box, Button, Grid, Avatar, AvatarGroup,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  LinearProgress, Chip, CircularProgress, Alert, alpha,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import GroupIcon from "@mui/icons-material/Group";
import { sharedBudgetsApi } from "../../api/sharedBudgets";
import type { SharedBudget, SharedBudgetInvitation } from "../../types/sharedBudget";

function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat("fr-MA", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount) + " " + currency;
}

export default function SharedBudgets() {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { data: budgets, isLoading } = useQuery({
    queryKey: ["shared-budgets"],
    queryFn: async () => {
      const res = await sharedBudgetsApi.list();
      return res.data.data as SharedBudget[];
    },
  });

  const { data: invitations } = useQuery({
    queryKey: ["shared-budget-invitations"],
    queryFn: async () => {
      const res = await sharedBudgetsApi.myInvitations();
      return res.data.data as SharedBudgetInvitation[];
    },
  });

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      await sharedBudgetsApi.create({
        name: fd.get("name"),
        description: fd.get("description") || null,
        total_amount: Number(fd.get("total_amount")),
        currency: fd.get("currency"),
        period: fd.get("period"),
        start_date: fd.get("start_date"),
      });
      qc.invalidateQueries({ queryKey: ["shared-budgets"] });
      setDialogOpen(false);
    } catch {
      setError(t("messages.error"));
    } finally {
      setLoading(false);
    }
  }

  async function handleInvitation(budgetId: number, action: "accept" | "decline") {
    try {
      if (action === "accept") await sharedBudgetsApi.accept(budgetId);
      else await sharedBudgetsApi.decline(budgetId);
      qc.invalidateQueries({ queryKey: ["shared-budget-invitations"] });
      qc.invalidateQueries({ queryKey: ["shared-budgets"] });
    } catch { /* silently fail */ }
  }

  if (isLoading) return <Stack alignItems="center" py={6}><CircularProgress /></Stack>;

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>Shared Budgets</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
          Create Budget
        </Button>
      </Stack>

      {/* Pending Invitations */}
      {invitations && invitations.length > 0 && (
        <Card sx={{ border: 1, borderColor: alpha("#3B82F6", 0.3), bgcolor: alpha("#3B82F6", 0.03), mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>Pending Invitations</Typography>
            <Stack spacing={1.5}>
              {invitations.map((inv) => (
                <Stack key={inv.id} direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" fontWeight={600}>{inv.shared_budget.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Invited by {inv.inviter.name} &middot; {formatMoney(inv.shared_budget.total_amount, inv.shared_budget.currency)}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Button size="small" variant="contained" onClick={() => handleInvitation(inv.shared_budget.id, "accept")}>Accept</Button>
                    <Button size="small" color="inherit" onClick={() => handleInvitation(inv.shared_budget.id, "decline")}>Decline</Button>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Budget List */}
      {(!budgets || budgets.length === 0) ? (
        <Card sx={{ border: 1, borderColor: "divider" }}>
          <CardContent sx={{ py: 6, textAlign: "center" }}>
            <GroupIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
            <Typography color="text.secondary">No shared budgets yet. Create one to get started!</Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2.5}>
          {budgets.map((budget) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={budget.id}>
              <Card
                sx={{ border: 1, borderColor: "divider", cursor: "pointer", "&:hover": { borderColor: "primary.main" } }}
                onClick={() => navigate(`/app/shared-budgets/${budget.id}`)}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body1" fontWeight={700} noWrap>{budget.name}</Typography>
                      <Chip label={budget.period} size="small" sx={{ fontSize: 11, height: 20, mt: 0.5 }} />
                    </Box>
                    <AvatarGroup max={3} sx={{ "& .MuiAvatar-root": { width: 28, height: 28, fontSize: 12 } }}>
                      <Avatar sx={{ bgcolor: "primary.main" }}>{budget.owner.name.charAt(0)}</Avatar>
                      {budget.accepted_members?.filter((m) => m.user.id !== budget.owner.id).map((m) => (
                        <Avatar key={m.id} sx={{ bgcolor: "secondary.main" }}>{m.user.name.charAt(0)}</Avatar>
                      ))}
                    </AvatarGroup>
                  </Stack>

                  <Box sx={{ mt: 2.5 }}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        {formatMoney(budget.total_spent, budget.currency)} / {formatMoney(budget.total_amount, budget.currency)}
                      </Typography>
                      <Typography variant="caption" fontWeight={600}>{budget.percent_used}%</Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(budget.percent_used, 100)}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: "action.hover",
                        "& .MuiLinearProgress-bar": {
                          bgcolor: budget.percent_used > 90 ? "error.main" : budget.percent_used > 70 ? "warning.main" : "primary.main",
                          borderRadius: 3,
                        },
                      }}
                    />
                  </Box>

                  <Typography variant="body2" fontWeight={600} color={budget.remaining >= 0 ? "success.main" : "error.main"} sx={{ mt: 1.5 }}>
                    {formatMoney(budget.remaining, budget.currency)} remaining
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <form onSubmit={handleCreate}>
          <DialogTitle>Create Shared Budget</DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              {error && <Alert severity="error">{error}</Alert>}
              <TextField name="name" label="Budget Name" required fullWidth placeholder="e.g. Family Groceries, Trip Fund" />
              <TextField name="description" label="Description (optional)" multiline rows={2} fullWidth />
              <TextField name="total_amount" label="Total Budget" type="number" required fullWidth slotProps={{ htmlInput: { step: "0.01", min: "0.01" } }} />
              <TextField name="currency" select label="Currency" fullWidth defaultValue="MAD">
                {["MAD", "EUR", "USD", "GBP"].map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
              <TextField name="period" select label="Period" fullWidth defaultValue="monthly">
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </TextField>
              <TextField name="start_date" label="Start Date" type="date" required fullWidth defaultValue={new Date().toISOString().split("T")[0]} slotProps={{ inputLabel: { shrink: true } }} />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setDialogOpen(false)} color="inherit">{t("actions.cancel")}</Button>
            <Button type="submit" variant="contained" disabled={loading}>{loading ? t("actions.loading") : "Create"}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
