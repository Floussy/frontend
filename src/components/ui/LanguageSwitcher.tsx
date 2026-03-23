import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { IconButton, Menu, MenuItem, ListItemText, Tooltip } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import CheckIcon from "@mui/icons-material/Check";
import { isRTL } from "../../i18n";

const languages = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
] as const;

interface LanguageSwitcherProps {
  color?: "inherit" | "default" | "primary";
}

export default function LanguageSwitcher({ color = "default" }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    document.documentElement.dir = isRTL(i18n.language) ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  function handleOpen(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function changeLanguage(lang: string) {
    i18n.changeLanguage(lang);
    handleClose();
  }

  return (
    <>
      <Tooltip title="Language">
        <IconButton onClick={handleOpen} color={color} size="small">
          <LanguageIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        slotProps={{ paper: { sx: { minWidth: 160 } } }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            selected={i18n.language === lang.code}
            onClick={() => changeLanguage(lang.code)}
          >
            <ListItemText>{lang.label}</ListItemText>
            {i18n.language === lang.code && (
              <CheckIcon fontSize="small" color="primary" sx={{ ml: 1 }} />
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
