import { Link as RouterLink } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Box,
  Container,
  Typography,
  Link,
  Stack,
  Divider,
  Grid,
  IconButton,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import logoSvg from "../../assets/logo.svg";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";

export default function PublicFooter() {
  const { t } = useTranslation("common");
  const year = new Date().getFullYear();

  const footerSections = [
    {
      title: t("footer.product"),
      links: [
        { label: t("footer.features"), to: "/#features" },
        { label: t("footer.pricing"), to: "/#pricing" },
        { label: t("footer.security"), to: "/#security" },
      ],
    },
    {
      title: t("footer.company"),
      links: [
        { label: t("nav.about"), to: "/about" },
        { label: t("nav.contact"), to: "/contact" },
        { label: t("footer.careers"), to: "/careers" },
      ],
    },
    {
      title: t("footer.legal"),
      links: [
        { label: t("footer.privacy"), to: "/privacy" },
        { label: t("footer.terms"), to: "/terms" },
        { label: t("footer.cookies"), to: "/cookies" },
      ],
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        bgcolor: "grey.50",
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg" sx={{ pt: { xs: 6, sm: 8 }, pb: { xs: 4, sm: 5 } }}>
        <Grid container spacing={4}>
          {/* Brand column */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={2}>
              <Box
                component="img"
                src={logoSvg}
                alt={t("appName")}
                sx={{ height: 30 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 280 }}>
                {t("tagline")}
              </Typography>
              <Stack direction="row" spacing={0.5}>
                <IconButton size="small" sx={{ color: "text.secondary" }}>
                  <GitHubIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" sx={{ color: "text.secondary" }}>
                  <LinkedInIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" sx={{ color: "text.secondary" }}>
                  <XIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>
          </Grid>

          {/* Link columns */}
          {footerSections.map((section) => (
            <Grid key={section.title} size={{ xs: 6, sm: 4, md: 2.66 }}>
              <Typography
                variant="subtitle2"
                fontWeight={700}
                color="text.primary"
                sx={{ mb: 2, textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: 1 }}
              >
                {section.title}
              </Typography>
              <Stack spacing={1.5}>
                {section.links.map((link) => (
                  <Link
                    key={link.label}
                    component={RouterLink}
                    to={link.to}
                    variant="body2"
                    color="text.secondary"
                    underline="none"
                    sx={{
                      "&:hover": { color: "primary.main" },
                      transition: "color 0.15s",
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: { xs: 4, sm: 5 } }} />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
        >
          <Typography variant="caption" color="text.secondary">
            &copy; {year} {t("appName")}. {t("footer.rights")}.
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t("footer.madeWith")}
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
