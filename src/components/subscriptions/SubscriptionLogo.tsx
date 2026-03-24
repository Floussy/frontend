import { useState } from "react";
import { Box, alpha } from "@mui/material";
import { findTemplate, getLogoUrl } from "../../data/subscriptionTemplates";

interface SubscriptionLogoProps {
  name: string;
  size?: number;
}

export default function SubscriptionLogo({ name, size = 36 }: SubscriptionLogoProps) {
  const [imgError, setImgError] = useState(false);
  const tpl = findTemplate(name);
  const logoUrl = tpl ? getLogoUrl(tpl.domain, size * 2) : null;

  // If we have a logo URL and it hasn't errored, show the real logo
  if (logoUrl && !imgError) {
    return (
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: 2,
          bgcolor: alpha(tpl!.color, 0.08),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          flexShrink: 0,
          border: 1,
          borderColor: alpha(tpl!.color, 0.15),
        }}
      >
        <img
          src={logoUrl}
          alt={name}
          width={size * 0.7}
          height={size * 0.7}
          style={{ objectFit: "contain" }}
          onError={() => setImgError(true)}
          loading="lazy"
        />
      </Box>
    );
  }

  // Fallback to emoji
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: 2,
        bgcolor: tpl ? alpha(tpl.color, 0.1) : "action.hover",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.5,
        flexShrink: 0,
      }}
    >
      {tpl?.icon ?? "📦"}
    </Box>
  );
}
