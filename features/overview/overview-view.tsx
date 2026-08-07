"use client";

import React from "react";
import { MetricsGrid } from "./metrics-grid";
import { TrafficChart } from "./traffic-chart";
import { ActivityTimeline } from "./activity-timeline";

export function OverviewView() {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-300">
      <MetricsGrid />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <TrafficChart />
        <ActivityTimeline />
      </div>
    </div>
  );
}
