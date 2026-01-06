"use client";
import { createContext, useContext, useState } from "react";
const AppContext = createContext(null);
export function AppProvider({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleMobile = () => setMobileOpen((prev) => !prev);
  return (
    <AppContext.Provider value={{ mobileOpen, toggleMobile }}>
      {children}
    </AppContext.Provider>
  );
}
export function useApp() {
  return useContext(AppContext);
}
