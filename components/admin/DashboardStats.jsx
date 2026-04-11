"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { DollarSign, Package, ShoppingCart, Users, TrendingUp } from "lucide-react";

export default function DashboardStats({ stats }) {
  const items = [
    {
      title: "Total Revenue",
      value: `$${(stats?.totalRevenue || 0).toLocaleString()}`,
      description: "Lifetime earnings",
      icon: DollarSign,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
      iconColor: "text-emerald-600"
    },
    {
      title: "Catalog Size",
      value: (stats?.productsCount || 0).toLocaleString(),
      description: "Total live products",
      icon: Package,
      color: "bg-blue-50 text-blue-600 border-blue-100",
      iconColor: "text-blue-600"
    },
    {
      title: "Active Orders",
      value: (stats?.ordersCount || 0).toLocaleString(),
      description: "Processed transactions",
      icon: ShoppingCart,
      color: "bg-amber-50 text-amber-600 border-amber-100",
      iconColor: "text-amber-600"
    },
    {
      title: "Customer Base",
      value: (stats?.customersCount || 0).toLocaleString(),
      description: "Registered members",
      icon: Users,
      color: "bg-rose-50 text-rose-600 border-rose-100",
      iconColor: "text-rose-600"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => (
        <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-500 font-geist">
              {item.title}
            </CardTitle>
            <div className={`p-2 rounded-xl ${item.color} border`}>
              <item.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#2C2C2C] font-geist tabular-nums">
              {item.value}
            </div>
            <p className="text-xs text-gray-400 mt-1 font-medium italic">
              {item.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
