import type { TooltipRenderProps } from "react-joyride";
import {
  Box, Typography, Button, Stack, LinearProgress, IconButton, alpha,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckIcon from "@mui/icons-material/Check";

export default function OnboardingTooltip({
  backProps,
  closeProps,
  primaryProps,
  skipProps,
  step,
  index,
  size,
  isLastStep,
}: TooltipRenderProps) {
  const progress = ((index + 1) / size) * 100;
  const isCenter = step.placement === "center";

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderRadius: 3,
        boxShadow: (theme) =>
          theme.palette.mode === "dark"
            ? `0 8px 32px ${alpha("#000", 0.5)}`
            : `0 8px 32px ${alpha("#000", 0.12)}`,
        border: 1,
        borderColor: "divider",
        maxWidth: { xs: 320, sm: 400 },
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* Progress bar */}
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 3,
          bgcolor: "action.hover",
          "& .MuiLinearProgress-bar": {
            bgcolor: "primary.main",
          },
        }}
      />

      <Box sx={{ p: { xs: 2.5, sm: 3 } }}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
          <Box sx={{ flex: 1 }}>
            {step.title && (
              <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: 16, sm: 18 }, lineHeight: 1.3 }}>
                {step.title as string}
              </Typography>
            )}
          </Box>
          {!isCenter && (
            <IconButton {...closeProps} size="small" sx={{ ml: 1, mt: -0.5, color: "text.secondary" }}>
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          )}
        </Stack>

        {/* Content */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ lineHeight: 1.7, fontSize: { xs: 13, sm: 14 }, mb: 2.5 }}
        >
          {step.content as string}
        </Typography>

        {/* Step counter */}
        <Typography variant="caption" color="text.disabled" sx={{ display: "block", mb: 2 }}>
          {index + 1} / {size}
        </Typography>

        {/* Actions */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          {index === 0 ? (
            <Button
              {...skipProps}
              size="small"
              sx={{ color: "text.secondary", fontSize: 13, textTransform: "none" }}
            >
              {skipProps.title}
            </Button>
          ) : (
            <Button
              {...backProps}
              size="small"
              startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
              sx={{ color: "text.secondary", fontSize: 13, textTransform: "none" }}
            >
              {backProps.title}
            </Button>
          )}

          <Button
            {...primaryProps}
            variant="contained"
            size="small"
            endIcon={isLastStep ? <CheckIcon sx={{ fontSize: 16 }} /> : <ArrowForwardIcon sx={{ fontSize: 16 }} />}
            sx={{
              px: 2.5,
              py: 0.8,
              fontSize: 13,
              fontWeight: 600,
              borderRadius: 2,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": { boxShadow: "none" },
            }}
          >
            {primaryProps.title}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
