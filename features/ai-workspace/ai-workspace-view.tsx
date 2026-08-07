"use client";

import React, { useEffect, useState } from "react";
import { AIPromptItem, DevCommandItem, DevNote } from "@/types/ai";
import { aiService } from "@/services/ai.service";
import { PromptLibrary } from "./prompt-library";
import { CommandRunner } from "./command-runner";
import { DevNotesEditor } from "./dev-notes-editor";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export function AIWorkspaceView() {
  const [activeSubTab, setActiveSubTab] = useState("prompts");
  const [prompts, setPrompts] = useState<AIPromptItem[]>([]);
  const [commands, setCommands] = useState<DevCommandItem[]>([]);
  const [notes, setNotes] = useState<DevNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAI() {
      try {
        const [p, c, n] = await Promise.all([
          aiService.getPrompts(),
          aiService.getCommands(),
          aiService.getNotes(),
        ]);
        setPrompts(p);
        setCommands(c);
        setNotes(n);
      } finally {
        setIsLoading(false);
      }
    }
    loadAI();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-300">
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList>
          <TabsTrigger value="prompts">AI Prompt Library ({prompts.length})</TabsTrigger>
          <TabsTrigger value="commands">Terminal Commands ({commands.length})</TabsTrigger>
          <TabsTrigger value="notes">Dev Notes & Architecture ({notes.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="prompts">
          <PromptLibrary prompts={prompts} />
        </TabsContent>

        <TabsContent value="commands">
          <CommandRunner commands={commands} />
        </TabsContent>

        <TabsContent value="notes">
          <DevNotesEditor initialNotes={notes} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
