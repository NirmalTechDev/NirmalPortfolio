"use client";

import React, { useState } from "react";
import { CMSSkill } from "@/types/portfolio";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";

export function SkillsManager({ skills: initialSkills }: { skills: CMSSkill[] }) {
  const [skills, setSkills] = useState<CMSSkill[]>(initialSkills);
  const [newSkillName, setNewSkillName] = useState("");
  const [newCategory, setNewCategory] = useState<CMSSkill["category"]>("Frontend");

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const created: CMSSkill = {
      id: `sk_${Date.now()}`,
      name: newSkillName,
      category: newCategory,
      level: "Expert",
      logo: "/logos/react-js.png",
      order: skills.length + 1,
    };
    setSkills([...skills, created]);
    setNewSkillName("");
  };

  const handleDelete = (id: string) => {
    setSkills(skills.filter((s) => s.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Core Skills & Floating Stack Badges</CardTitle>
        <CardDescription>Tech stack items displayed across floating skill nodes and core experience sections</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Skill Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="New Tech Skill (e.g. GraphQL, Docker, Next.js 16)..."
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            className="flex-1"
          />
          <select
            value={newCategory}
            onChange={(e: any) => setNewCategory(e.target.value)}
            className="h-10 rounded-xl border border-white/10 bg-slate-950 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="Mobile">Mobile</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Cloud">Cloud</option>
            <option value="DevOps">DevOps</option>
            <option value="Design">Design</option>
          </select>
          <Button onClick={handleAddSkill} className="gap-1.5 shrink-0">
            <Plus className="w-4 h-4" />
            <span>Add Skill</span>
          </Button>
        </div>

        {/* Skill Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {skills.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-slate-950/60 hover:border-white/20 transition"
            >
              <div className="flex items-center gap-2.5">
                <Image
                  src={s.logo}
                  alt={s.name}
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain"
                />
                <div>
                  <span className="text-xs font-bold text-white block">{s.name}</span>
                  <span className="text-[10px] text-slate-400">{s.category}</span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(s.id)}
                className="text-slate-500 hover:text-red-400 p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
