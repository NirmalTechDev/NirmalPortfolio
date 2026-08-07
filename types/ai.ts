export interface AIPromptItem {
  id: string;
  title: string;
  category: "Architecture" | "Refactoring" | "Performance" | "Mobile Dev" | "Security";
  promptText: string;
  tags: string[];
  favorite: boolean;
}

export interface DevCommandItem {
  id: string;
  label: string;
  command: string;
  description: string;
  category: "Docker" | "Git" | "Next.js" | "Backend" | "Deploy";
}

export interface DevNote {
  id: string;
  title: string;
  category: string;
  content: string;
  lastUpdated: string;
}
