"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { apiFetch } from "@/lib/api";

const DashboardDataContext = createContext(null);

export function DashboardDataProvider({ endpoint, children }) {
  const [funds, setFunds] = useState([]);
  const [investors, setInvestors] = useState([]);
  const [sips, setSips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const dashboardRes = await apiFetch(endpoint);
        if (!dashboardRes.ok) {
          const text = await dashboardRes.text();
          let message = "Failed to load dashboard";
          try {
            const data = JSON.parse(text);
            message = data.message || message;
          } catch {
            message = `${message} (HTTP ${dashboardRes.status})`;
          }
          throw new Error(message);
        }

        const dashboardData = await dashboardRes.json();
        if (!active) return;
        setFunds(dashboardData.funds || []);
        setInvestors(dashboardData.investors || []);
        setSips(dashboardData.sips || []);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [endpoint]);

  const value = useMemo(
    () => ({ funds, investors, sips, loading, error }),
    [funds, investors, sips, loading, error]
  );

  return <DashboardDataContext.Provider value={value}>{children}</DashboardDataContext.Provider>;
}

export function useDashboardData() {
  const context = useContext(DashboardDataContext);
  if (!context) {
    throw new Error("useDashboardData must be used inside DashboardDataProvider");
  }
  return context;
}
