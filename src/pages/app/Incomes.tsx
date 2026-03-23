import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Typography, Box, Button, Card, CardContent, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, IconButton, alpha,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import { incomesApi } from "../../api/incomes";
import { categoriesApi } from "../../api/categories";
import type { Income, Category } from "../../types/transaction";

function fmt(amount: number, currency: string) {
  return new Intl.NumberFormat("fr-MA", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount) + " " + currency;
}

export default function Incomes() {
  const { t } = useTranslation("dashboard");
  const { t: tc } = useTranslation("common");
  const qc = useQueryClient();

  const [items, setItems] = useState<Income[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const { isLoading } = useQuery({
    queryKey: ["incomes-list"],
    queryFn: async () => {
      const res = await incomesApi.list({ page: 1, per_page: 15 });
      setItems(res.data.data);
      setHasMore(res.data.meta.current_page < res.data.meta.last_page);
      setPage(1);
      return res.data;
    },
  });

  async function loadMore() {
    setLoadingMore(true);
    const next = page + 1;
    const res = await incomesApi.list({ page: next, per_page: 15 });
    setItems(prev => [...prev, ...res.data.data]);
    setHasMore(res.data.meta.current_page < res.data.meta.last_page);
    setPage(next);
    setLoadingMore(false);
  }

  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Income | null>(null);

  const { data: cats } = useQuery({
    queryKey: ["cats-income"],
    queryFn: async () => (await categoriesApi.list("income")).data.data,
    enabled: open,
  });

  const save = useMutation({
    mutationFn: (d: Record<string, unknown>) => edit ? incomesApi.update(edit.id, d) : incomesApi.create(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["incomes-list"] }); setOpen(false); setEdit(null); },
  });

  const del = useMutation({
    mutationFn: (id: number) => incomesApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["incomes-list"] }),
  });

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    save.mutate({ category_id: Number(fd.get("category_id")), amount: Number(fd.get("amount")), source: fd.get("source"), description: fd.get("description"), income_date: fd.get("income_date") });
  }

  return (
    <>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>{tc("nav.incomes")}</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEdit(null); setOpen(true); }} sx={{ bgcolor: "text.primary", "&:hover": { bgcolor: "text.secondary" } }}>{tc("actions.add")}</Button>
      </Stack>

      <Card sx={{ border: 1, borderColor: "divider" }}>
        <CardContent sx={{ p: 0 }}>
          {isLoading ? <Stack alignItems="center" py={8}><CircularProgress /></Stack>
          : items.length === 0 ? (
            <Stack alignItems="center" spacing={2} py={8}>
              <TrendingUpIcon sx={{ fontSize: 48, color: "text.secondary", opacity: 0.3 }} />
              <Typography variant="body2" color="text.secondary">{tc("messages.noData")}</Typography>
            </Stack>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "action.hover" }}>
                      <TableCell sx={{ fontWeight: 600, fontSize: 13 }}>{t("category")}</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 13 }}>{t("source")}</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 13, display: { xs: "none", sm: "table-cell" } }}>{t("description")}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, fontSize: 13 }}>{t("amount")}</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 13, display: { xs: "none", md: "table-cell" } }}>{t("date")}</TableCell>
                      <TableCell sx={{ width: 80 }} />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map(inc => (
                      <TableRow key={inc.id} hover>
                        <TableCell>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: alpha(inc.category.color ?? "#607D8B", 0.1), color: inc.category.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <span className="material-icons" style={{ fontSize: 18 }}>{inc.category.icon}</span>
                            </Box>
                            <Typography variant="body2" fontWeight={500}>{inc.category.name}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell><Typography variant="body2" color="text.secondary">{inc.source ?? "—"}</Typography></TableCell>
                        <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}><Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 180 }}>{inc.description ?? "—"}</Typography></TableCell>
                        <TableCell align="right"><Typography variant="body2" fontWeight={600} color="#1AA251">+{fmt(Number(inc.amount), inc.currency)}</Typography></TableCell>
                        <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}><Typography variant="body2" color="text.secondary">{new Date(inc.income_date).toLocaleDateString("fr-MA")}</Typography></TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={() => { setEdit(inc); setOpen(true); }}><EditOutlinedIcon sx={{ fontSize: 18 }} /></IconButton>
                          <IconButton size="small" onClick={() => del.mutate(inc.id)} sx={{ color: "error.main" }}><DeleteOutlineIcon sx={{ fontSize: 18 }} /></IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {hasMore && <Stack alignItems="center" py={2.5}><Button variant="outlined" onClick={loadMore} disabled={loadingMore} startIcon={loadingMore ? <CircularProgress size={18} /> : undefined} sx={{ borderRadius: 3 }}>{loadingMore ? tc("actions.loading") : t("loadMore")}</Button></Stack>}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <form onSubmit={submit}>
          <DialogTitle><Stack direction="row" justifyContent="space-between" alignItems="center"><Typography variant="h6" fontWeight={700}>{t("addIncomeTitle")}</Typography><IconButton onClick={() => setOpen(false)} size="small"><CloseIcon /></IconButton></Stack></DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <TextField name="category_id" select label={t("selectCategory")} required fullWidth defaultValue={edit?.category.id ?? ""}>
                {(cats ?? []).map((c: Category) => <MenuItem key={c.id} value={c.id}><Stack direction="row" spacing={1.5} alignItems="center"><Box sx={{ width: 24, height: 24, borderRadius: 1, bgcolor: alpha(c.color ?? "#607D8B", 0.12), display: "flex", alignItems: "center", justifyContent: "center" }}><span className="material-icons" style={{ fontSize: 16, color: c.color ?? "#607D8B" }}>{c.icon}</span></Box><span>{c.name}</span></Stack></MenuItem>)}
              </TextField>
              <TextField name="amount" label={t("amount")} type="number" required fullWidth defaultValue={edit?.amount ?? ""} inputProps={{ min: 0.01, step: 0.01 }} />
              <TextField name="source" label={t("source")} fullWidth defaultValue={edit?.source ?? ""} />
              <TextField name="description" label={t("description")} fullWidth multiline rows={2} defaultValue={edit?.description ?? ""} />
              <TextField name="income_date" label={t("date")} type="date" required fullWidth defaultValue={edit?.income_date ?? new Date().toISOString().split("T")[0]} slotProps={{ inputLabel: { shrink: true } }} />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setOpen(false)} color="inherit">{t("cancel")}</Button>
            <Button type="submit" variant="contained" disabled={save.isPending} sx={{ bgcolor: "text.primary", "&:hover": { bgcolor: "text.secondary" }, px: 4 }}>{t("save")}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
