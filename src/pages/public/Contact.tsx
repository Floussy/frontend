import { useTranslation } from "react-i18next";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  Chip,
  alpha,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SendIcon from "@mui/icons-material/Send";

const contactCards = [
  { key: "email", icon: EmailIcon, color: "#0072E5", value: "contact@floussy.app" },
  { key: "phone", icon: PhoneIcon, color: "#9c27b0", value: "+212 5XX-XXXXXX" },
  { key: "address", icon: LocationOnIcon, color: "#1AA251", value: "Casablanca, Maroc" },
  { key: "hours", icon: AccessTimeIcon, color: "#DEA500", value: "Lun–Ven, 9h–18h" },
] as const;

export default function Contact() {
  const { t } = useTranslation("home");

  return (
    <>
      {/* Hero */}
      <Box
        sx={{
          background: (theme) => theme.palette.gradients.hero,
          pt: { xs: 8, sm: 10 },
          pb: { xs: 10, sm: 12 },
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,127,255,0.1), transparent)",
          },
        }}
      >
        <Container maxWidth="md" sx={{ position: "relative", textAlign: "center" }}>
          <Chip
            label={t("contact.badge")}
            color="primary"
            variant="outlined"
            size="small"
            sx={{ mb: 3, fontWeight: 600, borderRadius: 3, px: 1 }}
          />
          <Typography
            variant="h1"
            sx={{
              mb: 2,
              background: (theme) => theme.palette.gradients.heroText,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t("contact.title")}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ maxWidth: 480, mx: "auto", fontSize: { xs: "1.05rem", sm: "1.15rem" } }}
          >
            {t("contact.subtitle")}
          </Typography>
        </Container>
      </Box>

      {/* Contact Info Cards */}
      <Container maxWidth="lg" sx={{ mt: -6, position: "relative", zIndex: 1, mb: 6 }}>
        <Grid container spacing={2.5}>
          {contactCards.map((card) => {
            const Icon = card.icon;
            return (
              <Grid key={card.key} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card
                  sx={{
                    textAlign: "center",
                    "&:hover": {
                      borderColor: card.color,
                      boxShadow: `0 4px 16px ${alpha(card.color, 0.12)}`,
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  <CardContent sx={{ py: 3.5, px: 2.5 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        bgcolor: alpha(card.color, 0.08),
                        color: card.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 2,
                      }}
                    >
                      <Icon />
                    </Box>
                    <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                      {t(`contact.${card.key}`)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      {/* Contact Form */}
      <Container maxWidth="lg" sx={{ pb: { xs: 8, sm: 12 } }}>
        <Grid container spacing={5}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography variant="h3" sx={{ mb: 2 }}>
              {t("contact.form.heading")}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 3 }}>
              {t("contact.form.description")}
            </Typography>
            <Box
              sx={{
                borderRadius: 3,
                background: "linear-gradient(135deg, #CEE5FD 0%, #E8DEF8 100%)",
                p: 4,
              }}
            >
              <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                {t("contact.faq.title")}
              </Typography>
              <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
                {t("contact.faq.description")}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Card sx={{ borderRadius: 4 }}>
              <CardContent sx={{ p: { xs: 3, sm: 4.5 } }}>
                <Stack
                  component="form"
                  spacing={3}
                  onSubmit={(e: React.FormEvent) => e.preventDefault()}
                >
                  <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        label={t("contact.form.name")}
                        fullWidth
                        size="medium"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        label={t("contact.form.email")}
                        type="email"
                        fullWidth
                        size="medium"
                      />
                    </Grid>
                  </Grid>
                  <TextField
                    label={t("contact.form.subject")}
                    fullWidth
                    size="medium"
                  />
                  <TextField
                    label={t("contact.form.message")}
                    multiline
                    rows={5}
                    fullWidth
                    size="medium"
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    endIcon={<SendIcon />}
                    sx={{
                      alignSelf: { sm: "flex-start" },
                      px: 5,
                      background: (theme) => theme.palette.gradients.primaryButton,
                      "&:hover": {
                        background: (theme) => theme.palette.gradients.primaryButton,
                        opacity: 0.9,
                      },
                    }}
                  >
                    {t("contact.form.send")}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
