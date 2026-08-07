"use client";

import React, { useState, useEffect } from "react";
import { ContactMessage } from "@/types/portfolio";
import { contactService } from "@/services/contact.service";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { timeAgo } from "@/lib/utils";
import { Mail, Search, Star, Trash2, CheckCircle2, MessageSquare } from "lucide-react";
import { MessageDrawer } from "./message-drawer";

export function ContactsView() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | "starred">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    async function fetchContacts() {
      const data = await contactService.getMessages();
      setMessages(data);
    }
    fetchContacts();
  }, []);

  const handleToggleStar = async (id: string) => {
    await contactService.toggleStar(id);
    setMessages(
      messages.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m))
    );
  };

  const handleDelete = async (id: string) => {
    await contactService.deleteMessage(id);
    setMessages(messages.filter((m) => m.id !== id));
  };

  const handleReply = async (id: string, replyText: string) => {
    await contactService.updateStatus(id, "replied");
    setMessages(
      messages.map((m) => (m.id === id ? { ...m, status: "replied" } : m))
    );
  };

  const filtered = messages.filter((m) => {
    if (filter === "unread" && m.status !== "unread") return false;
    if (filter === "starred" && !m.starred) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-300">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Mail className="w-5 h-5 text-sky-400" />
              <span>Portfolio Contact Inbox</span>
            </CardTitle>
            <CardDescription>
              Direct client inquiries & recruiter outreach submitted via nirmalranpariya.in
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All ({messages.length})
            </Button>
            <Button
              variant={filter === "unread" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("unread")}
            >
              Unread ({messages.filter((m) => m.status === "unread").length})
            </Button>
            <Button
              variant={filter === "starred" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("starred")}
            >
              Starred ({messages.filter((m) => m.starred).length})
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by sender name, company, or keyword..."
              className="pl-10"
            />
          </div>

          <div className="space-y-2">
            {filtered.length === 0 ? (
              <p className="p-8 text-center text-sm text-slate-500">No contact messages found.</p>
            ) : (
              filtered.map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    contactService.updateStatus(m.id, "read");
                    setSelectedMessage(m);
                  }}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition cursor-pointer ${
                    m.status === "unread"
                      ? "border-sky-500/30 bg-sky-500/5 hover:border-sky-500/50"
                      : "border-white/10 bg-slate-950/40 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStar(m.id);
                      }}
                      className={`mt-1 p-1 rounded-lg ${
                        m.starred ? "text-amber-400" : "text-slate-600 hover:text-slate-400"
                      }`}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{m.name}</span>
                        {m.company && (
                          <span className="text-[11px] text-slate-400">({m.company})</span>
                        )}
                        {m.status === "unread" && (
                          <Badge variant="default" className="text-[9px] py-0 px-1.5">
                            UNREAD
                          </Badge>
                        )}
                        {m.status === "replied" && (
                          <Badge variant="success" className="text-[9px] py-0 px-1.5">
                            REPLIED
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 mt-1 line-clamp-1 max-w-2xl">
                        {m.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-2 sm:mt-0 text-xs text-slate-400">
                    <span>{timeAgo(m.submittedAt)}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(m.id);
                      }}
                      className="p-1 text-slate-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <MessageDrawer
        message={selectedMessage}
        isOpen={!!selectedMessage}
        onClose={() => setSelectedMessage(null)}
        onReply={handleReply}
        onDelete={handleDelete}
        onToggleStar={handleToggleStar}
      />
    </div>
  );
}
