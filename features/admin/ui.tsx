"use client";

import React, { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Info, XCircle, ChevronUp, ChevronDown, Trash2, Plus, X } from "lucide-react";

/* ------------------------------------------------------------------ toasts */
type ToastKind = "ok" | "bad" | "info";
interface ToastItem {
  id: number;
  kind: ToastKind;
  text: string;
}
const ToastCtx = createContext<(kind: ToastKind, text: string) => void>(() => {});
export const useToast = () => {
  const push = useContext(ToastCtx);
  return { ok: (t: string) => push("ok", t), bad: (t: string) => push("bad", t), info: (t: string) => push("info", t) };
};

/* ------------------------------------------------------------------ confirm */
interface ConfirmOptions {
  title: string;
  body?: React.ReactNode;
  confirmLabel: string;
  danger?: boolean;
}
const ConfirmCtx = createContext<(o: ConfirmOptions) => Promise<boolean>>(async () => false);
export const useConfirm = () => useContext(ConfirmCtx);

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const push = useCallback((kind: ToastKind, text: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-3), { id, kind, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), kind === "bad" ? 7000 : 3800);
  }, []);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const [pending, setPending] = useState<(ConfirmOptions & { resolve: (v: boolean) => void }) | null>(null);
  const confirm = useCallback(
    (o: ConfirmOptions) =>
      new Promise<boolean>((resolve) => {
        setPending({ ...o, resolve });
      }),
    []
  );
  useEffect(() => {
    if (pending) dialogRef.current?.showModal();
  }, [pending]);
  const close = (v: boolean) => {
    pending?.resolve(v);
    dialogRef.current?.close();
    setPending(null);
  };

  return (
    <ToastCtx.Provider value={push}>
      <ConfirmCtx.Provider value={confirm}>
        {children}
        <div className="adm-toasts" role="status" aria-live="polite">
          {toasts.map((t) => (
            <div key={t.id} className={`adm-toast adm-toast--${t.kind}`}>
              {t.kind === "ok" ? <CheckCircle2 /> : t.kind === "bad" ? <XCircle /> : <Info />}
              <span>{t.text}</span>
            </div>
          ))}
        </div>
        <dialog ref={dialogRef} className="adm-dialog" onCancel={(e) => (e.preventDefault(), close(false))}>
          {pending && (
            <>
              <div className="adm-dialog__body">
                <h2 className="adm-dialog__title">{pending.title}</h2>
                {pending.body && <div className="adm-muted">{pending.body}</div>}
              </div>
              <div className="adm-dialog__foot">
                <button type="button" className="adm-btn" onClick={() => close(false)} autoFocus>
                  Cancel
                </button>
                <button type="button" className={`adm-btn ${pending.danger ? "adm-btn--danger-solid" : "adm-btn--primary"}`} onClick={() => close(true)}>
                  {pending.confirmLabel}
                </button>
              </div>
            </>
          )}
        </dialog>
      </ConfirmCtx.Provider>
    </ToastCtx.Provider>
  );
}

/* ------------------------------------------------------------------ layout */
export function PageHeader({ title, description, where, actions }: { title: string; description?: React.ReactNode; where?: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <header className="adm-head">
      <div>
        <h1 className="adm-head__title">{title}</h1>
        {description && <p className="adm-head__desc">{description}</p>}
        {where && <p className="adm-head__where">{where}</p>}
      </div>
      {actions && <div className="adm-head__actions">{actions}</div>}
    </header>
  );
}

export function Section({ title, description, actions, children, id }: { title: string; description?: React.ReactNode; actions?: React.ReactNode; children: React.ReactNode; id?: string }) {
  return (
    <section className="adm-section" id={id} aria-labelledby={id ? `${id}-t` : undefined}>
      <div className="adm-section__head">
        <div>
          <h2 className="adm-section__title" id={id ? `${id}-t` : undefined}>
            {title}
          </h2>
          {description && <p className="adm-section__desc">{description}</p>}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}

export function Note({ tone = "info", children }: { tone?: "info" | "warn" | "bad" | "ok"; children: React.ReactNode }) {
  return (
    <div className={`adm-note adm-note--${tone}`} role={tone === "bad" ? "alert" : undefined}>
      {tone === "ok" ? <CheckCircle2 /> : tone === "info" ? <Info /> : <AlertTriangle />}
      <div>{children}</div>
    </div>
  );
}

export function Empty({ title, children, action }: { title: string; children?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="adm-empty">
      <p className="adm-empty__title">{title}</p>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}

export function Skeleton({ h = 16, w = "100%", style }: { h?: number | string; w?: number | string; style?: React.CSSProperties }) {
  return <div className="adm-skel" style={{ height: h, width: w, ...style }} aria-hidden="true" />;
}

export function LoadingBlock({ rows = 4 }: { rows?: number }) {
  return (
    <div className="adm-stack" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} h={i === 0 ? 34 : 56} w={i === 0 ? "40%" : "100%"} />
      ))}
    </div>
  );
}

export function ErrorBlock({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  return (
    <Note tone="bad">
      <p>
        <b>Couldn&apos;t load this.</b> {error instanceof Error ? error.message : "Unknown error."}
      </p>
      {onRetry && (
        <p style={{ marginTop: "0.5rem" }}>
          <button type="button" className="adm-btn adm-btn--sm" onClick={onRetry}>
            Try again
          </button>
        </p>
      )}
    </Note>
  );
}

/* ------------------------------------------------------------------ buttons */
type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "quiet" | "danger" | "default";
  size?: "sm";
  loading?: boolean;
  icon?: React.ReactNode;
  iconOnly?: boolean;
};
export function Button({ variant = "default", size, loading, icon, iconOnly, children, className = "", disabled, ...rest }: BtnProps) {
  const cls = ["adm-btn", variant !== "default" && `adm-btn--${variant}`, size && `adm-btn--${size}`, iconOnly && "adm-btn--icon", className].filter(Boolean).join(" ");
  return (
    <button type="button" className={cls} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {loading ? <span className="adm-spin" aria-hidden="true" /> : icon}
      {iconOnly ? <span className="sr-only">{children}</span> : children}
    </button>
  );
}

/* ------------------------------------------------------------------ fields */
export function Field({
  label,
  hint,
  error,
  optional,
  children,
  className,
}: {
  label: string;
  hint?: React.ReactNode;
  error?: string;
  optional?: boolean;
  children: (id: string, describedBy?: string) => React.ReactNode;
  className?: string;
}) {
  const id = useId();
  const hintId = hint ? `${id}-h` : undefined;
  const errId = error ? `${id}-e` : undefined;
  return (
    <div className={`adm-field ${className || ""}`}>
      <label className="adm-label" htmlFor={id}>
        {label}
        {optional && <span className="adm-label__opt">optional</span>}
      </label>
      {children(id, [hintId, errId].filter(Boolean).join(" ") || undefined)}
      {hint && !error && (
        <p className="adm-hint" id={hintId}>
          {hint}
        </p>
      )}
      {error && (
        <p className="adm-error" id={errId}>
          {error}
        </p>
      )}
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  hint,
  error,
  optional,
  placeholder,
  type = "text",
  code,
  maxLength,
  className,
  required,
}: {
  label: string;
  value: string | undefined;
  onChange: (v: string) => void;
  hint?: React.ReactNode;
  error?: string;
  optional?: boolean;
  placeholder?: string;
  type?: string;
  code?: boolean;
  maxLength?: number;
  className?: string;
  required?: boolean;
}) {
  return (
    <Field label={label} hint={hint} error={error} optional={optional} className={className}>
      {(id, d) => (
        <input
          id={id}
          className={`adm-input${code ? " adm-input--code" : ""}`}
          type={type}
          value={value ?? ""}
          placeholder={placeholder}
          maxLength={maxLength}
          aria-describedby={d}
          aria-invalid={error ? true : undefined}
          required={required}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </Field>
  );
}

export function AutoTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight + 2, 640)}px`;
  }, [props.value]);
  return <textarea ref={ref} className="adm-textarea" rows={3} {...props} />;
}

export function TextArea({
  label,
  value,
  onChange,
  hint,
  error,
  optional,
  placeholder,
  maxLength,
  className,
}: {
  label: string;
  value: string | undefined;
  onChange: (v: string) => void;
  hint?: React.ReactNode;
  error?: string;
  optional?: boolean;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}) {
  return (
    <Field label={label} hint={hint} error={error} optional={optional} className={className}>
      {(id, d) => (
        <AutoTextarea id={id} value={value ?? ""} placeholder={placeholder} maxLength={maxLength} aria-describedby={d} aria-invalid={error ? true : undefined} onChange={(e) => onChange(e.target.value)} />
      )}
    </Field>
  );
}

export function Toggle({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) {
  return (
    <div>
      <label className="adm-toggle">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="adm-toggle__track" aria-hidden="true" />
        <span>{label}</span>
      </label>
      {hint && (
        <p className="adm-hint" style={{ marginTop: "0.25rem", marginLeft: "3rem" }}>
          {hint}
        </p>
      )}
    </div>
  );
}

export function Segmented<T extends string>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[]; label: string }) {
  return (
    <div className="adm-seg" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={value === o.value} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function SelectField<T extends string | number>({
  label,
  value,
  onChange,
  options,
  hint,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      {(id, d) => (
        <select
          id={id}
          className="adm-select"
          value={String(value)}
          aria-describedby={d}
          onChange={(e) => {
            const opt = options.find((o) => String(o.value) === e.target.value);
            if (opt) onChange(opt.value);
          }}
        >
          {options.map((o) => (
            <option key={String(o.value)} value={String(o.value)}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}

/* ------------------------------------------------------------------ list editors */
function moveItem<T>(arr: T[], from: number, to: number) {
  if (to < 0 || to >= arr.length) return arr;
  const copy = [...arr];
  const [x] = copy.splice(from, 1);
  copy.splice(to, 0, x);
  return copy;
}

export function ListControls({ index, length, onMove, onRemove, itemLabel }: { index: number; length: number; onMove: (to: number) => void; onRemove: () => void; itemLabel: string }) {
  return (
    <>
      <div className="adm-list__handle">
        <Button size="sm" variant="quiet" iconOnly icon={<ChevronUp />} disabled={index === 0} onClick={() => onMove(index - 1)}>
          {`Move ${itemLabel} up`}
        </Button>
        <Button size="sm" variant="quiet" iconOnly icon={<ChevronDown />} disabled={index === length - 1} onClick={() => onMove(index + 1)}>
          {`Move ${itemLabel} down`}
        </Button>
      </div>
    </>
  );
}

/** Editable list of short texts or paragraphs. */
export function StringList({
  label,
  hint,
  items,
  onChange,
  itemLabel = "item",
  multiline = false,
  addLabel,
  placeholder,
}: {
  label: string;
  hint?: string;
  items: string[] | undefined;
  onChange: (v: string[]) => void;
  itemLabel?: string;
  multiline?: boolean;
  addLabel?: string;
  placeholder?: string;
}) {
  const list = items ?? [];
  const headingId = useId();
  return (
    <div className="adm-field" role="group" aria-labelledby={headingId}>
      <p className="adm-label" id={headingId}>
        {label}
      </p>
      {hint && <p className="adm-hint">{hint}</p>}
      <div className="adm-list">
        {list.length === 0 && <p className="adm-list__empty">Nothing here yet.</p>}
        {list.map((value, i) => (
          <div className="adm-list__item adm-list__item--plain" key={i}>
            <ListControls index={i} length={list.length} itemLabel={itemLabel} onMove={(to) => onChange(moveItem(list, i, to))} onRemove={() => {}} />
            {multiline ? (
              <AutoTextarea aria-label={`${itemLabel} ${i + 1}`} value={value} placeholder={placeholder} onChange={(e) => onChange(list.map((v, j) => (j === i ? e.target.value : v)))} />
            ) : (
              <input className="adm-input" aria-label={`${itemLabel} ${i + 1}`} value={value} placeholder={placeholder} onChange={(e) => onChange(list.map((v, j) => (j === i ? e.target.value : v)))} />
            )}
            <Button size="sm" variant="quiet" iconOnly icon={<X />} onClick={() => onChange(list.filter((_, j) => j !== i))}>
              {`Remove ${itemLabel} ${i + 1}`}
            </Button>
          </div>
        ))}
      </div>
      <div>
        <Button size="sm" icon={<Plus />} onClick={() => onChange([...list, ""])}>
          {addLabel || `Add ${itemLabel}`}
        </Button>
      </div>
    </div>
  );
}

/** Editable list of structured items rendered by `render`. */
export function ObjectList<T>({
  label,
  hint,
  items,
  onChange,
  blank,
  render,
  itemLabel = "item",
  addLabel,
  hideAdd,
}: {
  label: string;
  hint?: string;
  items: T[] | undefined;
  onChange: (v: T[]) => void;
  hideAdd?: boolean;
  blank: () => T;
  render: (item: T, update: (patch: Partial<T>) => void, index: number) => React.ReactNode;
  itemLabel?: string;
  addLabel?: string;
}) {
  const list = items ?? [];
  const headingId = useId();
  return (
    <div className="adm-field" role="group" aria-labelledby={headingId}>
      <p className="adm-label" id={headingId}>
        {label}
      </p>
      {hint && <p className="adm-hint">{hint}</p>}
      <div className="adm-list">
        {list.length === 0 && <p className="adm-list__empty">Nothing here yet.</p>}
        {list.map((item, i) => (
          <div className="adm-list__item" key={i}>
            <ListControls index={i} length={list.length} itemLabel={itemLabel} onMove={(to) => onChange(moveItem(list, i, to))} onRemove={() => {}} />
            <div className="adm-list__body">{render(item, (patch) => onChange(list.map((v, j) => (j === i ? { ...v, ...patch } : v))), i)}</div>
            <Button size="sm" variant="quiet" iconOnly icon={<Trash2 />} onClick={() => onChange(list.filter((_, j) => j !== i))}>
              {`Remove ${itemLabel} ${i + 1}`}
            </Button>
          </div>
        ))}
      </div>
      {!hideAdd && (
        <div>
          <Button size="sm" icon={<Plus />} onClick={() => onChange([...list, blank()])}>
            {addLabel || `Add ${itemLabel}`}
          </Button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ save bar */
export function SaveBar({ dirty, saving, onSave, onDiscard, label = "You have unsaved changes" }: { dirty: boolean; saving: boolean; onSave: () => void; onDiscard: () => void; label?: string }) {
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s" && dirty) {
        e.preventDefault();
        onSave();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dirty, onSave]);
  return (
    <div className="adm-savebar" data-show={dirty || saving} aria-hidden={!dirty && !saving} inert={!dirty && !saving}>
      <span className="adm-savebar__text">{saving ? "Saving…" : label}</span>
      <Button variant="quiet" size="sm" onClick={onDiscard} disabled={saving}>
        Discard
      </Button>
      <Button variant="primary" size="sm" onClick={onSave} loading={saving}>
        Save changes
      </Button>
    </div>
  );
}

/** Local draft of server data with dirty tracking. */
/**
 * Editable copy of server data. Resets only when the server data's *content* changes, so a
 * caller passing a freshly built object on every render can't cause an update loop.
 */
export function useDraft<T>(source: T | undefined) {
  const key = source === undefined ? null : JSON.stringify(source);
  const [draft, setDraft] = useState<T | undefined>(() => (key === null ? undefined : (JSON.parse(key) as T)));
  const [base, setBase] = useState<string | null>(key);
  // Adjust state while rendering when the source content changes (React's recommended
  // pattern instead of an effect): runs once per distinct server value, never loops.
  if (key !== null && key !== base) {
    setBase(key);
    setDraft(JSON.parse(key) as T);
  }
  const dirty = draft !== undefined && base !== null && JSON.stringify(draft) !== base;
  const reset = () => setDraft(base === null ? undefined : (JSON.parse(base) as T));
  return { draft, setDraft, dirty, reset };
}

export const timeAgo = (iso?: string | null) => {
  if (!iso) return "";
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  if (s < 86400 * 7) return `${Math.floor(s / 86400)} d ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};
