"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Activity, Database, Server, Globe } from "lucide-react";

export function SystemStatusPills() {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      {/* Portfolio Status */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-medium">
        <Globe className="w-3.5 h-3.5" />
        <span>Portfolio:</span>
        <span className="font-bold tracking-wider">ONLINE</span>
      </div>

      {/* Backend Status */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 font-medium">
        <Server className="w-3.5 h-3.5" />
        <span>Backend:</span>
        <span className="font-bold tracking-wider">HEALTHY</span>
        <span className="text-[10px] text-sky-400/70 ml-0.5">(124ms)</span>
      </div>

      {/* Database Status */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 font-medium">
        <Database className="w-3.5 h-3.5" />
        <span>Database:</span>
        <span className="font-bold tracking-wider">CONNECTED</span>
      </div>
    </div>
  );
}
