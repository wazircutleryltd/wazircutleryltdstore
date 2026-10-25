'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Overview from "@/components/admin/Overview";
import RecentSales from "@/components/admin/RecentSales";
import DashboardStats from "@/components/admin/DashboardStats";
import { useDashboardStatsQuery } from "@/lib/hooks";
import { LoadingState, ErrorState } from "@/components/common/StateComponents";

export default function DashboardClient() {
  const { data, isLoading, error } = useDashboardStatsQuery();

  if (isLoading) return <LoadingState message="Loading dashboard data..." />;
  if (error) return <ErrorState message="Failed to load dashboard metrics" />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-[#2C2C2C] mb-2 font-geist">Dashboard</h2>
        <p className="text-muted-foreground font-geist">
          Real-time performance metrics for Wazir Cutlery.
        </p>
      </div>
      
      <DashboardStats stats={data} />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm border-gray-100">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-[#2C2C2C]">Revenue Overview</CardTitle>
            <CardDescription>
              Monthly revenue performance (Last 6 Months)
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={data?.revenueHistory || []} />
          </CardContent>
        </Card>
        
        <Card className="col-span-3 shadow-sm border-gray-100">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-[#2C2C2C]">Recent Activity</CardTitle>
            <CardDescription>
              Latest orders received from customers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSales />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
