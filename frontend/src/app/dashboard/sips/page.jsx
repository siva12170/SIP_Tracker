"use client";

import { SipsSection } from "@/components/dashboard/dashboard-sections";
import { DashboardDataProvider } from "@/contexts/dashboard-data-context";

export default function DashboardSipsPage() {
  return (
    <DashboardDataProvider endpoint="/api/dashboard">
      <SipsSection />
    </DashboardDataProvider>
  );
}
