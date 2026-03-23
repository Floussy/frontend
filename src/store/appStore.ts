import { create } from "zustand";

type ThemeMode = "light" | "dark" | "system";

interface AppState {
  sidebarOpen: boolean;
  themeMode: ThemeMode;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const savedTheme = (localStorage.getItem("floussy_theme") as ThemeMode) ?? "system";

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: false,
  themeMode: savedTheme,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setThemeMode: (mode) => {
    localStorage.setItem("floussy_theme", mode);
    set({ themeMode: mode });
  },
}));
