import type { Metadata } from "next";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import React from "react";

export const metadata: Metadata = {
  title:
    "Admin Panel",
  description: "",
};

export default function Dashboard() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6">
        <DashboardMetrics />
        {/* <MonthlySalesChart /> */}
      </div>
    </div>
  );
}
