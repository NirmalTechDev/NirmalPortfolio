"use client";

import React, { useState } from "react";
import { DevCommandItem } from "@/types/ai";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Terminal, Copy, Check, Play } from "lucide-react";

export function CommandRunner({ commands }: { commands: DevCommandItem[] }) {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copyCommand = (cmd: DevCommandItem) => {
    navigator.clipboard.writeText(cmd.command);
    setCopiedCmd(cmd.id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Terminal className="w-5 h-5 text-emerald-400" />
          <span>Saved Developer Terminal Commands</span>
        </CardTitle>
        <CardDescription>Single-click command execution for TypeScript verification, Docker DBs & Prisma migrations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {commands.map((c) => (
            <div
              key={c.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-white/10 bg-slate-950/60 gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{c.label}</span>
                  <Badge variant="outline" className="text-[10px]">
                    {c.category}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 mt-1">{c.description}</p>
                <code className="block text-xs font-mono text-sky-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-white/5 mt-2">
                  $ {c.command}
                </code>
              </div>

              <Button size="sm" variant="outline" onClick={() => copyCommand(c)} className="gap-1.5 text-xs self-end sm:self-center shrink-0">
                {copiedCmd === c.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Command</span>
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
