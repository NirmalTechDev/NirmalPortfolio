"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CMSProject } from "@/types/portfolio";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const projectSchema = z.object({
  title: z.string().min(2, "Title required"),
  tagline: z.string().min(5, "Tagline required"),
  summary: z.string().min(10, "Summary required"),
  problem: z.string().min(5, "Problem description required"),
  role: z.string().min(5, "Role description required"),
  process: z.string().min(5, "Process description required"),
  stackInput: z.string().min(2, "Stack comma separated"),
  liveUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  imageSrc: z.string().min(2, "Image path or URL required"),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export function ProjectEditorModal({
  isOpen,
  onClose,
  project,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  project: CMSProject | null;
  onSave: (proj: CMSProject) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });

  useEffect(() => {
    if (project) {
      reset({
        title: project.title,
        tagline: project.tagline,
        summary: project.summary,
        problem: project.problem,
        role: project.role,
        process: project.process,
        stackInput: project.stack.join(", "),
        liveUrl: project.liveUrl || "",
        githubUrl: project.githubUrl || "",
        imageSrc: project.imageSrc,
      });
    } else {
      reset({
        title: "",
        tagline: "",
        summary: "",
        problem: "",
        role: "Full-Stack Engineer",
        process: "User research, prototyping, & production deployment",
        stackInput: "React Native, Next.js, Node.js, TypeScript",
        liveUrl: "https://nirmalranpariya.in",
        githubUrl: "https://github.com/NirmalTechDev",
        imageSrc: "/trofy.jpg",
      });
    }
  }, [project, reset, isOpen]);

  const onSubmit = (data: ProjectFormData) => {
    const stack = data.stackInput.split(",").map((s) => s.trim()).filter(Boolean);
    const updated: CMSProject = {
      id: project ? project.id : `proj_${Date.now()}`,
      slug: project ? project.slug : data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title: data.title,
      tagline: data.tagline,
      summary: data.summary,
      problem: data.problem,
      role: data.role,
      process: data.process,
      stack,
      features: project ? project.features : ["Responsive UI", "Realtime DB Sync"],
      challenges: project ? project.challenges : ["High scale performance"],
      outcomes: project ? project.outcomes : ["Reduced latency by 35%"],
      order: project ? project.order : 99,
      liveUrl: data.liveUrl,
      githubUrl: data.githubUrl,
      imageSrc: data.imageSrc,
    };

    onSave(updated);
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={project ? `Edit ${project.title}` : "Create New Production Project"}
      description="Manage portfolio project details, tech stack, and case study links"
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto scrollbar-thin pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300">Project Title</label>
            <Input {...register("title")} placeholder="OPIGO / Collective Ledger" />
            {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">Tagline</label>
            <Input {...register("tagline")} placeholder="Social stock trading with real-time advice" />
            {errors.tagline && <p className="text-xs text-red-400 mt-1">{errors.tagline.message}</p>}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300">Summary</label>
          <textarea
            {...register("summary")}
            rows={2}
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          {errors.summary && <p className="text-xs text-red-400 mt-1">{errors.summary.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300">Problem Statement</label>
            <Input {...register("problem")} placeholder="Investors needed real-time market context" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300">Engineering Role</label>
            <Input {...register("role")} placeholder="Full-Stack Lead" />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300">Engineering Process</label>
          <Input {...register("process")} placeholder="User research, prototyping, & production deployment" />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300">Tech Stack (comma separated)</label>
          <Input {...register("stackInput")} placeholder="React Native, Node.js, Firebase, TypeScript" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300">Live URL</label>
            <Input {...register("liveUrl")} placeholder="https://opigo.in" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300">GitHub Repository</label>
            <Input {...register("githubUrl")} placeholder="https://github.com/..." />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300">Thumbnail Image Path</label>
            <Input {...register("imageSrc")} placeholder="/trofy.jpg" />
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Dialog>
  );
}
