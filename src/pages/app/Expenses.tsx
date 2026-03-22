import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Typography, Box, Button, Card, CardContent, Stack, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, IconButton, alpha,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

import { expensesApi } from "../../api/expenses";
import { categoriesApi } from "../../api/categories";
import type { Expense, Category } from "../../types/transaction";

function fmt(amount: number, currency: string) {
  return new Intl.NumberFormat("fr-MA", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount) + " " + currency;
}

export default function Expenses() {
  const { t } = useTranslation("dashboard");
  const { t: tc } = useTranslation("common");
  const qc = useQueryClient();

  const [items, setItems] = useState<Expense[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const { isLoading } = useQuery({
    queryKey: ["expenses-list"],
    queryFn: async () => {
      const res = await expensesApi.list({ page: 1, per_page: 15 });
      setItems(res.data.data);
      setHasMore(res.data.meta.current_page < res.data.meta.last_page);
      setPage(1);
      return res.data;
    },
  });

  async function loadMore() {
    setLoadingMore(true);
    const next = page + 1;
    const res = await expensesApi.list({ page: next, per_page: 15 });
    setItems(prev => [...prev, ...res.data.data]);
    setHasMore(res.data.meta.current_page < res.data.meta.last_page);
    setPage(next);
    setLoadingMore(false);
  }

  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Expense | null>(null);

  const { data: cats } = useQuery({
    queryKey: ["cats-expense"],
    queryFn: async () => (await categoriesApi.list("expense")).data.data,
    enabled: open,
  });

  const save = useMutation({
    mutationFn: (d: FormData) => edit ? expensesApi.update(edit.id, d) : expensesApi.create(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["expenses-list"] }); setOpen(false); setEdit(null); },
  });

  const del = useMutation({
    mutationFn: (id: number) => expensesApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["expenses-list"] }),
  });

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const raw = new FormData(e.currentTarget);
    const fd = new FormData();
    fd.append("category_id", raw.get("category_id") as string);
    fd.append("amount", raw.get("amount") as string);
    fd.append("description", raw.get("description") as string);
    fd.append("expense_date", raw.get("expense_date") as string);
    const files = (e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement)?.files;
    if (files) for (let i = 0; i < files.length; i++) fd.append("receipts[]", files[i]);
    save.mutate(fd);
  }

  return (
    <>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2} sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>{tc("nav.expenses")}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEdit(null); setOpen(true); }} sx={{ bgcolor: "#171717", "&:hover": { bgcolor: "#333" } }}>{tc("actions.add")}</Button>
      </Stack>

      <Card sx={{ border: "1px solid #EDEDED" }}>
        <CardContent sx={{ p: 0 }}>
          {isLoading ? <Stack alignItems="center" py={8}><CircularProgress /></Stack>
          : items.length === 0 ? (
            <Stack alignItems="center" spacing={2} py={8}>
              <TrendingDownIcon sx={{ fontSize: 48, color: "text.secondary", opacity: 0.3 }} />
              <Typography variant="body2" color="text.secondary">{tc("messages.noData")}</Typography>
            </Stack>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#FAFAFA" }}>
                      <TableCell sx={{ fontWeight: 600, fontSize: 13 }}>{t("category")}</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 13, display: { xs: "none", sm: "table-cell" } }}>{t("description")}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, fontSize: 13 }}>{t("amount")}</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 13, display: { xs: "none", md: "table-cell" } }}>{t("date")}</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 13, display: { xs: "none", md: "table-cell" } }}>{t("receiptUpload")}</TableCell>
                      <TableCell sx={{ width: 80 }} />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map(exp => (
                      <TableRow key={exp.id} hover>
                        <TableCell>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: alpha(exp.category.color ?? "#607D8B", 0.1), color: exp.category.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <span className="material-icons" style={{ fontSize: 18 }}>{exp.category.icon}</span>
                            </Box>
                            <Typography variant="body2" fontWeight={500}>{exp.category.name}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}><Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 180 }}>{exp.description ?? "—"}</Typography></TableCell>
                        <TableCell align="right"><Typography variant="body2" fontWeight={600} color="#EB0014">-{fmt(Number(exp.amount), exp.currency)}</Typography></TableCell>
                        <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}><Typography variant="body2" color="text.secondary">{new Date(exp.expense_date).toLocaleDateString("fr-MA")}</Typography></TableCell>
                        <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                          {exp.receipts?.length > 0 ? <Chip icon={<ReceiptLongIcon />} label={exp.receipts.length} size="small" variant="outlined" sx={{ fontSize: 12 }} /> : <Typography variant="body2" color="text.secondary">—</Typography>}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={() => { setEdit(exp); setOpen(true); }}><EditOutlinedIcon sx={{ fontSize: 18 }} /></IconButton>
                          <IconButton size="small" onClick={() => del.mutate(exp.id)} sx={{ color: "error.main" }}><DeleteOutlineIcon sx={{ fontSize: 18 }} /></IconButton>
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
          <DialogTitle><Stack direction="row" justifyContent="space-between" alignItems="center"><Typography variant="h6" fontWeight={700}>{t("addExpenseTitle")}</Typography><IconButton onClick={() => setOpen(false)} size="small"><CloseIcon /></IconButton></Stack></DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <TextField name="category_id" select label={t("selectCategory")} required fullWidth defaultValue={edit?.category.id ?? ""}>
                {(cats ?? []).map((c: Category) => <MenuItem key={c.id} value={c.id}><Stack direction="row" spacing={1.5} alignItems="center"><Box sx={{ width: 24, height: 24, borderRadius: 1, bgcolor: alpha(c.color ?? "#607D8B", 0.12), display: "flex", alignItems: "center", justifyContent: "center" }}><span className="material-icons" style={{ fontSize: 16, color: c.color ?? "#607D8B" }}>{c.icon}</span></Box><span>{c.name}</span></Stack></MenuItem>)}
              </TextField>
              <TextField name="amount" label={t("amount")} type="number" required fullWidth defaultValue={edit?.amount ?? ""} inputProps={{ min: 0.01, step: 0.01 }} />
              <TextField name="description" label={t("description")} fullWidth multiline rows={2} defaultValue={edit?.description ?? ""} />
              <TextField name="expense_date" label={t("date")} type="date" required fullWidth defaultValue={edit?.expense_date ?? new Date().toISOString().split("T")[0]} slotProps={{ inputLabel: { shrink: true } }} />
              <Button component="label" variant="outlined" startIcon={<CameraAltIcon />} sx={{ borderStyle: "dashed" }}>{t("addReceipt")}<input type="file" name="receipts" accept="image/*,.pdf" multiple hidden /></Button>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setOpen(false)} color="inherit">{t("cancel")}</Button>
            <Button type="submit" variant="contained" disabled={save.isPending} sx={{ bgcolor: "#171717", "&:hover": { bgcolor: "#333" }, px: 4 }}>{t("save")}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
