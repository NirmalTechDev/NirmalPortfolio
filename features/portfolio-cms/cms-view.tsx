"use client";

import React, { useState, useEffect } from "react";
import { CMSAbout, CMSHero, CMSProject, CMSSkill } from "@/types/portfolio";
import { portfolioService } from "@/services/portfolio.service";
import { HeroAboutManager } from "./hero-about-manager";
import { ProjectManager } from "./project-manager";
import { SkillsManager } from "./skills-manager";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export function CMSView() {
  const [activeSubTab, setActiveSubTab] = useState("projects");
  const [hero, setHero] = useState<CMSHero | null>(null);
  const [about, setAbout] = useState<CMSAbout | null>(null);
  const [projects, setProjects] = useState<CMSProject[]>([]);
  const [skills, setSkills] = useState<CMSSkill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [h, a, p, s] = await Promise.all([
          portfolioService.getHero(),
          portfolioService.getAbout(),
          portfolioService.getProjects(),
          portfolioService.getSkills(),
        ]);
        setHero(h);
        setAbout(a);
        setProjects(p);
        setSkills(s);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSaveProject = async (p: CMSProject) => {
    await portfolioService.saveProject(p);
    const updated = await portfolioService.getProjects();
    setProjects([...updated]);
  };

  const handleDeleteProject = async (id: string) => {
    await portfolioService.deleteProject(id);
    setProjects(projects.filter((item) => item.id !== id));
  };

  const handleReorderProjects = async (ids: string[]) => {
    const updated = await portfolioService.reorderProjects(ids);
    setProjects([...updated]);
  };

  if (isLoading || !hero || !about) {
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
          <TabsTrigger value="projects">Production Projects ({projects.length})</TabsTrigger>
          <TabsTrigger value="hero-about">Hero & About Content</TabsTrigger>
          <TabsTrigger value="skills">Core Skills ({skills.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <ProjectManager
            projects={projects}
            onSave={handleSaveProject}
            onDelete={handleDeleteProject}
            onReorder={handleReorderProjects}
          />
        </TabsContent>

        <TabsContent value="hero-about">
          <HeroAboutManager hero={hero} about={about} />
        </TabsContent>

        <TabsContent value="skills">
          <SkillsManager skills={skills} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
