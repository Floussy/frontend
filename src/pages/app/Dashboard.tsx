import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Stack,
  Button,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  alpha,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AddIcon from "@mui/icons-material/Add";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CloseIcon from "@mui/icons-material/Close";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useAuthStore } from "../../store/authStore";
import { dashboardApi } from "../../api/dashboard";
import { categoriesApi } from "../../api/categories";
import { incomesApi } from "../../api/incomes";
import { expensesApi } from "../../api/expenses";
import type { Transaction } from "../../types/dashboard";
import type { Category } from "../../types/transaction";
import OnboardingTour, { useOnboardingTour } from "../../components/onboarding/OnboardingTour";

function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat("fr-MA", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + " " + currency;
}

export default function Dashboard() {
  const { t } = useTranslation("dashboard");
  const { user } = useAuthStore();

  // ── Onboarding tour ──
  const isNewUser = !localStorage.getItem("floussy_tour_completed");
  const { run: tourRun, completeTour } = useOnboardingTour(isNewUser);

  // ── Dashboard data ──
  const { data: dashData, isLoading, refetch } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await dashboardApi.get();
      return res.data.data;
    },
  });

  // ── Transaction history with Load More ──
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [incomePage, setIncomePage] = useState(1);
  const [expensePage, setExpensePage] = useState(1);
  const [hasMoreIncome, setHasMoreIncome] = useState(true);
  const [hasMoreExpense, setHasMoreExpense] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Load initial transactions
  useQuery({
    queryKey: ["initial-transactions"],
    queryFn: async () => {
      const [incRes, expRes] = await Promise.all([
        incomesApi.list({ page: 1, per_page: 10 }),
        expensesApi.list({ page: 1, per_page: 10 }),
      ]);

      const incTx: Transaction[] = incRes.data.data.map((i) => ({
        id: i.id,
        type: "income" as const,
        amount: Number(i.amount),
        currency: i.currency,
        category: i.category.name,
        icon: i.category.icon ?? "more_horiz",
        color: i.category.color ?? "#607D8B",
        description: i.source ?? i.description,
        date: i.income_date,
      }));

      const expTx: Transaction[] = expRes.data.data.map((e) => ({
        id: e.id,
        type: "expense" as const,
        amount: Number(e.amount),
        currency: e.currency,
        category: e.category.name,
        icon: e.category.icon ?? "more_horiz",
        color: e.category.color ?? "#607D8B",
        description: e.description,
        date: e.expense_date,
      }));

      const all = [...incTx, ...expTx].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setTransactions(all);
      setHasMoreIncome(incRes.data.meta.current_page < incRes.data.meta.last_page);
      setHasMoreExpense(expRes.data.meta.current_page < expRes.data.meta.last_page);
      setInitialized(true);
      return all;
    },
  });

  const loadMore = useCallback(async () => {
    setLoadingMore(true);
    const promises: Promise<void>[] = [];

    if (hasMoreIncome) {
      const nextPage = incomePage + 1;
      promises.push(
        incomesApi.list({ page: nextPage, per_page: 10 }).then((res) => {
          const mapped: Transaction[] = res.data.data.map((i) => ({
            id: i.id,
            type: "income" as const,
            amount: Number(i.amount),
            currency: i.currency,
            category: i.category.name,
            icon: i.category.icon ?? "more_horiz",
            color: i.category.color ?? "#607D8B",
            description: i.source ?? i.description,
            date: i.income_date,
          }));
          setTransactions((prev) => {
            const ids = new Set(prev.map((t) => `${t.type}-${t.id}`));
            const newOnes = mapped.filter((t) => !ids.has(`${t.type}-${t.id}`));
            return [...prev, ...newOnes].sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );
          });
          setIncomePage(nextPage);
          setHasMoreIncome(res.data.meta.current_page < res.data.meta.last_page);
        })
      );
    }

    if (hasMoreExpense) {
      const nextPage = expensePage + 1;
      promises.push(
        expensesApi.list({ page: nextPage, per_page: 10 }).then((res) => {
          const mapped: Transaction[] = res.data.data.map((e) => ({
            id: e.id,
            type: "expense" as const,
            amount: Number(e.amount),
            currency: e.currency,
            category: e.category.name,
            icon: e.category.icon ?? "more_horiz",
            color: e.category.color ?? "#607D8B",
            description: e.description,
            date: e.expense_date,
          }));
          setTransactions((prev) => {
            const ids = new Set(prev.map((t) => `${t.type}-${t.id}`));
            const newOnes = mapped.filter((t) => !ids.has(`${t.type}-${t.id}`));
            return [...prev, ...newOnes].sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );
          });
          setExpensePage(nextPage);
          setHasMoreExpense(res.data.meta.current_page < res.data.meta.last_page);
        })
      );
    }

    await Promise.all(promises);
    setLoadingMore(false);
  }, [hasMoreIncome, hasMoreExpense, incomePage, expensePage]);

  const hasMore = hasMoreIncome || hasMoreExpense;

  // ── Add Income/Expense Dialog ──
  const [dialogOpen, setDialogOpen] = useState<"income" | "expense" | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["categories", dialogOpen],
    queryFn: async () => {
      if (!dialogOpen) return [];
      const res = await categoriesApi.list(dialogOpen);
      return res.data.data;
    },
    enabled: !!dialogOpen,
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormLoading(true);
    const fd = new FormData(e.currentTarget);

    try {
      if (dialogOpen === "income") {
        await incomesApi.create({
          category_id: Number(fd.get("category_id")),
          amount: Number(fd.get("amount")),
          source: fd.get("source") as string,
          description: fd.get("description") as string,
          income_date: fd.get("date") as string,
        });
      } else {
        const formData = new FormData();
        formData.append("category_id", fd.get("category_id") as string);
        formData.append("amount", fd.get("amount") as string);
        formData.append("description", fd.get("description") as string);
        formData.append("expense_date", fd.get("date") as string);
        const files = (e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement)?.files;
        if (files) {
          for (let i = 0; i < files.length; i++) {
            formData.append("receipts[]", files[i]);
          }
        }
        await expensesApi.create(formData);
      }

      setDialogOpen(null);
      refetch();
      // Reload transactions
      setIncomePage(1);
      setExpensePage(1);
      setInitialized(false);
    } finally {
      setFormLoading(false);
    }
  }

  const summary = dashData?.summary;
  const currency = summary?.currency ?? user?.default_currency ?? "MAD";

  return (
    <>
      {/* ── Onboarding Tour ── */}
      <OnboardingTour run={tourRun} onComplete={completeTour} />

      {/* ── User Header ── */}
      <Box
        data-tour="user-header"
        sx={{
          mb: 4,
          p: { xs: 2.5, sm: 3.5 },
          borderRadius: 4,
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: "white",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          alignItems={{ sm: "center" }}
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={2.5} alignItems="center">
            <Avatar
              src={user?.avatar ? `${import.meta.env.VITE_API_URL?.replace("/api/v1", "")}/storage/${user.avatar}` : undefined}
              sx={{
                width: { xs: 56, sm: 64 },
                height: { xs: 56, sm: 64 },
                fontSize: 24,
                fontWeight: 700,
                bgcolor: "rgba(255,255,255,0.2)",
                border: "3px solid rgba(255,255,255,0.3)",
              }}
            >
              {user?.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={700} sx={{ color: "inherit" }}>
                {t("welcome", { name: user?.name ?? "" })}
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", mt: 0.5 }}>
                {summary?.month ?? ""} — {t("thisMonth")}
              </Typography>
            </Box>
          </Stack>

          {/* Quick action buttons */}
          <Stack direction="row" spacing={1.5} data-tour="quick-actions">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen("income")}
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                color: "white",
                backdropFilter: "blur(10px)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
              }}
            >
              {t("addIncome")}
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen("expense")}
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                color: "white",
                backdropFilter: "blur(10px)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
              }}
            >
              {t("addExpense")}
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* ── Summary Cards ── */}
      <Grid container spacing={2.5} sx={{ mb: 4 }} data-tour="summary-cards">
        {[
          {
            key: "totalIncome",
            value: summary?.total_income ?? 0,
            icon: <TrendingUpIcon />,
            color: "#1AA251",
          },
          {
            key: "totalExpenses",
            value: summary?.total_expenses ?? 0,
            icon: <TrendingDownIcon />,
            color: "#EB0014",
          },
          {
            key: "balance",
            value: summary?.balance ?? 0,
            icon: <AccountBalanceWalletIcon />,
            color: "#0072E5",
          },
        ].map((card) => (
          <Grid key={card.key} size={{ xs: 12, sm: 4 }}>
            <Card
              sx={{
                "&:hover": {
                  borderColor: card.color,
                  boxShadow: `0 4px 16px ${alpha(card.color, 0.15)}`,
                },
                transition: "all 0.2s",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {t(card.key)}
                    </Typography>
                    <Typography variant="h5" fontWeight={700} sx={{ color: card.color }}>
                      {isLoading ? "—" : formatMoney(card.value, currency)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t("thisMonth")}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 3,
                      bgcolor: alpha(card.color, 0.08),
                      color: card.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {card.icon}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ── Chart ── */}
      <Card sx={{ mb: 4 }} data-tour="chart">
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            {t("monthlyChart")}
          </Typography>
          <Box sx={{ width: "100%", height: { xs: 240, sm: 300 } }}>
            {isLoading ? (
              <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                <CircularProgress />
              </Stack>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashData?.monthly_trend ?? []}>
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1AA251" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#1AA251" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EB0014" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#EB0014" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #e0e0e0",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    name={t("income")}
                    stroke="#1AA251"
                    strokeWidth={2.5}
                    fill="url(#incomeGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    name={t("expense")}
                    stroke="#EB0014"
                    strokeWidth={2.5}
                    fill="url(#expenseGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* ── Transaction History with Load More ── */}
      <Card data-tour="history-table">
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            {t("recentTransactions")}
          </Typography>

          {!initialized ? (
            <Stack alignItems="center" py={6}>
              <CircularProgress />
            </Stack>
          ) : transactions.length === 0 ? (
            <Stack alignItems="center" py={6}>
              <Typography variant="body2" color="text.secondary">
                {t("noTransactions")}
              </Typography>
            </Stack>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t("type")}</TableCell>
                      <TableCell>{t("category")}</TableCell>
                      <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                        {t("description")}
                      </TableCell>
                      <TableCell align="right">{t("amount")}</TableCell>
                      <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                        {t("date")}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.map((tx) => (
                      <TableRow key={`${tx.type}-${tx.id}`} hover>
                        <TableCell>
                          <Chip
                            label={t(tx.type)}
                            size="small"
                            sx={{
                              bgcolor:
                                tx.type === "income"
                                  ? alpha("#1AA251", 0.1)
                                  : alpha("#EB0014", 0.1),
                              color: tx.type === "income" ? "#1AA251" : "#EB0014",
                              fontWeight: 600,
                              fontSize: "0.75rem",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: 1.5,
                                bgcolor: alpha(tx.color, 0.1),
                                color: tx.color,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 16,
                              }}
                            >
                              <span className="material-icons" style={{ fontSize: 18 }}>
                                {tx.icon}
                              </span>
                            </Box>
                            <Typography variant="body2" fontWeight={500}>
                              {tx.category}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              maxWidth: 200,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {tx.description ?? "—"}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{ color: tx.type === "income" ? "#1AA251" : "#EB0014" }}
                          >
                            {tx.type === "income" ? "+" : "-"}
                            {formatMoney(tx.amount, tx.currency)}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(tx.date).toLocaleDateString("fr-MA")}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Load More Button */}
              {hasMore && (
                <Stack alignItems="center" sx={{ mt: 3 }}>
                  <Button
                    variant="outlined"
                    onClick={loadMore}
                    disabled={loadingMore}
                    startIcon={loadingMore ? <CircularProgress size={18} /> : undefined}
                    sx={{ px: 5, borderRadius: 3 }}
                  >
                    {loadingMore ? t("common:actions.loading") : t("loadMore")}
                  </Button>
                </Stack>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* ── Add Income/Expense Dialog ── */}
      <Dialog
        open={!!dialogOpen}
        onClose={() => setDialogOpen(null)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 4 } } }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ pb: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight={700}>
                {dialogOpen === "income" ? t("addIncomeTitle") : t("addExpenseTitle")}
              </Typography>
              <IconButton onClick={() => setDialogOpen(null)} size="small">
                <CloseIcon />
              </IconButton>
            </Stack>
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <TextField
                name="category_id"
                select
                label={t("selectCategory")}
                required
                fullWidth
              >
                {(categories ?? []).map((cat: Category) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: 1,
                          bgcolor: alpha(cat.color ?? "#607D8B", 0.12),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          className="material-icons"
                          style={{ fontSize: 16, color: cat.color ?? "#607D8B" }}
                        >
                          {cat.icon}
                        </span>
                      </Box>
                      <span>{cat.name}</span>
                    </Stack>
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                name="amount"
                label={t("amount")}
                type="number"
                required
                fullWidth
                inputProps={{ min: 0.01, step: 0.01 }}
              />

              {dialogOpen === "income" && (
                <TextField name="source" label={t("source")} fullWidth />
              )}

              <TextField name="description" label={t("description")} fullWidth multiline rows={2} />

              <TextField
                name="date"
                label={t("date")}
                type="date"
                required
                fullWidth
                defaultValue={new Date().toISOString().split("T")[0]}
                slotProps={{ inputLabel: { shrink: true } }}
              />

              {dialogOpen === "expense" && (
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CameraAltIcon />}
                  sx={{ borderStyle: "dashed" }}
                >
                  {t("addReceipt")}
                  <input
                    type="file"
                    name="receipts"
                    accept="image/*,.pdf"
                    multiple
                    hidden
                  />
                </Button>
              )}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setDialogOpen(null)} color="inherit">
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={formLoading}
              startIcon={formLoading ? <CircularProgress size={18} /> : undefined}
              sx={{
                background: (theme) => theme.palette.gradients.primaryButton,
                px: 4,
              }}
            >
              {t("save")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
