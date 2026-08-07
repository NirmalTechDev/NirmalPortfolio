"use client";

import React, { useState } from "react";
import { DevNote } from "@/types/ai";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Plus, Save, CheckCircle2 } from "lucide-react";

export function DevNotesEditor({ initialNotes }: { initialNotes: DevNote[] }) {
  const [notes, setNotes] = useState<DevNote[]>(initialNotes);
  const [activeNote, setActiveNote] = useState<DevNote>(initialNotes[0]);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setNotes(notes.map((n) => (n.id === activeNote.id ? activeNote : n)));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCreateNew = () => {
    const created: DevNote = {
      id: `note_${Date.now()}`,
      title: "New Architectural Decision Document",
      category: "Architecture",
      content: "# Title\n\nDocument details...",
      lastUpdated: new Date().toISOString().split("T")[0],
    };
    setNotes([...notes, created]);
    setActiveNote(created);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <span>Development Notes & Architecture Documents</span>
          </CardTitle>
          <CardDescription>Personal knowledge base & system design notes</CardDescription>
        </div>
        <Button size="sm" onClick={handleCreateNew} className="gap-1.5 text-xs">
          <Plus className="w-3.5 h-3.5" />
          <span>New Note</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Note List sidebar */}
          <div className="md:col-span-4 space-y-2">
            {notes.map((n) => (
              <button
                key={n.id}
                onClick={() => setActiveNote(n)}
                className={`w-full text-left p-3 rounded-xl border transition ${
                  activeNote.id === n.id
                    ? "border-sky-500/40 bg-sky-500/10 text-white"
                    : "border-white/10 bg-slate-950/40 text-slate-300 hover:bg-white/5"
                }`}
              >
                <span className="font-bold text-xs block truncate">{n.title}</span>
                <span className="text-[10px] text-slate-400 mt-1 block">{n.category} • {n.lastUpdated}</span>
              </button>
            ))}
          </div>

          {/* Active Note Editor */}
          <div className="md:col-span-8 space-y-4">
            <Input
              value={activeNote.title}
              onChange={(e) => setActiveNote({ ...activeNote, title: e.target.value })}
              className="text-base font-bold"
            />
            <textarea
              value={activeNote.content}
              onChange={(e) => setActiveNote({ ...activeNote, content: e.target.value })}
              rows={8}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/80 p-4 font-mono text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <div className="flex justify-end">
              <Button onClick={handleSave} className="gap-2 text-xs">
                {saved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Saved Note</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Note</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
