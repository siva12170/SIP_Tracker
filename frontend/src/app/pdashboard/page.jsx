"use client";

import DashboardContent from "@/components/dashboard/dashboard-content";
import { DashboardDataProvider } from "@/contexts/dashboard-data-context";

export default function PublicDashboardPage() {
  return (
    <DashboardDataProvider endpoint="/api/pdashboard">
      <DashboardContent />
    </DashboardDataProvider>
  );
}
