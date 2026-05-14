"use client";

import { FundsSection } from "@/components/dashboard/dashboard-sections";
import { DashboardDataProvider } from "@/contexts/dashboard-data-context";

export default function PublicDashboardFundsPage() {
  return (
    <DashboardDataProvider endpoint="/api/pdashboard">
      <FundsSection />
    </DashboardDataProvider>
  );
}
