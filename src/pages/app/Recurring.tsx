import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  alpha,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import RepeatIcon from "@mui/icons-material/Repeat";

import { recurringApi } from "../../api/recurring";
import type { RecurringTransaction, RecurringFormData } from "../../api/recurring";
import { categoriesApi } from "../../api/categories";
import type { Category } from "../../types/transaction";

function formatMoney(amount: number, currency: string): string {
  return (
    new Intl.NumberFormat("fr-MA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount) +
    " " +
    currency
  );
}

export default function Recurring() {
  const { t } = useTranslation("recurring");
  const queryClient = useQueryClient();

  // ── List ──
  const { data: items, isLoading } = useQuery({
    queryKey: ["recurring-transactions"],
    queryFn: async () => {
      const res = await recurringApi.list();
      return res.data.data;
    },
  });

  // ── Dialog state ──
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<RecurringTransaction | null>(null);
  const [formType, setFormType] = useState<"income" | "expense">("expense");

  // ── Categories for form ──
  const { data: categories } = useQuery({
    queryKey: ["categories", formType],
    queryFn: async () => {
      const res = await categoriesApi.list(formType);
      return res.data.data;
    },
    enabled: dialogOpen,
  });

  // ── Mutations ──
  const saveMutation = useMutation({
    mutationFn: (data: RecurringFormData) =>
      editing ? recurringApi.update(editing.id, data) : recurringApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-transactions"] });
      closeDialog();
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: number) => recurringApi.deactivate(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["recurring-transactions"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => recurringApi.forceDelete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["recurring-transactions"] }),
  });

  function openNew() {
    setEditing(null);
    setFormType("expense");
    setDialogOpen(true);
  }

  function openEdit(item: RecurringTransaction) {
    setEditing(item);
    setFormType(item.type);
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditing(null);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: RecurringFormData = {
      type: formType,
      category_id: Number(fd.get("category_id")),
      amount: Number(fd.get("amount")),
      source: (fd.get("source") as string) || undefined,
      description: (fd.get("description") as string) || undefined,
      frequency: fd.get("frequency") as string,
      start_date: fd.get("start_date") as string,
      end_date: (fd.get("end_date") as string) || undefined,
    };
    saveMutation.mutate(data);
  }

  const frequencyLabel = (f: string) =>
    t(f as "daily" | "weekly" | "monthly" | "yearly", f);

  const activeItems = items?.filter((i) => i.is_active) ?? [];
  const inactiveItems = items?.filter((i) => !i.is_active) ?? [];

  return (
    <>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            {t("title")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {t("subtitle")}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openNew}
          sx={{
            bgcolor: "#171717",
            "&:hover": { bgcolor: "#333" },
            alignSelf: { xs: "flex-start", sm: "center" },
          }}
        >
          {t("addNew")}
        </Button>
      </Stack>

      {/* List */}
      {isLoading ? (
        <Stack alignItems="center" py={8}>
          <CircularProgress />
        </Stack>
      ) : activeItems.length === 0 && inactiveItems.length === 0 ? (
        <Card>
          <CardContent>
            <Stack alignItems="center" spacing={2} py={6}>
              <RepeatIcon sx={{ fontSize: 48, color: "text.secondary", opacity: 0.4 }} />
              <Typography variant="body1" color="text.secondary">
                {t("noOperations")}
              </Typography>
              <Button variant="outlined" startIcon={<AddIcon />} onClick={openNew}>
                {t("addNew")}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {activeItems.map((item) => (
            <Grid key={item.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <RecurringCard
                item={item}
                t={t}
                frequencyLabel={frequencyLabel}
                onEdit={() => openEdit(item)}
                onDeactivate={() => deactivateMutation.mutate(item.id)}
                onDelete={() => deleteMutation.mutate(item.id)}
              />
            </Grid>
          ))}
          {inactiveItems.map((item) => (
            <Grid key={item.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <RecurringCard
                item={item}
                t={t}
                frequencyLabel={frequencyLabel}
                onEdit={() => openEdit(item)}
                onDeactivate={() => {}}
                onDelete={() => deleteMutation.mutate(item.id)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* ── Add/Edit Dialog ── */}
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ pb: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight={700}>
                {editing ? t("editTitle") : t("addNew")}
              </Typography>
              <IconButton onClick={closeDialog} size="small">
                <CloseIcon />
              </IconButton>
            </Stack>
          </DialogTitle>

          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              {/* Type toggle */}
              <ToggleButtonGroup
                value={formType}
                exclusive
                onChange={(_, v) => v && setFormType(v)}
                fullWidth
                size="small"
              >
                <ToggleButton
                  value="income"
                  sx={{
                    "&.Mui-selected": {
                      bgcolor: alpha("#1AA251", 0.1),
                      color: "#1AA251",
                      borderColor: "#1AA251",
                    },
                  }}
                >
                  <TrendingUpIcon sx={{ mr: 1, fontSize: 18 }} />
                  {t("income")}
                </ToggleButton>
                <ToggleButton
                  value="expense"
                  sx={{
                    "&.Mui-selected": {
                      bgcolor: alpha("#EB0014", 0.1),
                      color: "#EB0014",
                      borderColor: "#EB0014",
                    },
                  }}
                >
                  <TrendingDownIcon sx={{ mr: 1, fontSize: 18 }} />
                  {t("expense")}
                </ToggleButton>
              </ToggleButtonGroup>

              {/* Category */}
              <TextField
                name="category_id"
                select
                label={t("selectCategory")}
                required
                fullWidth
                defaultValue={editing?.category.id ?? ""}
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

              {/* Amount */}
              <TextField
                name="amount"
                label={t("amount")}
                type="number"
                required
                fullWidth
                defaultValue={editing?.amount ?? ""}
                inputProps={{ min: 0.01, step: 0.01 }}
              />

              {/* Source (income only) */}
              {formType === "income" && (
                <TextField
                  name="source"
                  label={t("source")}
                  fullWidth
                  defaultValue={editing?.source ?? ""}
                />
              )}

              {/* Description */}
              <TextField
                name="description"
                label={t("description")}
                fullWidth
                defaultValue={editing?.description ?? ""}
              />

              {/* Frequency */}
              <TextField
                name="frequency"
                select
                label={t("frequency")}
                required
                fullWidth
                defaultValue={editing?.frequency ?? "monthly"}
              >
                <MenuItem value="daily">{t("daily")}</MenuItem>
                <MenuItem value="weekly">{t("weekly")}</MenuItem>
                <MenuItem value="monthly">{t("monthly")}</MenuItem>
                <MenuItem value="yearly">{t("yearly")}</MenuItem>
              </TextField>

              {/* Dates */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    name="start_date"
                    label={t("startDate")}
                    type="date"
                    required
                    fullWidth
                    defaultValue={
                      editing?.start_date ?? new Date().toISOString().split("T")[0]
                    }
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    name="end_date"
                    label={t("endDate")}
                    type="date"
                    fullWidth
                    defaultValue={editing?.end_date ?? ""}
                    slotProps={{ inputLabel: { shrink: true } }}
                    helperText={t("endDateHint")}
                  />
                </Grid>
              </Grid>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={closeDialog} color="inherit">
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={saveMutation.isPending}
              startIcon={
                saveMutation.isPending ? <CircularProgress size={18} /> : undefined
              }
              sx={{ bgcolor: "#171717", "&:hover": { bgcolor: "#333" }, px: 4 }}
            >
              {t("save")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

// ── Card Component ──

interface RecurringCardProps {
  item: RecurringTransaction;
  t: (key: string) => string;
  frequencyLabel: (f: string) => string;
  onEdit: () => void;
  onDeactivate: () => void;
  onDelete: () => void;
}

function RecurringCard({
  item,
  t,
  frequencyLabel,
  onEdit,
  onDeactivate,
  onDelete,
}: RecurringCardProps) {
  const isIncome = item.type === "income";
  const color = isIncome ? "#1AA251" : "#EB0014";

  return (
    <Card
      sx={{
        height: "100%",
        opacity: item.is_active ? 1 : 0.55,
        border: "1px solid #EDEDED",
        "&:hover": {
          borderColor: item.is_active ? color : "#EDEDED",
          boxShadow: item.is_active
            ? `0 2px 12px ${alpha(color, 0.1)}`
            : "none",
        },
        transition: "all 0.2s",
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        {/* Top row: type chip + actions */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              label={isIncome ? t("income") : t("expense")}
              size="small"
              sx={{
                bgcolor: alpha(color, 0.1),
                color,
                fontWeight: 600,
                fontSize: "0.7rem",
              }}
            />
            <Chip
              label={frequencyLabel(item.frequency)}
              size="small"
              variant="outlined"
              sx={{ fontSize: "0.7rem" }}
            />
            {!item.is_active && (
              <Chip
                label={t("inactive")}
                size="small"
                sx={{ bgcolor: "#f5f5f5", fontSize: "0.7rem" }}
              />
            )}
          </Stack>
          <Stack direction="row" spacing={0}>
            {item.is_active && (
              <>
                <Tooltip title={t("editTitle")}>
                  <IconButton size="small" onClick={onEdit}>
                    <EditOutlinedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t("deactivate")}>
                  <IconButton size="small" onClick={onDeactivate}>
                    <PauseCircleOutlineIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              </>
            )}
            <Tooltip title={t("delete")}>
              <IconButton size="small" onClick={onDelete} sx={{ color: "error.main" }}>
                <DeleteOutlineIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        {/* Category + icon */}
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: alpha(item.category.color ?? "#607D8B", 0.1),
              color: item.category.color ?? "#607D8B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span className="material-icons" style={{ fontSize: 20 }}>
              {item.category.icon}
            </span>
          </Box>
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              {item.category.name}
            </Typography>
            {item.source && (
              <Typography variant="caption" color="text.secondary">
                {item.source}
              </Typography>
            )}
          </Box>
        </Stack>

        {/* Amount */}
        <Typography variant="h5" fontWeight={700} sx={{ color, mb: 1.5 }}>
          {isIncome ? "+" : "-"}
          {formatMoney(Number(item.amount), item.currency)}
        </Typography>

        {/* Details */}
        <Stack spacing={0.5}>
          {item.description && (
            <Typography variant="caption" color="text.secondary">
              {item.description}
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary">
            {t("nextDue")}: {new Date(item.next_due_date).toLocaleDateString("fr-MA")}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
