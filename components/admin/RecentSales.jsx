"use client";

import { Avatar, AvatarFallback } from "../ui/avatar";
import { useAllOrders } from "@/lib/supabase-hooks";
import { Loader2 } from "lucide-react";

export default function RecentSales() {
  const { data: orders, isLoading } = useAllOrders(1, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-gray-400 font-geist italic">
        No recent sales recorded.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order, index) => (
        <div key={order.id || index} className="flex items-center group">
          <Avatar className="h-10 w-10 border border-gray-100 shadow-sm group-hover:scale-105 transition-transform duration-200">
            <AvatarFallback className="bg-[#D6AF66] text-white font-bold text-xs uppercase">
              {(order.shipping_address?.full_name || "Guest").split(' ').map(n => n[0]).join('').substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-bold text-[#2C2C2C] font-geist leading-none group-hover:text-[#D6AF66] transition-colors duration-200">
              {order.shipping_address?.full_name || "Guest User"}
            </p>
            <p className="text-xs text-gray-400 font-medium">
              {new Date(order.created_at).toLocaleDateString()} • {order.order_number}
            </p>
          </div>
          <div className="ml-auto font-bold text-emerald-600 font-geist tabular-nums">
            +${(order.total || 0).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
