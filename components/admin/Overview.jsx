"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function Overview({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[350px] text-gray-400 font-geist">
        No sales data available for the current period.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis
          dataKey="name"
          stroke="#94a3b8"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          className="font-geist"
        />
        <YAxis
          stroke="#94a3b8"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
          className="font-geist tabular-nums"
        />
        <Tooltip 
          cursor={{ fill: '#f8fafc', radius: 4 }}
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-xl animate-in fade-in zoom-in duration-200">
                  <div className="flex flex-col gap-1">
                    <span className="text-[0.7rem] uppercase font-bold text-gray-400 tracking-wider">
                      {label} Revenue
                    </span>
                    <span className="text-lg font-bold text-[#2C2C2C] font-geist tabular-nums">
                      ${payload[0].value.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar
          dataKey="total"
          fill="#D6AF66"
          radius={[6, 6, 0, 0]}
          barSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
