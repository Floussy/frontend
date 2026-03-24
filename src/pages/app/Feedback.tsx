import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
  Typography, Card, CardContent, Stack, TextField, Button,
  Alert, Rating, Box, Chip, Divider, alpha, Grid,
} from "@mui/material";
import BugReportOutlinedIcon from "@mui/icons-material/BugReportOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SendIcon from "@mui/icons-material/Send";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { feedbacksApi } from "../../api/feedbacks";

const feedbackTypes = [
  { value: "bug", label: "Bug Report", icon: <BugReportOutlinedIcon />, color: "#EF4444" },
  { value: "feature", label: "Feature Request", icon: <LightbulbOutlinedIcon />, color: "#3B82F6" },
  { value: "improvement", label: "Improvement", icon: <TrendingUpOutlinedIcon />, color: "#F59E0B" },
  { value: "other", label: "Other", icon: <ChatBubbleOutlineIcon />, color: "#6B7280" },
] as const;

export default function Feedback() {
  const { t } = useTranslation("common");
  const [type, setType] = useState("other");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const { data: feedbacksData, refetch } = useQuery({
    queryKey: ["feedbacks"],
    queryFn: async () => {
      const res = await feedbacksApi.list();
      const d = res.data.data;
      return Array.isArray(d) ? d : d?.data ?? [];
    },
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError("");
    setSuccess(false);

    const fd = new FormData();
    fd.append("type", type);
    fd.append("subject", subject);
    fd.append("message", message);
    if (rating) fd.append("rating", String(rating));
    fd.append("page", window.location.pathname);
    if (screenshot) fd.append("screenshot", screenshot);

    try {
      await feedbacksApi.create(fd);
      setSuccess(true);
      setSubject("");
      setMessage("");
      setRating(null);
      setType("other");
      setScreenshot(null);
      refetch();
    } catch {
      setError(t("messages.error"));
    } finally {
      setSending(false);
    }
  }

  const selectedType = feedbackTypes.find((ft) => ft.value === type);
  const feedbacks = feedbacksData?.data ?? feedbacksData ?? [];

  return (
    <>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
        Feedback
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Help us improve Floussy! Your feedback goes directly to our team.
      </Typography>

      <Grid container spacing={3}>
        {/* ── Submit Form ── */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ border: 1, borderColor: "divider" }}>
            <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
              {success && (
                <Alert
                  severity="success"
                  icon={<CheckCircleOutlineIcon />}
                  sx={{ mb: 3, borderRadius: 2 }}
                >
                  Thank you! Your feedback has been sent to our team.
                </Alert>
              )}
              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  {/* Type selector */}
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                      What type of feedback?
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {feedbackTypes.map((ft) => (
                        <Chip
                          key={ft.value}
                          icon={ft.icon}
                          label={ft.label}
                          onClick={() => setType(ft.value)}
                          variant={type === ft.value ? "filled" : "outlined"}
                          sx={{
                            borderColor: type === ft.value ? ft.color : "#EDEDED",
                            bgcolor: type === ft.value ? alpha(ft.color, 0.1) : "transparent",
                            color: type === ft.value ? ft.color : "text.secondary",
                            fontWeight: type === ft.value ? 600 : 400,
                            "& .MuiChip-icon": {
                              color: type === ft.value ? ft.color : "text.secondary",
                            },
                            "&:hover": {
                              bgcolor: alpha(ft.color, 0.08),
                            },
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>

                  {/* Subject */}
                  <TextField
                    label="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    fullWidth
                    placeholder={
                      type === "bug"
                        ? "Describe the issue briefly..."
                        : type === "feature"
                          ? "What feature would you like?"
                          : "What's on your mind?"
                    }
                  />

                  {/* Message */}
                  <TextField
                    label="Details"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    fullWidth
                    multiline
                    rows={4}
                    placeholder={
                      type === "bug"
                        ? "Steps to reproduce the issue, what you expected, what happened instead..."
                        : "Tell us more..."
                    }
                  />

                  {/* Rating */}
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5 }}>
                      How would you rate Floussy overall?
                    </Typography>
                    <Rating
                      value={rating}
                      onChange={(_, v) => setRating(v)}
                      size="large"
                      sx={{ mt: 0.5 }}
                    />
                  </Box>

                  {/* Screenshot */}
                  <Box>
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<PhotoCameraIcon />}
                      size="small"
                      sx={{
                        borderColor: "divider",
                        color: "text.secondary",
                        "&:hover": { borderColor: "text.disabled" },
                      }}
                    >
                      {screenshot ? screenshot.name : "Attach screenshot (optional)"}
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => setScreenshot(e.target.files?.[0] ?? null)}
                      />
                    </Button>
                  </Box>

                  {/* Submit */}
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={sending || !subject || !message}
                    startIcon={<SendIcon />}
                    sx={{
                      bgcolor: selectedType?.color ?? "#171717",
                      "&:hover": { bgcolor: alpha(selectedType?.color ?? "#171717", 0.85) },
                      alignSelf: "flex-start",
                      px: 4,
                      py: 1.2,
                    }}
                  >
                    {sending ? t("actions.loading") : "Send Feedback"}
                  </Button>
                </Stack>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Past Feedback ── */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ border: 1, borderColor: "divider" }}>
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                Your Feedback History
              </Typography>

              {feedbacks.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
                  No feedback sent yet. We'd love to hear from you!
                </Typography>
              ) : (
                <Stack spacing={2} divider={<Divider />}>
                  {feedbacks.map((fb: { id: number; type: string; subject: string; message: string; status: string; created_at: string; rating: number | null }) => {
                    const fbType = feedbackTypes.find((ft) => ft.value === fb.type);
                    return (
                      <Box key={fb.id}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                          <Chip
                            label={fbType?.label ?? fb.type}
                            size="small"
                            sx={{
                              bgcolor: alpha(fbType?.color ?? "#6B7280", 0.1),
                              color: fbType?.color ?? "#6B7280",
                              fontWeight: 600,
                              fontSize: 11,
                            }}
                          />
                          <Chip
                            label={fb.status}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: 11, textTransform: "capitalize" }}
                          />
                        </Stack>
                        <Typography variant="body2" fontWeight={600}>
                          {fb.subject}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(fb.created_at).toLocaleDateString("fr-MA", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                          {fb.rating && ` • ${"⭐".repeat(fb.rating)}`}
                        </Typography>
                      </Box>
                    );
                  })}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
