import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Typography, Grid, Card, CardContent, Stack, Box, Button, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  IconButton, alpha, CircularProgress, Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import StarIcon from "@mui/icons-material/Star";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import SavingsIcon from "@mui/icons-material/Savings";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import { accountsApi, transfersApi } from "../../api/accounts";
import type { Account } from "../../types/account";

const typeConfig: Record<string, { icon: React.ReactNode; label: string }> = {
  cash: { icon: <AccountBalanceWalletIcon />, label: "Cash" },
  checking: { icon: <AccountBalanceIcon />, label: "Checking" },
  savings: { icon: <SavingsIcon />, label: "Savings" },
  credit_card: { icon: <CreditCardIcon />, label: "Credit Card" },
  e_wallet: { icon: <PhoneAndroidIcon />, label: "E-Wallet" },
};

function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat("fr-MA", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount) + " " + currency;
}

export default function Accounts() {
  const { t } = useTranslation("common");
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const res = await accountsApi.list();
      return res.data.data as Account[];
    },
  });

  const accounts = data ?? [];
  const totalBalance = accounts.reduce((sum, a) => sum + a.current_balance, 0);
  const defaultCurrency = accounts.find((a) => a.is_default)?.currency ?? "MAD";

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get("name") as string,
      type: fd.get("type") as string,
      currency: fd.get("currency") as string,
      initial_balance: Number(fd.get("initial_balance")),
      color: fd.get("color") as string,
      is_default: fd.get("is_default") === "true",
    };
    try {
      if (editing) {
        await accountsApi.update(editing.id, payload);
      } else {
        await accountsApi.create(payload);
      }
      qc.invalidateQueries({ queryKey: ["accounts"] });
      setDialogOpen(false);
      setEditing(null);
    } catch {
      setError(t("messages.error"));
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      await accountsApi.delete(id);
      qc.invalidateQueries({ queryKey: ["accounts"] });
    } catch {
      /* silently fail */
    }
  }

  async function handleTransfer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      await transfersApi.create({
        from_account_id: Number(fd.get("from_account_id")),
        to_account_id: Number(fd.get("to_account_id")),
        amount: Number(fd.get("amount")),
        transfer_date: fd.get("transfer_date") as string,
        description: fd.get("description") as string,
      });
      qc.invalidateQueries({ queryKey: ["accounts"] });
      setTransferOpen(false);
    } catch {
      setError(t("messages.error"));
    } finally {
      setLoading(false);
    }
  }

  if (isLoading) {
    return <Stack alignItems="center" py={6}><CircularProgress /></Stack>;
  }

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Accounts</Typography>
          <Typography variant="body2" color="text.secondary">
            Total: {formatMoney(totalBalance, defaultCurrency)}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<SwapHorizIcon />} onClick={() => setTransferOpen(true)}
            sx={{ borderColor: "divider", color: "text.primary", "&:hover": { borderColor: "text.disabled" } }}
          >
            Transfer
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditing(null); setDialogOpen(true); }}>
            Add Account
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={2.5}>
        {accounts.map((acc) => {
          const config = typeConfig[acc.type] ?? typeConfig.cash;
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={acc.id}>
              <Card sx={{ border: 1, borderColor: "divider", position: "relative" }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box sx={{
                        width: 44, height: 44, borderRadius: 2,
                        bgcolor: alpha(acc.color ?? "#4CAF50", 0.1),
                        color: acc.color ?? "#4CAF50",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {config.icon}
                      </Box>
                      <Box>
                        <Typography variant="body1" fontWeight={600}>{acc.name}</Typography>
                        <Chip label={config.label} size="small" sx={{ fontSize: 11, height: 20 }} />
                      </Box>
                    </Stack>
                    <Stack direction="row" spacing={0.5}>
                      {acc.is_default && <StarIcon sx={{ fontSize: 16, color: "warning.main" }} />}
                      <IconButton size="small" onClick={() => { setEditing(acc); setDialogOpen(true); }}>
                        <EditOutlinedIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                      {!acc.is_default && (
                        <IconButton size="small" color="error" onClick={() => handleDelete(acc.id)}>
                          <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      )}
                    </Stack>
                  </Stack>
                  <Typography variant="h5" fontWeight={700} sx={{ mt: 2.5 }}>
                    {formatMoney(acc.current_balance, acc.currency)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* ── Add/Edit Account Dialog ── */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <form onSubmit={handleSave}>
          <DialogTitle>{editing ? "Edit Account" : "Add Account"}</DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              {error && <Alert severity="error">{error}</Alert>}
              <TextField name="name" label="Name" required fullWidth defaultValue={editing?.name ?? ""} />
              <TextField name="type" select label="Type" required fullWidth defaultValue={editing?.type ?? "cash"}>
                {Object.entries(typeConfig).map(([key, val]) => (
                  <MenuItem key={key} value={key}>{val.label}</MenuItem>
                ))}
              </TextField>
              <TextField name="currency" select label="Currency" fullWidth defaultValue={editing?.currency ?? "MAD"}>
                {["MAD", "EUR", "USD", "GBP", "CAD", "TRY"].map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
              <TextField name="initial_balance" label="Initial Balance" type="number" fullWidth defaultValue={editing?.initial_balance ?? 0} slotProps={{ htmlInput: { step: "0.01" } }} />
              <TextField name="color" label="Color" type="color" fullWidth defaultValue={editing?.color ?? "#4CAF50"} />
              <TextField name="is_default" select label="Default Account" fullWidth defaultValue={editing?.is_default ? "true" : "false"}>
                <MenuItem value="false">No</MenuItem>
                <MenuItem value="true">Yes</MenuItem>
              </TextField>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setDialogOpen(false)} color="inherit">{t("actions.cancel")}</Button>
            <Button type="submit" variant="contained" disabled={loading}>{loading ? t("actions.loading") : t("actions.save")}</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ── Transfer Dialog ── */}
      <Dialog open={transferOpen} onClose={() => setTransferOpen(false)} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <form onSubmit={handleTransfer}>
          <DialogTitle>Transfer Between Accounts</DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              {error && <Alert severity="error">{error}</Alert>}
              <TextField name="from_account_id" select label="From" required fullWidth>
                {accounts.map((a) => <MenuItem key={a.id} value={a.id}>{a.name} ({formatMoney(a.current_balance, a.currency)})</MenuItem>)}
              </TextField>
              <TextField name="to_account_id" select label="To" required fullWidth>
                {accounts.map((a) => <MenuItem key={a.id} value={a.id}>{a.name} ({a.currency})</MenuItem>)}
              </TextField>
              <TextField name="amount" label="Amount" type="number" required fullWidth slotProps={{ htmlInput: { step: "0.01", min: "0.01" } }} />
              <TextField name="transfer_date" label="Date" type="date" required fullWidth defaultValue={new Date().toISOString().split("T")[0]} slotProps={{ inputLabel: { shrink: true } }} />
              <TextField name="description" label="Note (optional)" fullWidth />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setTransferOpen(false)} color="inherit">{t("actions.cancel")}</Button>
            <Button type="submit" variant="contained" disabled={loading}>{loading ? t("actions.loading") : "Transfer"}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
