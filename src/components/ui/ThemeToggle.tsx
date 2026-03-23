import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Tooltip } from "@mui/material";
import { useState } from "react";
import LightModeIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeIcon from "@mui/icons-material/DarkModeOutlined";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightnessOutlined";
import CheckIcon from "@mui/icons-material/Check";
import { useAppStore } from "../../store/appStore";

type ThemeMode = "light" | "dark" | "system";

const modes: { value: ThemeMode; icon: React.ReactNode; label: string }[] = [
  { value: "light", icon: <LightModeIcon fontSize="small" />, label: "Light" },
  { value: "dark", icon: <DarkModeIcon fontSize="small" />, label: "Dark" },
  { value: "system", icon: <SettingsBrightnessIcon fontSize="small" />, label: "System" },
];

interface ThemeToggleProps {
  color?: "inherit" | "default" | "primary";
}

export default function ThemeToggle({ color = "default" }: ThemeToggleProps) {
  const { themeMode, setThemeMode } = useAppStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const currentIcon = themeMode === "dark"
    ? <DarkModeIcon />
    : themeMode === "light"
      ? <LightModeIcon />
      : <SettingsBrightnessIcon />;

  return (
    <>
      <Tooltip title="Theme">
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} color={color} size="small">
          {currentIcon}
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        slotProps={{ paper: { sx: { minWidth: 150 } } }}
      >
        {modes.map((m) => (
          <MenuItem
            key={m.value}
            selected={themeMode === m.value}
            onClick={() => { setThemeMode(m.value); setAnchorEl(null); }}
          >
            <ListItemIcon>{m.icon}</ListItemIcon>
            <ListItemText>{m.label}</ListItemText>
            {themeMode === m.value && <CheckIcon fontSize="small" color="primary" sx={{ ml: 1 }} />}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
