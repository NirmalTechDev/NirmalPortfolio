"use client";

import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LatencyDataPoint } from "@/types/monitoring";
import { Cpu } from "lucide-react";

export function LatencyChart({ history }: { history: LatencyDataPoint[] }) {
  return (
    <Card className="lg:col-span-8">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Cpu className="w-5 h-5 text-sky-400" />
          <span>Real-time Service Response Latency (ms)</span>
        </CardTitle>
        <CardDescription>HTTP P95 latency tracking across microservices</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history} margin={{ top: 10, right: 20, left: 15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} width={55} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "16px",
                  color: "#f8fafc",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
              <Line type="monotone" dataKey="portfolioMs" name="Portfolio (Next.js)" stroke="#0ea5e9" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="ledgerBackendMs" name="Ledger Backend (Render)" stroke="#8b5cf6" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="databaseMs" name="PostgreSQL DB" stroke="#10b981" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
