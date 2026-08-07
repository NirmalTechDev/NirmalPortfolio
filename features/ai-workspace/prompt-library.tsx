"use client";

import React, { useState } from "react";
import { AIPromptItem } from "@/types/ai";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check, Sparkles, Star } from "lucide-react";

export function PromptLibrary({ prompts }: { prompts: AIPromptItem[] }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyPrompt = (p: AIPromptItem) => {
    navigator.clipboard.writeText(p.promptText);
    setCopiedId(p.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-sky-400" />
          <span>Staff AI Prompt Library</span>
        </CardTitle>
        <CardDescription>Engineered prompts for code review, decimal math audit & React Native profiling</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prompts.map((p) => (
            <div
              key={p.id}
              className="p-5 rounded-2xl border border-white/10 bg-slate-950/60 flex flex-col justify-between space-y-3 hover:border-white/20 transition"
            >
              <div>
                <div className="flex items-center justify-between">
                  <Badge variant="purple" className="text-[10px]">
                    {p.category}
                  </Badge>
                  {p.favorite && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                </div>
                <h4 className="text-base font-bold text-white mt-2">{p.title}</h4>
                <p className="text-xs text-slate-300 mt-2 font-mono bg-slate-900/80 p-3 rounded-xl border border-white/5 line-clamp-3">
                  &quot;{p.promptText}&quot;
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div className="flex flex-wrap gap-1">
                  {p.tags.map((t) => (
                    <span key={t} className="text-[9px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-md">
                      #{t}
                    </span>
                  ))}
                </div>
                <Button size="sm" variant="outline" onClick={() => copyPrompt(p)} className="gap-1 text-xs">
                  {copiedId === p.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
