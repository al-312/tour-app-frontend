"use client";

import * as React from "react";

import { isClient } from "@/lib/utils/is-client";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

const getInitialTheme = (): Theme => {
  if (!isClient()) return "dark";
  const saved = localStorage.getItem("theme");
  if (saved === "light") return "light";
  if (saved === "dark") return "dark";
  return "dark";
};

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [theme, setTheme] = React.useState<Theme>(getInitialTheme);

  React.useEffect(() => {
    if (!isClient()) return;
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = React.useCallback((): void => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const value = React.useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextType {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
