import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Typography, Box, Button, Card, CardContent, Stack, Grid,
  LinearProgress, CircularProgress, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, IconButton, Chip, alpha,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import FlagIcon from "@mui/icons-material/Flag";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import apiClient from "../../api/client";

interface Goal {
  id: number; title: string; target_amount: number; current_amount: number;
  currency: string; deadline: string | null; monthly_target: number | null;
  status: string; progress_percent: number; created_at: string;
}

function fmt(a: number, c: string) {
  return new Intl.NumberFormat("fr-MA", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(a) + " " + c;
}

export default function Goals() {
  const { t } = useTranslation("common");
  const qc = useQueryClient();

  const { data: goals, isLoading } = useQuery({
    queryKey: ["goals"],
    queryFn: async () => {
      const res = await apiClient.get("/goals");
      return res.data.data as Goal[];
    },
  });

  const [open, setOpen] = useState(false);
  const [contribGoal, setContribGoal] = useState<Goal | null>(null);

  const createGoal = useMutation({
    mutationFn: (d: Record<string, unknown>) => apiClient.post("/goals", d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["goals"] }); setOpen(false); },
  });

  const deleteGoal = useMutation({
    mutationFn: (id: number) => apiClient.delete(`/goals/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }),
  });

  const contribute = useMutation({
    mutationFn: ({ id, amount, note }: { id: number; amount: number; note: string }) =>
      apiClient.post(`/goals/${id}/contribute`, { amount, note }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["goals"] }); setContribGoal(null); },
  });

  function submitGoal(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    createGoal.mutate({ title: fd.get("title"), target_amount: Number(fd.get("target_amount")), deadline: fd.get("deadline") || undefined });
  }

  function submitContrib(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    contribute.mutate({ id: contribGoal!.id, amount: Number(fd.get("amount")), note: fd.get("note") as string });
  }

  return (
    <>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2} sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>{t("nav.goals")}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)} sx={{ bgcolor: "text.primary", "&:hover": { bgcolor: "text.secondary" } }}>{t("actions.add")}</Button>
      </Stack>

      {isLoading ? <Stack alignItems="center" py={8}><CircularProgress /></Stack>
      : !goals?.length ? (
        <Card><CardContent><Stack alignItems="center" spacing={2} py={8}>
          <FlagIcon sx={{ fontSize: 48, color: "text.secondary", opacity: 0.3 }} />
          <Typography variant="body2" color="text.secondary">{t("messages.noData")}</Typography>
        </Stack></CardContent></Card>
      ) : (
        <Grid container spacing={2}>
          {goals.map(g => (
            <Grid key={g.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Card sx={{ height: "100%", border: 1, borderColor: "divider" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700}>{g.title}</Typography>
                      <Chip label={g.status} size="small" sx={{ mt: 0.5, bgcolor: g.status === "completed" ? alpha("#1AA251", 0.1) : alpha("#0072E5", 0.1), color: g.status === "completed" ? "#1AA251" : "#0072E5", fontWeight: 600, fontSize: "0.7rem" }} />
                    </Box>
                    <Stack direction="row">
                      {g.status === "active" && (
                        <IconButton size="small" onClick={() => setContribGoal(g)} color="primary"><AddCircleOutlineIcon sx={{ fontSize: 20 }} /></IconButton>
                      )}
                      <IconButton size="small" onClick={() => deleteGoal.mutate(g.id)} sx={{ color: "error.main" }}><DeleteOutlineIcon sx={{ fontSize: 18 }} /></IconButton>
                    </Stack>
                  </Stack>

                  <Box sx={{ mb: 2 }}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">{fmt(Number(g.current_amount), g.currency)}</Typography>
                      <Typography variant="caption" color="text.secondary">{fmt(Number(g.target_amount), g.currency)}</Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={g.progress_percent} sx={{ height: 8, borderRadius: 4, bgcolor: "#F0F0F0", "& .MuiLinearProgress-bar": { borderRadius: 4, bgcolor: g.status === "completed" ? "#1AA251" : "#0072E5" } }} />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>{g.progress_percent}%</Typography>
                  </Box>

                  {g.deadline && <Typography variant="caption" color="text.secondary">Deadline: {new Date(g.deadline).toLocaleDateString("fr-MA")}</Typography>}
                  {g.monthly_target && <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>Monthly: {fmt(Number(g.monthly_target), g.currency)}</Typography>}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* New Goal Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <form onSubmit={submitGoal}>
          <DialogTitle><Stack direction="row" justifyContent="space-between" alignItems="center"><Typography variant="h6" fontWeight={700}>{t("nav.goals")}</Typography><IconButton onClick={() => setOpen(false)} size="small"><CloseIcon /></IconButton></Stack></DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <TextField name="title" label="Title" required fullWidth />
              <TextField name="target_amount" label="Target Amount" type="number" required fullWidth inputProps={{ min: 1, step: 0.01 }} />
              <TextField name="deadline" label="Deadline" type="date" fullWidth slotProps={{ inputLabel: { shrink: true } }} />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setOpen(false)} color="inherit">{t("actions.cancel")}</Button>
            <Button type="submit" variant="contained" disabled={createGoal.isPending} sx={{ bgcolor: "text.primary", "&:hover": { bgcolor: "text.secondary" }, px: 4 }}>{t("actions.save")}</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Contribute Dialog */}
      <Dialog open={!!contribGoal} onClose={() => setContribGoal(null)} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <form onSubmit={submitContrib}>
          <DialogTitle><Typography variant="h6" fontWeight={700}>Add to: {contribGoal?.title}</Typography></DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <TextField name="amount" label="Amount" type="number" required fullWidth inputProps={{ min: 0.01, step: 0.01 }} />
              <TextField name="note" label="Note" fullWidth />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setContribGoal(null)} color="inherit">{t("actions.cancel")}</Button>
            <Button type="submit" variant="contained" disabled={contribute.isPending} sx={{ bgcolor: "text.primary", "&:hover": { bgcolor: "text.secondary" }, px: 4 }}>{t("actions.save")}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
