"use client";

import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Activity, TrendingUp } from "lucide-react";

const trafficData = [
  { time: "00:00", visitors: 1200, apiRequests: 45000, ledgerTx: 320 },
  { time: "04:00", visitors: 980, apiRequests: 32000, ledgerTx: 180 },
  { time: "08:00", visitors: 2800, apiRequests: 112000, ledgerTx: 650 },
  { time: "12:00", visitors: 4500, apiRequests: 240000, ledgerTx: 1280 },
  { time: "16:00", visitors: 5800, apiRequests: 310000, ledgerTx: 1620 },
  { time: "20:00", visitors: 4900, apiRequests: 280000, ledgerTx: 1450 },
  { time: "NOW", visitors: 3900, apiRequests: 195000, ledgerTx: 990 },
];

export function TrafficChart() {
  return (
    <Card className="col-span-full lg:col-span-8">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl flex items-center gap-2">
            <Activity className="w-5 h-5 text-sky-400" />
            <span>Platform Traffic & API Spikes (24h)</span>
          </CardTitle>
          <CardDescription>
            Live HTTP requests across Portfolio & Collective Ledger backend services
          </CardDescription>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>+18.4% Peak</span>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trafficData} margin={{ top: 10, right: 20, left: 15, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} width={65} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "16px",
                  color: "#f8fafc",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
                }}
              />
              <Area
                type="monotone"
                dataKey="apiRequests"
                name="API Requests"
                stroke="#0ea5e9"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRequests)"
              />
              <Area
                type="monotone"
                dataKey="visitors"
                name="Unique Visitors"
                stroke="#8b5cf6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorVisitors)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
