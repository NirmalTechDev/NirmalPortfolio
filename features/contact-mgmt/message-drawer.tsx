"use client";

import React, { useState } from "react";
import { ContactMessage } from "@/types/portfolio";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/utils";
import { Mail, Send, Star, Trash2, CheckCircle2, Building, User } from "lucide-react";

export function MessageDrawer({
  message,
  isOpen,
  onClose,
  onReply,
  onDelete,
  onToggleStar,
}: {
  message: ContactMessage | null;
  isOpen: boolean;
  onClose: () => void;
  onReply: (id: string, replyText: string) => void;
  onDelete: (id: string) => void;
  onToggleStar: (id: string) => void;
}) {
  const [replyText, setReplyText] = useState("");
  const [replied, setReplied] = useState(false);

  if (!message) return null;

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onReply(message.id, replyText);
    setReplied(true);
    setTimeout(() => {
      setReplied(false);
      setReplyText("");
      onClose();
    }, 1500);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={message.name}
      description={`Received ${timeAgo(message.submittedAt)} • ${message.email}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Message Meta Header */}
        <div className="flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/30">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base">{message.name}</span>
                {message.company && (
                  <Badge variant="outline" className="text-[10px]">
                    <Building className="w-3 h-3 mr-1" />
                    {message.company}
                  </Badge>
                )}
              </div>
              <a href={`mailto:${message.email}`} className="text-xs text-sky-400 hover:underline">
                {message.email}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleStar(message.id)}
              className={`p-2 rounded-xl border border-white/10 ${
                message.starred ? "bg-amber-500/20 text-amber-400" : "bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              <Star className="w-4 h-4 fill-current" />
            </button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                onDelete(message.id);
                onClose();
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Message Body */}
        <div className="p-5 rounded-2xl border border-white/10 bg-slate-950/40 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Submitted Inquiry
          </span>
          <p className="text-sm leading-relaxed text-slate-200 whitespace-pre-wrap">
            {message.message}
          </p>
        </div>

        {/* Inline Reply Composer */}
        <form onSubmit={handleSendReply} className="space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Quick Reply Composer
          </span>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={`Reply directly to ${message.name} (${message.email})...`}
            rows={3}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 p-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button type="submit" disabled={!replyText.trim() || replied} className="gap-2">
              {replied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Reply Transmitted</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Response</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}
