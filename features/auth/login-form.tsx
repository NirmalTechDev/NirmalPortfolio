"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  passcode: z.string().min(4, "Passcode must be at least 4 characters."),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      passcode: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await login(data);
    } catch (err: any) {
      setErrorMessage(err.message || "Authentication failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillQuickDemo = () => {
    setValue("email", "nirmatech.dev@gmail.com");
    setValue("passcode", "");
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 text-xs font-semibold backdrop-blur-md">
          <ShieldCheck className="w-4 h-4" />
          <span>Staff Command Center Protection</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Nirmal Ranpariya Command Center
        </h1>
        <p className="text-sm text-slate-400">
          Enter staff credentials to unlock full portfolio & SaaS administration
        </p>
      </div>

      <div className="rounded-3xl border border-white/15 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        {errorMessage && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-medium text-red-300">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Staff Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <Input
                {...register("email")}
                type="email"
                placeholder="nirmatech.dev@gmail.com"
                className="pl-10"
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Security Passcode
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <Input
                {...register("passcode")}
                type="password"
                placeholder="••••••••"
                className="pl-10"
              />
            </div>
            {errors.passcode && (
              <p className="mt-1.5 text-xs text-red-400">{errors.passcode.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 text-base font-semibold gap-2"
          >
            {isSubmitting ? (
              <span>Authenticating JWT Token...</span>
            ) : (
              <>
                <span>Unlock Command Center</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <button
            type="button"
            onClick={fillQuickDemo}
            className="inline-flex items-center gap-1.5 text-sky-400 hover:underline font-medium"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto-fill Staff Email</span>
          </button>
          <span className="text-slate-500">v2.4 Production</span>
        </div>
      </div>
    </div>
  );
}
