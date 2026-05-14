"use client";

import { InvestorsSection } from "@/components/dashboard/dashboard-sections";
import { DashboardDataProvider } from "@/contexts/dashboard-data-context";

export default function DashboardInvestorsPage() {
  return (
    <DashboardDataProvider endpoint="/api/dashboard">
      <InvestorsSection />
    </DashboardDataProvider>
  );
}
