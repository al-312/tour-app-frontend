"use client";

import * as React from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

const themeListeners = new Set<() => void>();

const subscribeTheme = (callback: () => void): (() => void) => {
  themeListeners.add(callback);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", callback);
  }
  return () => {
    themeListeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", callback);
    }
  };
};

const getThemeSnapshot = (): Theme => {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem("theme");
  return saved === "dark" ? "dark" : "light";
};

const getThemeServerSnapshot = (): Theme => "light";

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const theme = React.useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getThemeServerSnapshot
  );

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = React.useCallback((): void => {
    if (typeof window !== "undefined") {
      const current = getThemeSnapshot();
      const next: Theme = current === "dark" ? "light" : "dark";
      localStorage.setItem("theme", next);
      themeListeners.forEach((listener) => {
        listener();
      });
    }
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
