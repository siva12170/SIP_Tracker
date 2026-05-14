"use client";

import { InvestorsSection } from "@/components/dashboard/dashboard-sections";
import { DashboardDataProvider } from "@/contexts/dashboard-data-context";

export default function PublicDashboardInvestorsPage() {
  return (
    <DashboardDataProvider endpoint="/api/pdashboard">
      <InvestorsSection />
    </DashboardDataProvider>
  );
}
