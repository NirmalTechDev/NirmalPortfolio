import { ContactMessage } from "@/types/portfolio";
import { dashboardFetch } from "@/lib/dashboard-fetch";
import { toBackendStatus, toContactMessages } from "@/lib/collective-adapters";

const STARRED_KEY = "nirmal_cmd_starred_contacts";

function getStarredIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STARRED_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function saveStarredIds(ids: Set<string>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STARRED_KEY, JSON.stringify([...ids]));
}

const MOCK_CONTACTS: ContactMessage[] = [
  {
    id: "msg_demo",
    name: "Demo Mode",
    email: "demo@example.com",
    company: "Offline",
    message: "Connect Collective backend to see real contact messages.",
    submittedAt: new Date().toISOString(),
    status: "unread",
    starred: false,
  },
];

export const contactService = {
  async getMessages(): Promise<ContactMessage[]> {
    try {
      const data = await dashboardFetch<{ messages: Parameters<typeof toContactMessages>[0] }>(
        "/api/collective/contacts"
      );
      return toContactMessages(data.messages ?? [], getStarredIds());
    } catch {
      return MOCK_CONTACTS;
    }
  },

  async updateStatus(id: string, status: ContactMessage["status"]): Promise<void> {
    try {
      await dashboardFetch(`/api/collective/contacts/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: toBackendStatus(status) }),
      });
    } catch {
      // silently fail in demo mode
    }
  },

  async toggleStar(id: string): Promise<boolean> {
    const starred = getStarredIds();
    if (starred.has(id)) starred.delete(id);
    else starred.add(id);
    saveStarredIds(starred);
    return starred.has(id);
  },

  async deleteMessage(id: string): Promise<void> {
    await this.updateStatus(id, "archived");
  },
};
