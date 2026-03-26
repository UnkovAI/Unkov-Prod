import React, { createContext, useContext } from "react";

// Dark mode removed — site is always warm light.
interface ThemeContextType {
  theme: "light";
  toggleTheme: undefined;
  switchable: false;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: undefined,
  switchable: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Ensure no stale "dark" class from previous sessions
  if (typeof document !== "undefined") {
    document.documentElement.classList.remove("dark");
    document.body.classList.remove("dark");
  }
  return (
    <ThemeContext.Provider value={{ theme: "light", toggleTheme: undefined, switchable: false }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
