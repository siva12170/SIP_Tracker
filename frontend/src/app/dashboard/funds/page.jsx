"use client";

import { FundsSection } from "@/components/dashboard/dashboard-sections";
import { DashboardDataProvider } from "@/contexts/dashboard-data-context";

export default function DashboardFundsPage() {
  return (
    <DashboardDataProvider endpoint="/api/dashboard">
      <FundsSection />
    </DashboardDataProvider>
  );
}
