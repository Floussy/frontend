import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Typography, Card, CardContent, Stack, Box, Button, Avatar, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  IconButton, LinearProgress, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, CircularProgress, Alert, alpha, Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { sharedBudgetsApi } from "../../api/sharedBudgets";
import { useAuthStore } from "../../store/authStore";
import type { SharedBudget } from "../../types/sharedBudget";

function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat("fr-MA", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount) + " " + currency;
}

const roleColors: Record<string, string> = { admin: "#EF4444", editor: "#3B82F6", viewer: "#6B7280" };

export default function SharedBudgetDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation("common");
  const { user } = useAuthStore();
  const qc = useQueryClient();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { data: budget, isLoading } = useQuery({
    queryKey: ["shared-budget", id],
    queryFn: async () => {
      const res = await sharedBudgetsApi.show(Number(id));
      return res.data.data as SharedBudget;
    },
    enabled: !!id,
  });

  const isAdmin = budget?.current_user_role === "admin";
  const canEdit = isAdmin || budget?.current_user_role === "editor";

  async function handleInvite(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      await sharedBudgetsApi.invite(Number(id), {
        email: fd.get("email") as string,
        role: fd.get("role") as string,
      });
      qc.invalidateQueries({ queryKey: ["shared-budget", id] });
      setInviteOpen(false);
    } catch {
      setError("Failed to invite. Make sure the email belongs to a registered user.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddExpense(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      await sharedBudgetsApi.addExpense(Number(id), {
        amount: Number(fd.get("amount")),
        description: fd.get("description") || null,
        expense_date: fd.get("expense_date"),
      });
      qc.invalidateQueries({ queryKey: ["shared-budget", id] });
      setExpenseOpen(false);
    } catch {
      setError(t("messages.error"));
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteExpense(expenseId: number) {
    await sharedBudgetsApi.deleteExpense(Number(id), expenseId);
    qc.invalidateQueries({ queryKey: ["shared-budget", id] });
  }

  async function handleRemoveMember(memberId: number) {
    await sharedBudgetsApi.removeMember(Number(id), memberId);
    qc.invalidateQueries({ queryKey: ["shared-budget", id] });
  }

  if (isLoading || !budget) {
    return <Stack alignItems="center" py={6}><CircularProgress /></Stack>;
  }

  return (
    <>
      {/* Header */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate("/app/shared-budgets")}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" fontWeight={700}>{budget.name}</Typography>
          {budget.description && <Typography variant="body2" color="text.secondary">{budget.description}</Typography>}
        </Box>
        <Stack direction="row" spacing={1}>
          {isAdmin && (
            <Button variant="outlined" startIcon={<PersonAddIcon />} onClick={() => setInviteOpen(true)}
              sx={{ borderColor: "divider", color: "text.primary" }}
            >
              Invite
            </Button>
          )}
          {canEdit && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setExpenseOpen(true)}>
              Add Expense
            </Button>
          )}
        </Stack>
      </Stack>

      {/* Progress Card */}
      <Card sx={{ border: 1, borderColor: "divider", mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={3} justifyContent="space-between">
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Budget Progress</Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min(budget.percent_used, 100)}
                sx={{
                  height: 10, borderRadius: 5, bgcolor: "action.hover", mb: 1,
                  "& .MuiLinearProgress-bar": {
                    bgcolor: budget.percent_used > 90 ? "error.main" : budget.percent_used > 70 ? "warning.main" : "primary.main",
                    borderRadius: 5,
                  },
                }}
              />
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption" color="text.secondary">
                  {formatMoney(budget.total_spent, budget.currency)} spent
                </Typography>
                <Typography variant="caption" fontWeight={600}>{budget.percent_used}%</Typography>
              </Stack>
            </Box>
            <Stack spacing={0.5} sx={{ minWidth: 150 }}>
              <Typography variant="body2" color="text.secondary">Total Budget</Typography>
              <Typography variant="h6" fontWeight={700}>{formatMoney(budget.total_amount, budget.currency)}</Typography>
              <Typography variant="body2" fontWeight={600} color={budget.remaining >= 0 ? "success.main" : "error.main"}>
                {formatMoney(budget.remaining, budget.currency)} remaining
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2.5}>
        {/* Members */}
        <Card sx={{ border: 1, borderColor: "divider", flex: 1 }}>
          <CardContent sx={{ p: 2.5 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Members ({budget.members?.length ?? 0})</Typography>
            <Stack spacing={1.5} divider={<Divider />}>
              {budget.members?.map((m) => (
                <Stack key={m.id} direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar sx={{ width: 32, height: 32, fontSize: 14, bgcolor: "primary.main" }}>
                      {m.user.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>{m.user.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{m.user.email}</Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      label={m.role}
                      size="small"
                      sx={{ bgcolor: alpha(roleColors[m.role] ?? "#999", 0.1), color: roleColors[m.role], fontWeight: 600, fontSize: 11, textTransform: "capitalize" }}
                    />
                    <Chip
                      label={m.status}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: 11, textTransform: "capitalize" }}
                    />
                    {isAdmin && m.user.id !== budget.owner.id && m.status !== "pending" && (
                      <IconButton size="small" color="error" onClick={() => handleRemoveMember(m.id)}>
                        <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    )}
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>

        {/* Expenses */}
        <Card sx={{ border: 1, borderColor: "divider", flex: 2 }}>
          <CardContent sx={{ p: 2.5 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Expenses</Typography>
            {(!budget.expenses || budget.expenses.length === 0) ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: "center" }}>
                No expenses yet.
              </Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>By</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {budget.expenses.map((exp) => (
                      <TableRow key={exp.id}>
                        <TableCell sx={{ fontSize: 13 }}>
                          {new Date(exp.expense_date).toLocaleDateString("fr-MA")}
                        </TableCell>
                        <TableCell sx={{ fontSize: 13 }}>{exp.user.name}</TableCell>
                        <TableCell sx={{ fontSize: 13 }}>{exp.description ?? "—"}</TableCell>
                        <TableCell align="right" sx={{ fontSize: 13, fontWeight: 600 }}>
                          {formatMoney(exp.amount, exp.currency)}
                        </TableCell>
                        <TableCell sx={{ width: 40 }}>
                          {(exp.user.id === user?.id || isAdmin) && (
                            <IconButton size="small" color="error" onClick={() => handleDeleteExpense(exp.id)}>
                              <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Stack>

      {/* Invite Dialog */}
      <Dialog open={inviteOpen} onClose={() => setInviteOpen(false)} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <form onSubmit={handleInvite}>
          <DialogTitle>Invite Member</DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              {error && <Alert severity="error">{error}</Alert>}
              <TextField name="email" label="Email" type="email" required fullWidth placeholder="user@example.com" />
              <TextField name="role" select label="Role" fullWidth defaultValue="editor">
                <MenuItem value="admin">Admin — can manage members & expenses</MenuItem>
                <MenuItem value="editor">Editor — can add expenses</MenuItem>
                <MenuItem value="viewer">Viewer — read-only</MenuItem>
              </TextField>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setInviteOpen(false)} color="inherit">{t("actions.cancel")}</Button>
            <Button type="submit" variant="contained" disabled={loading}>{loading ? t("actions.loading") : "Invite"}</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Add Expense Dialog */}
      <Dialog open={expenseOpen} onClose={() => setExpenseOpen(false)} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <form onSubmit={handleAddExpense}>
          <DialogTitle>Add Expense</DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              {error && <Alert severity="error">{error}</Alert>}
              <TextField name="amount" label="Amount" type="number" required fullWidth slotProps={{ htmlInput: { step: "0.01", min: "0.01" } }} />
              <TextField name="description" label="Description" fullWidth />
              <TextField name="expense_date" label="Date" type="date" required fullWidth defaultValue={new Date().toISOString().split("T")[0]} slotProps={{ inputLabel: { shrink: true } }} />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setExpenseOpen(false)} color="inherit">{t("actions.cancel")}</Button>
            <Button type="submit" variant="contained" disabled={loading}>{loading ? t("actions.loading") : t("actions.add")}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
