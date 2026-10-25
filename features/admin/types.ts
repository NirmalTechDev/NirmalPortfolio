import type { ExperienceEntry, Project, SiteContent } from "@/lib/content/types";

export type { ExperienceEntry, Project, SiteContent };

export interface Overview {
  counts: { newMessages: number; totalMessages: number; projects: number; hiddenProjects: number; photos: number; birthdays: number; publishedBirthdays: number };
  resume: { title: string; fileUrl: string; updatedAt: string } | null;
  siteContentReady: boolean;
  siteUpdatedAt: string | null;
  recentMessages: { _id: string; name: string; subject: string; status: MessageStatus; createdAt: string }[];
  activity: { _id: string; action: string; entity: string; timestamp: string; metadata?: Record<string, unknown> }[];
  services: { media: { driver: "cloudinary" | "local" | "none"; cloudName: string | null }; emailConfigured: boolean };
}

export type MessageStatus = "NEW" | "READ" | "REPLIED" | "ARCHIVED";

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: MessageStatus;
  starred: boolean;
  notes: string;
  createdAt: string;
  readAt?: string | null;
  repliedAt?: string | null;
  replies: { _id: string; subject: string; body: string; status: "SENT" | "FAILED"; error?: string; errorDetail?: string; sentAt: string }[];
}

export interface ResumeDoc {
  _id: string;
  title: string;
  fileUrl: string;
  fileSize?: number;
  fileName?: string;
  active: boolean;
  publicId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectDoc extends Project {
  _id: string;
  isVisible: boolean;
  order: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExperienceDoc extends ExperienceEntry {
  _id: string;
}

export type FrameStyle = "pearl" | "floral" | "polaroid";
export interface GalleryPhoto {
  _id: string;
  legacyId?: number;
  url: string;
  publicId?: string;
  width: number;
  height: number;
  aspectRatio: "portrait" | "square" | "landscape";
  caption: string;
  frameStyle: FrameStyle;
  date: string;
  location: string;
  album: string;
  tags: string[];
  order: number;
  isVisible: boolean;
  isFavorite: boolean;
  deletedAt?: string | null;
  createdAt: string;
}

export interface BirthdayPhoto {
  _id?: string;
  url: string;
  publicId?: string;
  width?: number;
  height?: number;
  alt: string;
  caption: string;
  galleryPhotoId?: string | null;
}

export type SectionKey = "hero" | "cake" | "photos" | "timeline" | "letter" | "reasons" | "wishes" | "ending";

export interface BirthdayPage {
  _id: string;
  slug: string;
  recipientName: string;
  nickname: string;
  birthdayDate: string;
  fromName: string;
  isPublished: boolean;
  isDefault: boolean;
  theme: { preset: string; mode: "light" | "dark"; primary: string; secondary: string; accent: string; background: string; cardStyle: "glass" | "clay" | "neumorphic" | "paper"; fontStyle: "romantic" | "playful" | "elegant" };
  effects: { flowers: boolean; hearts: boolean; butterflies: boolean; confetti: boolean; balloons: boolean; sparkles: boolean; intensity: "calm" | "lively" | "festive" };
  sections: { key: SectionKey; enabled: boolean }[];
  welcome: { title: string; message: string; buttonLabel: string };
  hero: { eyebrow: string; title: string; message: string };
  cake: { title: string; message: string; candles: number; celebrateMessage: string };
  photosTitle: string;
  photos: BirthdayPhoto[];
  timelineTitle: string;
  timeline: { label: string; title: string; body: string }[];
  letter: { title: string; greeting: string; paragraphs: string[]; signoff: string; signature: string };
  reasonsTitle: string;
  reasons: { title: string; body: string; icon?: string }[];
  wishesTitle: string;
  wishes: string[];
  ending: { title: string; message: string; buttonLabel: string; surpriseMessage: string };
  music: { url: string; publicId: string; title: string; artist: string; volume: number; loop: boolean };
  seoTitle: string;
  updatedAt: string;
  createdAt: string;
}

export interface BirthdaySummary {
  _id: string;
  slug: string;
  recipientName: string;
  birthdayDate: string;
  isPublished: boolean;
  isDefault: boolean;
  theme: { preset: string; primary: string; background: string };
  photoCount: number;
  cover: string | null;
  updatedAt: string;
}

export type GalleryVisibility = "draft" | "published" | "private";

/** A gallery page: an ordered selection of photos from the photo library. */
export interface GalleryDoc {
  _id: string;
  slug: string;
  title: string;
  kicker: string;
  intro: string;
  note: string;
  logoUrl: string;
  logoPublicId?: string;
  visibility: GalleryVisibility;
  shareKey: string;
  isDefault: boolean;
  photos: string[];
  coverPhoto: string | null;
  updatedAt: string;
  /** full photo documents, in gallery order (returned by GET /galleries/:id) */
  photoDocs?: GalleryPhoto[];
}

export interface GallerySummary {
  _id: string;
  slug: string;
  title: string;
  visibility: GalleryVisibility;
  isDefault: boolean;
  shareKey: string;
  photoCount: number;
  visibleCount: number;
  cover: string | null;
  updatedAt: string;
}
