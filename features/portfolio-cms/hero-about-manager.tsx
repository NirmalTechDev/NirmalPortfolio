"use client";

import React, { useState } from "react";
import { CMSAbout, CMSHero } from "@/types/portfolio";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, CheckCircle2 } from "lucide-react";

export function HeroAboutManager({
  hero,
  about,
}: {
  hero: CMSHero;
  about: CMSAbout;
}) {
  const [heroForm, setHeroForm] = useState<CMSHero>(hero);
  const [aboutForm, setAboutForm] = useState<CMSAbout>(about);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Hero Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Hero Section Content</CardTitle>
          <CardDescription>Main title, subheadline & CTA buttons on homepage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300">Headline Name</label>
            <Input
              value={heroForm.headline}
              onChange={(e) => setHeroForm({ ...heroForm, headline: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300">Subheadline / Role</label>
            <Input
              value={heroForm.subheadline}
              onChange={(e) => setHeroForm({ ...heroForm, subheadline: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300">Primary CTA Text</label>
              <Input
                value={heroForm.ctaTextPrimary}
                onChange={(e) => setHeroForm({ ...heroForm, ctaTextPrimary: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300">Secondary CTA Text</label>
              <Input
                value={heroForm.ctaTextSecondary}
                onChange={(e) => setHeroForm({ ...heroForm, ctaTextSecondary: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">About & Experience Summary</CardTitle>
          <CardDescription>Mission statement & bio details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300">Professional Title</label>
            <Input
              value={aboutForm.title}
              onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300">Mission Statement</label>
            <textarea
              value={aboutForm.missionStatement}
              onChange={(e) => setAboutForm({ ...aboutForm, missionStatement: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" className="gap-2">
              {saved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Saved to Portfolio</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Update Hero & About</span>
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
