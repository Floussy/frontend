import { useTranslation } from "react-i18next";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  alpha,
  Chip,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import HandshakeIcon from "@mui/icons-material/Handshake";
import PublicIcon from "@mui/icons-material/Public";

const values = [
  { key: "simplicity", icon: EmojiObjectsIcon, color: "#0072E5" },
  { key: "transparency", icon: HandshakeIcon, color: "#9c27b0" },
  { key: "accessibility", icon: PublicIcon, color: "#1AA251" },
  { key: "community", icon: GroupsIcon, color: "#DEA500" },
] as const;

export default function About() {
  const { t } = useTranslation("home");

  return (
    <>
      {/* Hero */}
      <Box
        sx={{
          background: (theme) => theme.palette.gradients.hero,
          pt: { xs: 8, sm: 12 },
          pb: { xs: 10, sm: 14 },
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
            label={t("about.badge")}
            color="primary"
            variant="outlined"
            size="small"
            sx={{ mb: 3, fontWeight: 600, borderRadius: 3, px: 1 }}
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
            {t("about.title")}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{
              maxWidth: 580,
              mx: "auto",
              fontSize: { xs: "1.05rem", sm: "1.2rem" },
              lineHeight: 1.7,
            }}
          >
            {t("about.description")}
          </Typography>
        </Container>
      </Box>

      {/* Mission Section */}
      <Box sx={{ py: { xs: 8, sm: 12 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h2" sx={{ mb: 3 }}>
                {t("about.mission.title")}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9, mb: 2 }}>
                {t("about.mission.p1")}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9 }}>
                {t("about.mission.p2")}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  background:
                    "linear-gradient(135deg, #CEE5FD 0%, #E8DEF8 100%)",
                  p: { xs: 4, sm: 6 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 320,
                }}
              >
                <Stack spacing={2} alignItems="center">
                  <Typography
                    variant="h1"
                    sx={{
                      fontWeight: 900,
                      background: (theme) => theme.palette.gradients.heroText,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontSize: { xs: "3rem", sm: "4rem" },
                    }}
                  >
                    Floussy
                  </Typography>
                  <Typography variant="body1" color="text.secondary" fontWeight={500}>
                    {t("about.mission.tagline")}
                  </Typography>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Values */}
      <Box sx={{ py: { xs: 8, sm: 12 }, bgcolor: "grey.50" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: { xs: 6, sm: 8 } }}>
            <Typography variant="h2" sx={{ mb: 2 }}>
              {t("about.values.title")}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 520, mx: "auto", fontSize: "1.1rem" }}
            >
              {t("about.values.subtitle")}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <Grid key={v.key} size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card
                    sx={{
                      height: "100%",
                      textAlign: "center",
                      "&:hover": {
                        borderColor: v.color,
                        boxShadow: `0 4px 20px ${alpha(v.color, 0.15)}`,
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: "50%",
                          bgcolor: alpha(v.color, 0.08),
                          color: v.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mx: "auto",
                          mb: 2.5,
                        }}
                      >
                        <Icon fontSize="large" />
                      </Box>
                      <Typography variant="h6" gutterBottom fontWeight={700}>
                        {t(`about.values.${v.key}.title`)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
                        {t(`about.values.${v.key}.description`)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* Team Teaser */}
      <Box sx={{ py: { xs: 8, sm: 12 } }}>
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography variant="h2" sx={{ mb: 3 }}>
            {t("about.team.title")}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 560, mx: "auto", lineHeight: 1.8 }}
          >
            {t("about.team.description")}
          </Typography>
        </Container>
      </Box>
    </>
  );
}
