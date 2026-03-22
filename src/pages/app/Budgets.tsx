import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Typography, Box, Button, Card, CardContent, Stack, Grid,
  CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, IconButton, alpha,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import apiClient from "../../api/client";
import { categoriesApi } from "../../api/categories";
import type { Category } from "../../types/transaction";

interface Budget {
  id: number; category: Category; amount: number; currency: string;
  period: string; start_date: string; end_date: string | null; created_at: string;
}

function fmt(a: number, c: string) {
  return new Intl.NumberFormat("fr-MA", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(a) + " " + c;
}

export default function Budgets() {
  const { t } = useTranslation("common");
  const qc = useQueryClient();

  const { data: budgets, isLoading } = useQuery({
    queryKey: ["budgets"],
    queryFn: async () => { const res = await apiClient.get("/budgets"); return res.data.data as Budget[]; },
  });

  const [open, setOpen] = useState(false);

  const { data: cats } = useQuery({
    queryKey: ["cats-expense-budget"],
    queryFn: async () => (await categoriesApi.list("expense")).data.data,
    enabled: open,
  });

  const create = useMutation({
    mutationFn: (d: Record<string, unknown>) => apiClient.post("/budgets", d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["budgets"] }); setOpen(false); },
  });

  const del = useMutation({
    mutationFn: (id: number) => apiClient.delete(`/budgets/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["budgets"] }),
  });

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    create.mutate({ category_id: Number(fd.get("category_id")), amount: Number(fd.get("amount")), period: fd.get("period"), start_date: fd.get("start_date") });
  }

  return (
    <>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2} sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>{t("nav.budgets")}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)} sx={{ bgcolor: "#171717", "&:hover": { bgcolor: "#333" } }}>{t("actions.add")}</Button>
      </Stack>

      {isLoading ? <Stack alignItems="center" py={8}><CircularProgress /></Stack>
      : !budgets?.length ? (
        <Card><CardContent><Stack alignItems="center" spacing={2} py={8}>
          <AccountBalanceWalletIcon sx={{ fontSize: 48, color: "text.secondary", opacity: 0.3 }} />
          <Typography variant="body2" color="text.secondary">{t("messages.noData")}</Typography>
        </Stack></CardContent></Card>
      ) : (
        <Grid container spacing={2}>
          {budgets.map(b => (
            <Grid key={b.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Card sx={{ border: "1px solid #EDEDED" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: alpha(b.category.color ?? "#607D8B", 0.1), color: b.category.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span className="material-icons" style={{ fontSize: 20 }}>{b.category.icon}</span>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>{b.category.name}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: "capitalize" }}>{b.period}</Typography>
                      </Box>
                    </Stack>
                    <IconButton size="small" onClick={() => del.mutate(b.id)} sx={{ color: "error.main" }}><DeleteOutlineIcon sx={{ fontSize: 18 }} /></IconButton>
                  </Stack>
                  <Typography variant="h5" fontWeight={700} sx={{ mt: 2, color: "#0072E5" }}>{fmt(Number(b.amount), b.currency)}</Typography>
                  <Typography variant="caption" color="text.secondary">From {new Date(b.start_date).toLocaleDateString("fr-MA")}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <form onSubmit={submit}>
          <DialogTitle><Stack direction="row" justifyContent="space-between" alignItems="center"><Typography variant="h6" fontWeight={700}>{t("nav.budgets")}</Typography><IconButton onClick={() => setOpen(false)} size="small"><CloseIcon /></IconButton></Stack></DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <TextField name="category_id" select label="Category" required fullWidth>
                {(cats ?? []).map((c: Category) => <MenuItem key={c.id} value={c.id}><Stack direction="row" spacing={1.5} alignItems="center"><Box sx={{ width: 24, height: 24, borderRadius: 1, bgcolor: alpha(c.color ?? "#607D8B", 0.12), display: "flex", alignItems: "center", justifyContent: "center" }}><span className="material-icons" style={{ fontSize: 16, color: c.color ?? "#607D8B" }}>{c.icon}</span></Box><span>{c.name}</span></Stack></MenuItem>)}
              </TextField>
              <TextField name="amount" label="Budget Limit" type="number" required fullWidth inputProps={{ min: 0.01, step: 0.01 }} />
              <TextField name="period" select label="Period" required fullWidth defaultValue="monthly">
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </TextField>
              <TextField name="start_date" label="Start Date" type="date" required fullWidth defaultValue={new Date().toISOString().split("T")[0]} slotProps={{ inputLabel: { shrink: true } }} />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setOpen(false)} color="inherit">{t("actions.cancel")}</Button>
            <Button type="submit" variant="contained" disabled={create.isPending} sx={{ bgcolor: "#171717", "&:hover": { bgcolor: "#333" }, px: 4 }}>{t("actions.save")}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
