"use client";

import { SipsSection } from "@/components/dashboard/dashboard-sections";
import { DashboardDataProvider } from "@/contexts/dashboard-data-context";

export default function PublicDashboardSipsPage() {
  return (
    <DashboardDataProvider endpoint="/api/pdashboard">
      <SipsSection />
    </DashboardDataProvider>
  );
}
