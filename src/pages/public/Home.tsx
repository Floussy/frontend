import { Link as RouterLink } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  Avatar,
  alpha,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import FlagIcon from "@mui/icons-material/Flag";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import BarChartIcon from "@mui/icons-material/BarChart";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SecurityIcon from "@mui/icons-material/Security";
import SpeedIcon from "@mui/icons-material/Speed";
import DevicesIcon from "@mui/icons-material/Devices";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const features = [
  { key: "tracking", icon: TrendingUpIcon, color: "#0072E5" },
  { key: "goals", icon: FlagIcon, color: "#9c27b0" },
  { key: "budgets", icon: AccountBalanceWalletIcon, color: "#1AA251" },
  { key: "reports", icon: BarChartIcon, color: "#DEA500" },
  { key: "multicurrency", icon: CurrencyExchangeIcon, color: "#0072E5" },
  { key: "reminders", icon: NotificationsActiveIcon, color: "#EB0014" },
] as const;

const highlights = [
  { key: "secure", icon: SecurityIcon },
  { key: "fast", icon: SpeedIcon },
  { key: "responsive", icon: DevicesIcon },
] as const;

export default function Home() {
  const { t } = useTranslation("home");

  return (
    <>
      {/* ─── Hero Section ─── */}
      <Box
        sx={{
          background: (theme) => theme.palette.gradients.hero,
          pt: { xs: 8, sm: 12, md: 16 },
          pb: { xs: 10, sm: 14, md: 18 },
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,127,255,0.12), transparent)",
          },
        }}
      >
        <Container maxWidth="md" sx={{ position: "relative", textAlign: "center" }}>
          <Chip
            label={t("hero.badge")}
            color="primary"
            variant="outlined"
            size="small"
            sx={{
              mb: 3,
              fontWeight: 600,
              borderRadius: 3,
              px: 1,
            }}
          />

          <Typography
            variant="h1"
            sx={{
              mb: 3,
              background: (theme) => theme.palette.gradients.heroText,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t("hero.title")}
          </Typography>

          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{
              mb: 5,
              maxWidth: 560,
              mx: "auto",
              fontSize: { xs: "1.05rem", sm: "1.2rem" },
              lineHeight: 1.7,
            }}
          >
            {t("hero.subtitle")}
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
            sx={{ mb: 6 }}
          >
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                background: (theme) => theme.palette.gradients.primaryButton,
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                "&:hover": {
                  background: (theme) => theme.palette.gradients.primaryButton,
                  opacity: 0.9,
                  transform: "translateY(-1px)",
                  boxShadow: (theme) => `0 8px 25px ${alpha(theme.palette.primary.main, 0.35)}`,
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              {t("hero.cta")}
            </Button>
            <Button
              href="#features"
              variant="outlined"
              size="large"
              sx={{ px: 4, py: 1.5 }}
            >
              {t("hero.secondaryCta")}
            </Button>
          </Stack>

          {/* Trust indicators */}
          <Stack
            direction="row"
            spacing={{ xs: 3, sm: 5 }}
            justifyContent="center"
            flexWrap="wrap"
            useFlexGap
          >
            {highlights.map((h) => {
              const Icon = h.icon;
              return (
                <Stack key={h.key} direction="row" alignItems="center" spacing={1}>
                  <Icon sx={{ color: "primary.main", fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    {t(`hero.highlights.${h.key}`)}
                  </Typography>
                </Stack>
              );
            })}
          </Stack>
        </Container>
      </Box>

      {/* ─── Stats Section ─── */}
      <Box sx={{ py: { xs: 6, sm: 8 }, bgcolor: "background.default" }}>
        <Container maxWidth="lg">
          <Grid container spacing={3} justifyContent="center">
            {(["users", "transactions", "countries"] as const).map((stat) => (
              <Grid key={stat} size={{ xs: 12, sm: 4 }}>
                <Box sx={{ textAlign: "center", py: 2 }}>
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 800,
                      background: (theme) => theme.palette.gradients.heroText,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      mb: 0.5,
                    }}
                  >
                    {t(`stats.${stat}.value`)}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" fontWeight={500}>
                    {t(`stats.${stat}.label`)}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── Features Section ─── */}
      <Box
        id="features"
        sx={{
          py: { xs: 8, sm: 12 },
          bgcolor: "grey.50",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: { xs: 6, sm: 8 } }}>
            <Chip
              label={t("features.badge")}
              size="small"
              color="primary"
              sx={{ mb: 2, fontWeight: 600 }}
            />
            <Typography variant="h2" sx={{ mb: 2 }}>
              {t("features.title")}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 520, mx: "auto", fontSize: "1.1rem" }}
            >
              {t("features.subtitle")}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Grid key={feature.key} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card
                    sx={{
                      height: "100%",
                      bgcolor: "background.paper",
                      cursor: "default",
                      "&:hover": {
                        borderColor: feature.color,
                        boxShadow: `0 4px 20px ${alpha(feature.color, 0.15)}`,
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                      <Box
                        sx={{
                          width: 52,
                          height: 52,
                          borderRadius: 3,
                          bgcolor: alpha(feature.color, 0.08),
                          color: feature.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 2.5,
                        }}
                      >
                        <Icon fontSize="medium" />
                      </Box>
                      <Typography variant="h6" gutterBottom fontWeight={700}>
                        {t(`features.${feature.key}.title`)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
                        {t(`features.${feature.key}.description`)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* ─── How It Works ─── */}
      <Box sx={{ py: { xs: 8, sm: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: { xs: 6, sm: 8 } }}>
            <Typography variant="h2" sx={{ mb: 2 }}>
              {t("howItWorks.title")}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 480, mx: "auto", fontSize: "1.1rem" }}
            >
              {t("howItWorks.subtitle")}
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {([1, 2, 3] as const).map((step) => (
              <Grid key={step} size={{ xs: 12, md: 4 }}>
                <Stack alignItems="center" textAlign="center" spacing={2.5}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background: (theme) => theme.palette.gradients.primaryButton,
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.5rem",
                      fontWeight: 800,
                    }}
                  >
                    {step}
                  </Box>
                  <Typography variant="h5" fontWeight={700}>
                    {t(`howItWorks.step${step}.title`)}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 320 }}>
                    {t(`howItWorks.step${step}.description`)}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── Testimonials ─── */}
      <Box sx={{ py: { xs: 8, sm: 12 }, bgcolor: "grey.50" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: { xs: 6, sm: 8 } }}>
            <Typography variant="h2" sx={{ mb: 2 }}>
              {t("testimonials.title")}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: "1.1rem" }}>
              {t("testimonials.subtitle")}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {([1, 2, 3] as const).map((i) => (
              <Grid key={i} size={{ xs: 12, md: 4 }}>
                <Card
                  sx={{
                    height: "100%",
                    position: "relative",
                    "&:hover": {
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                    <FormatQuoteIcon
                      sx={{
                        color: "primary.light",
                        fontSize: 36,
                        mb: 2,
                        opacity: 0.6,
                      }}
                    />
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 3, lineHeight: 1.8, fontStyle: "italic" }}
                    >
                      {t(`testimonials.review${i}.text`)}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar
                        sx={{
                          bgcolor: "primary.main",
                          width: 40,
                          height: 40,
                          fontSize: "0.9rem",
                          fontWeight: 700,
                        }}
                      >
                        {t(`testimonials.review${i}.name`).charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={700}>
                          {t(`testimonials.review${i}.name`)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t(`testimonials.review${i}.role`)}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── Final CTA ─── */}
      <Box
        sx={{
          py: { xs: 10, sm: 14 },
          background:
            "linear-gradient(135deg, #0A1929 0%, #0059B2 50%, #9c27b0 100%)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.06), transparent 70%)",
          },
        }}
      >
        <Container maxWidth="md" sx={{ position: "relative", textAlign: "center" }}>
          <Typography
            variant="h2"
            sx={{
              color: "white",
              mb: 2,
              fontWeight: 800,
            }}
          >
            {t("cta.title")}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "rgba(255,255,255,0.7)",
              mb: 5,
              maxWidth: 480,
              mx: "auto",
            }}
          >
            {t("cta.subtitle")}
          </Typography>

          <Stack spacing={2} alignItems="center">
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: "white",
                color: "primary.dark",
                px: 5,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 700,
                "&:hover": {
                  bgcolor: "grey.100",
                  transform: "translateY(-1px)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              {t("cta.button")}
            </Button>

            <Stack direction="row" spacing={3} sx={{ mt: 3 }}>
              {(["noCreditCard", "freeForever", "setupMinutes"] as const).map(
                (key) => (
                  <Stack key={key} direction="row" alignItems="center" spacing={0.5}>
                    <CheckCircleOutlineIcon
                      sx={{ color: "rgba(255,255,255,0.7)", fontSize: 18 }}
                    />
                    <Typography
                      variant="caption"
                      sx={{ color: "rgba(255,255,255,0.7)", fontWeight: 500 }}
                    >
                      {t(`cta.${key}`)}
                    </Typography>
                  </Stack>
                )
              )}
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
}
