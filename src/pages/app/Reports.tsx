import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
  Typography, Card, CardContent, Box, Stack, Grid, CircularProgress,
} from "@mui/material";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { dashboardApi } from "../../api/dashboard";

export default function Reports() {
  const { t } = useTranslation("dashboard");
  const { t: tc } = useTranslation("common");

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-reports"],
    queryFn: async () => (await dashboardApi.get()).data.data,
  });

  if (isLoading) return <Stack alignItems="center" py={8}><CircularProgress /></Stack>;

  const trend = data?.monthly_trend ?? [];
  const byCategory = data?.expenses_by_category ?? [];

  return (
    <>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>{tc("nav.reports")}</Typography>

      <Grid container spacing={2.5}>
        {/* Monthly Bar Chart */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ border: 1, borderColor: "divider" }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>{t("monthlyChart")}</Typography>
              <Box sx={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: 1, borderColor: "divider" }} />
                    <Bar dataKey="income" name={t("income")} fill="#1AA251" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" name={t("expense")} fill="#EB0014" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Expenses by Category Pie */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ border: 1, borderColor: "divider" }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Expenses by Category</Typography>
              {byCategory.length === 0 ? (
                <Stack alignItems="center" py={6}><Typography variant="body2" color="text.secondary">{tc("messages.noData")}</Typography></Stack>
              ) : (
                <>
                  <Box sx={{ width: "100%", height: 220 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie data={byCategory} dataKey="total" nameKey="category" cx="50%" cy="50%" outerRadius={80} innerRadius={50}>
                          {byCategory.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: 8 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                  <Stack spacing={1} sx={{ mt: 1 }}>
                    {byCategory.map(c => (
                      <Stack key={c.category} direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: c.color }} />
                          <Typography variant="body2">{c.category}</Typography>
                        </Stack>
                        <Typography variant="body2" fontWeight={600}>{c.total.toFixed(2)}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
