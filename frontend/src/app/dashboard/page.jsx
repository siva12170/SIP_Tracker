"use client";

import DashboardContent from "@/components/dashboard/dashboard-content";
import { DashboardDataProvider } from "@/contexts/dashboard-data-context";

export default function DashboardPage() {
  return (
    <DashboardDataProvider endpoint="/api/dashboard">
      <DashboardContent />
    </DashboardDataProvider>
  );
}
