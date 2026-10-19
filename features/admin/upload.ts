"use client";

import { api, AdminError } from "./api";

export type UploadKind = "profile" | "resume" | "project" | "gallery" | "birthday" | "music";

export interface UploadedAsset {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  bytes?: number;
  format?: string;
  originalFilename?: string;
  resourceType?: string;
}

interface Signature {
  uploadUrl: string;
  fields: Record<string, string | number>;
  maxBytes: number;
  allowedFormats: string[] | null;
}

const ACCEPT: Record<UploadKind, string> = {
  profile: "image/jpeg,image/png,image/webp,image/avif",
  project: "image/jpeg,image/png,image/webp,image/avif,image/gif",
  gallery: "image/*",
  birthday: "image/*",
  resume: "application/pdf",
  music: "audio/mpeg,audio/mp4,audio/aac,audio/ogg,audio/wav,.mp3,.m4a",
};
export const acceptFor = (kind: UploadKind) => ACCEPT[kind];

const mb = (n: number) => `${Math.round(n / 1e6)} MB`;

/**
 * Signed direct upload: the server signs, the browser sends the file straight to
 * Cloudinary (the API secret never reaches the browser). Reports progress 0–1.
 */
export async function uploadFile(file: File, kind: UploadKind, onProgress?: (p: number) => void): Promise<UploadedAsset> {
  const sig = await api.post<Signature>("media/sign", { kind });
  if (file.size > sig.maxBytes) throw new AdminError(`"${file.name}" is ${mb(file.size)}. The limit is ${mb(sig.maxBytes)}.`, 413);
  if (kind === "resume" && file.type && file.type !== "application/pdf") throw new AdminError("Upload the résumé as a PDF.", 415);

  const form = new FormData();
  Object.entries(sig.fields).forEach(([k, v]) => form.append(k, String(v)));
  form.append("file", file);

  const result = await new Promise<Record<string, unknown>>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", sig.uploadUrl);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(e.loaded / e.total);
    xhr.onload = () => {
      let body: Record<string, unknown> = {};
      try {
        body = JSON.parse(xhr.responseText);
      } catch {
        /* non-JSON */
      }
      if (xhr.status >= 200 && xhr.status < 300) resolve(body);
      else {
        const msg = (body.error as { message?: string } | undefined)?.message || `Upload failed (${xhr.status})`;
        reject(new AdminError(/format/i.test(msg) ? `That file type isn't allowed here. ${msg}` : msg, xhr.status));
      }
    };
    xhr.onerror = () => reject(new AdminError("Upload interrupted. Check your connection and try again.", 0));
    xhr.send(form);
  });

  onProgress?.(1);
  return {
    url: String(result.secure_url),
    publicId: String(result.public_id),
    width: result.width as number | undefined,
    height: result.height as number | undefined,
    bytes: result.bytes as number | undefined,
    format: result.format as string | undefined,
    originalFilename: result.original_filename as string | undefined,
    resourceType: result.resource_type as string | undefined,
  };
}
