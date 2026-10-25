"use client";

import React, { useRef, useState } from "react";
import { ImagePlus, RefreshCw, Trash2, UploadCloud } from "lucide-react";
import { acceptFor, uploadFile, type UploadedAsset, type UploadKind } from "./upload";
import { Button, useToast } from "./ui";
import { errorMessage } from "./api";

export interface ImageValue {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  publicId?: string;
  caption?: string;
}

/** Shows a progress bar while uploading a single file. */
export function useUploader(kind: UploadKind) {
  const [progress, setProgress] = useState<number | null>(null);
  const toast = useToast();
  const upload = async (file: File): Promise<UploadedAsset | null> => {
    setProgress(0);
    try {
      return await uploadFile(file, kind, setProgress);
    } catch (err) {
      toast.bad(errorMessage(err));
      return null;
    } finally {
      setProgress(null);
    }
  };
  return { upload, progress, busy: progress !== null };
}

export function Progress({ value }: { value: number }) {
  return (
    <div className="adm-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value * 100)} aria-label="Upload progress">
      <span style={{ width: `${Math.round(value * 100)}%` }} />
    </div>
  );
}

/** Drop zone / file picker. */
export function DropZone({
  kind,
  multiple,
  onFiles,
  label,
  hint,
  disabled,
}: {
  kind: UploadKind;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  label: string;
  hint?: string;
  disabled?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  return (
    <div
      className="adm-drop"
      data-over={over}
      role="button"
      tabIndex={0}
      aria-disabled={disabled}
      onClick={() => !disabled && input.current?.click()}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), !disabled && input.current?.click())}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        if (disabled) return;
        const files = Array.from(e.dataTransfer.files);
        if (files.length) onFiles(multiple ? files : files.slice(0, 1));
      }}
    >
      <UploadCloud aria-hidden="true" />
      <span>
        <b>{label}</b>
      </span>
      {hint && <span className="adm-small adm-muted">{hint}</span>}
      <input
        ref={input}
        type="file"
        hidden
        accept={acceptFor(kind)}
        multiple={multiple}
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          e.target.value = "";
          if (files.length) onFiles(files);
        }}
      />
    </div>
  );
}

/** Single image with upload / replace / remove and alt text. */
export function ImageField({
  label,
  value,
  onChange,
  kind = "project",
  hint,
  wide,
  removable = true,
  withCaption,
  withAlt = true,
}: {
  label: string;
  value: ImageValue | undefined | null;
  onChange: (v: ImageValue | null) => void;
  kind?: UploadKind;
  hint?: string;
  wide?: boolean;
  removable?: boolean;
  withCaption?: boolean;
  /** false for purely decorative images (e.g. a logo next to the visible name) */
  withAlt?: boolean;
}) {
  const { upload, progress, busy } = useUploader(kind);
  const input = useRef<HTMLInputElement>(null);
  const pick = () => input.current?.click();
  const onFile = async (file: File) => {
    const asset = await upload(file);
    if (asset) onChange({ src: asset.url, publicId: asset.publicId, width: asset.width || 1200, height: asset.height || 800, alt: value?.alt || "", caption: value?.caption });
  };

  return (
    <div className="adm-field">
      <p className="adm-label">{label}</p>
      {hint && <p className="adm-hint">{hint}</p>}
      <div className="adm-imgfield">
        <div className={`adm-thumb adm-imgfield__preview${wide ? " adm-imgfield__preview--wide" : ""}`}>
          {value?.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value.src} alt="" />
          ) : (
            <button type="button" onClick={pick} className="adm-drop" style={{ height: "100%", width: "100%", border: 0 }} aria-label={`Upload ${label.toLowerCase()}`}>
              <ImagePlus aria-hidden="true" />
            </button>
          )}
        </div>
        <div className="adm-stack" style={{ gap: "0.6rem" }}>
          {busy && progress !== null && <Progress value={progress} />}
          <div className="adm-row">
            <Button size="sm" icon={value?.src ? <RefreshCw /> : <ImagePlus />} onClick={pick} loading={busy}>
              {value?.src ? "Replace image" : "Upload image"}
            </Button>
            {removable && value?.src && (
              <Button size="sm" variant="quiet" icon={<Trash2 />} onClick={() => onChange(null)}>
                Remove
              </Button>
            )}
          </div>
          {value?.src && (
            <>
              {withAlt && (
                <input
                  className="adm-input"
                  aria-label="Image description for screen readers"
                  placeholder="Describe the image (for screen readers)"
                  value={value.alt || ""}
                  onChange={(e) => onChange({ ...value, alt: e.target.value })}
                />
              )}
              {withCaption && (
                <input className="adm-input" aria-label="Caption" placeholder="Caption (optional)" value={value.caption || ""} onChange={(e) => onChange({ ...value, caption: e.target.value })} />
              )}
              {value.width && value.height && (
                <p className="adm-hint">
                  {value.width} × {value.height}px
                </p>
              )}
            </>
          )}
        </div>
      </div>
      <input
        ref={input}
        type="file"
        hidden
        accept={acceptFor(kind)}
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (f) onFile(f);
        }}
      />
    </div>
  );
}
