"use client";

import React, { useState } from "react";
import { CMSProject } from "@/types/portfolio";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Plus, Edit, Trash2, ExternalLink, Github, ArrowUp, ArrowDown } from "lucide-react";
import { ProjectEditorModal } from "./project-editor-modal";

export function ProjectManager({
  projects,
  onSave,
  onDelete,
  onReorder,
}: {
  projects: CMSProject[];
  onSave: (p: CMSProject) => void;
  onDelete: (id: string) => void;
  onReorder: (ids: string[]) => void;
}) {
  const [selectedProject, setSelectedProject] = useState<CMSProject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (p: CMSProject) => {
    setSelectedProject(p);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const copy = [...projects];
    const temp = copy[index];
    copy[index] = copy[index - 1];
    copy[index - 1] = temp;
    onReorder(copy.map((c) => c.id));
  };

  const moveDown = (index: number) => {
    if (index === projects.length - 1) return;
    const copy = [...projects];
    const temp = copy[index];
    copy[index] = copy[index + 1];
    copy[index + 1] = temp;
    onReorder(copy.map((c) => c.id));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-xl">Production Projects & Case Studies</CardTitle>
          <CardDescription>Manage, edit, or re-order featured projects on portfolio</CardDescription>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {projects.map((p, idx) => (
          <div
            key={p.id}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl border border-white/10 bg-slate-950/60 hover:border-white/20 transition"
          >
            <div className="flex items-start gap-4">
              <Image
                src={p.imageSrc}
                alt={p.title}
                width={64}
                height={64}
                className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-white">{p.title}</h4>
                  <Badge variant="outline" className="text-[10px]">
                    Order #{idx + 1}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 max-w-xl line-clamp-1">{p.tagline}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {p.stack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-semibold text-slate-300 border border-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center">
              {/* Order Controls */}
              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => moveUp(idx)}
                  disabled={idx === 0}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => moveDown(idx)}
                  disabled={idx === projects.length - 1}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <Button variant="outline" size="sm" onClick={() => handleEdit(p)} className="gap-1 text-xs">
                <Edit className="w-3.5 h-3.5" />
                <span>Edit</span>
              </Button>

              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(p.id)}
                className="gap-1 text-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>

      <ProjectEditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={selectedProject}
        onSave={onSave}
      />
    </Card>
  );
}
