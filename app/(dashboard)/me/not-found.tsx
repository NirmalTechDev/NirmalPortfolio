import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldAlert } from "lucide-react";

export default function DashboardNotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="p-4 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-4">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-white tracking-tight">404 • Module Not Found</h1>
      <p className="text-sm text-slate-400 max-w-md mt-2 mb-6">
        The requested staff command center section does not exist or has been relocated.
      </p>
      <Link href="/me">
        <Button className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Command Center</span>
        </Button>
      </Link>
    </div>
  );
}
