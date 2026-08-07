"use client";

import React from "react";
import { SystemLogEntry } from "@/types/monitoring";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Terminal } from "lucide-react";

export function LogStream({ logs }: { logs: SystemLogEntry[] }) {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Terminal className="w-5 h-5 text-amber-400" />
          <span>System Log Stream & HTTP Status Codes</span>
        </CardTitle>
        <CardDescription>Live application logs streamed from Node.js backend & Vercel edge runtime</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="font-mono text-xs space-y-2 max-h-80 overflow-y-auto scrollbar-thin bg-slate-950 p-4 rounded-2xl border border-white/10">
          {logs.map((l) => (
            <div key={l.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2">
              <div className="flex items-center gap-3">
                <span className="text-slate-500">{formatDate(l.timestamp)}</span>
                <Badge
                  variant={l.level === "ERROR" ? "danger" : l.level === "WARN" ? "warning" : "default"}
                  className="text-[9px] py-0 px-1.5"
                >
                  {l.level}
                </Badge>
                <span className="text-purple-400 font-semibold">[{l.service}]</span>
                <span className="text-slate-200">{l.message}</span>
              </div>
              {l.statusCode && (
                <span className={`font-bold font-mono ${l.statusCode >= 200 && l.statusCode < 300 ? "text-emerald-400" : l.statusCode >= 400 ? "text-red-400" : "text-amber-400"}`}>
                  {l.statusCode} {l.statusCode >= 200 && l.statusCode < 300 ? "OK" : l.statusCode >= 500 ? "ERROR" : l.statusCode >= 400 ? "CLIENT ERROR" : ""}
                </span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
