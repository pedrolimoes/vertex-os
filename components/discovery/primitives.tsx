"use client";

import { useEffect, useRef, useState } from "react";
import { Check, HelpCircle, Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/* ==========================================================================
   Discovery field primitives — the form language of the briefing flow.
   Spacious, labeled, with contextual help. No cramped SaaS inputs.
   ========================================================================== */

export function HelpTip({ text }: { text: string }) {
  return (
    <span className="group/tip relative inline-flex">
      <HelpCircle className="h-3.5 w-3.5 cursor-help text-white/25 transition-colors group-hover/tip:text-white/60" />
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-60 -translate-x-1/2 rounded-lg border border-hairline-strong bg-[#16161a] px-3.5 py-2.5 text-[11px] font-normal normal-case leading-relaxed tracking-normal text-white/75 opacity-0 shadow-glass-lg transition-opacity duration-150 group-hover/tip:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}

export function Field({
  label,
  help,
  optional,
  children,
  className,
}: {
  label: string;
  help?: string;
  optional?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2.5", className)}>
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-medium text-white/80">{label}</span>
        {optional && (
          <span className="font-mono text-[10px] uppercase tracking-wider text-white/25">
            optional
          </span>
        )}
        {help && <HelpTip text={help} />}
      </div>
      {children}
    </div>
  );
}

export function TextField({
  label,
  help,
  optional,
  value,
  onChange,
  placeholder,
  className,
}: {
  label: string;
  help?: string;
  optional?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <Field label={label} help={help} optional={optional} className={className}>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 text-[14px]"
      />
    </Field>
  );
}

export function TextAreaField({
  label,
  help,
  optional,
  value,
  onChange,
  placeholder,
  rows = 3,
  className,
}: {
  label: string;
  help?: string;
  optional?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}) {
  return (
    <Field label={label} help={help} optional={optional} className={className}>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="text-[14px] leading-relaxed"
      />
    </Field>
  );
}

/* ---------- Chip selection (single + multi) ---------- */

export function ChipGroup<T extends string>({
  options,
  value,
  onChange,
  multiple = false,
}: {
  options: readonly { id: T; name: string; blurb?: string }[] | readonly T[];
  value: T[] | T;
  onChange: (next: T[] | T) => void;
  multiple?: boolean;
}) {
  const normalized = options.map((o) =>
    typeof o === "string" ? { id: o, name: o, blurb: undefined } : o,
  );
  const selected = Array.isArray(value) ? value : [value];

  const toggle = (id: T) => {
    if (multiple) {
      const arr = value as T[];
      onChange(arr.includes(id) ? arr.filter((v) => v !== id) : [...arr, id]);
    } else {
      onChange(id);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {normalized.map((o) => {
        const active = selected.includes(o.id);
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => toggle(o.id)}
            className={cn(
              "cursor-pointer rounded-full border px-4 py-2 text-[13px] transition-all duration-150",
              active
                ? "border-accent/50 bg-accent-dim text-white shadow-[0_0_20px_-8px_rgba(110,231,210,0.4)]"
                : "border-hairline bg-white/[0.02] text-white/55 hover:border-hairline-strong hover:text-white/85",
            )}
          >
            {o.name}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Yes / No question row ---------- */

export function YesNoRow({
  question,
  help,
  value,
  onChange,
}: {
  question: string;
  help?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div className="flex items-center gap-2">
        <span className="text-[13px] text-white/75">{question}</span>
        {help && <HelpTip text={help} />}
      </div>
      <div className="flex shrink-0 items-center rounded-full border border-hairline bg-black/25 p-0.5">
        {([true, false] as const).map((v) => (
          <button
            key={String(v)}
            type="button"
            onClick={() => onChange(v)}
            className={cn(
              "cursor-pointer rounded-full px-3.5 py-1 text-[11px] font-semibold transition-all duration-150",
              value === v
                ? "bg-white text-ink shadow-btn"
                : "text-white/40 hover:text-white/70",
            )}
          >
            {v ? "Yes" : "No"}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- Larger selectable cards (personalities, design systems, goals, pages) ---------- */

export function OptionCard({
  name,
  blurb,
  active,
  onClick,
  swatch,
  badge,
}: {
  name: string;
  blurb?: string;
  active: boolean;
  onClick: () => void;
  swatch?: { bg: string; fg: string; accent: string };
  badge?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative cursor-pointer rounded-xl border p-4 text-left transition-all duration-200",
        active
          ? "border-accent/50 bg-accent-dim shadow-[0_0_28px_-10px_rgba(110,231,210,0.35)]"
          : "border-hairline bg-white/[0.02] hover:border-hairline-strong hover:bg-white/[0.045]",
      )}
    >
      {swatch && (
        <span
          className="mb-3 flex h-8 w-full items-center justify-between rounded-lg border border-white/10 px-2.5"
          style={{ backgroundColor: swatch.bg }}
        >
          <span className="text-[10px] font-bold" style={{ color: swatch.fg }}>
            Aa
          </span>
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: swatch.accent }} />
        </span>
      )}
      <span className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "text-[13px] font-semibold transition-colors",
            active ? "text-white" : "text-white/75 group-hover:text-white",
          )}
        >
          {name}
        </span>
        {active ? (
          <Check className="h-3.5 w-3.5 shrink-0 text-accent" />
        ) : badge ? (
          <span className="shrink-0 font-mono text-[9px] uppercase tracking-wider text-white/25">
            {badge}
          </span>
        ) : null}
      </span>
      {blurb && <span className="mt-1 block text-[11px] leading-relaxed text-white/35">{blurb}</span>}
    </button>
  );
}

/* ---------- Color input ---------- */

export function ColorField({
  label,
  help,
  value,
  onChange,
}: {
  label: string;
  help?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Field label={label} help={help}>
      <div className="flex h-11 items-center gap-3 rounded-lg border border-hairline bg-black/25 px-3 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
        <input
          type="color"
          aria-label={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-6 w-9 cursor-pointer rounded border-none bg-transparent"
        />
        <span className="font-mono text-[12px] text-white/45">{value}</span>
      </div>
    </Field>
  );
}

/* ---------- Upload tiles ---------- */

export function UploadTile({
  label,
  help,
  accept = "image/*",
  multiple = false,
  fileNames,
  preview,
  onFiles,
  onClear,
}: {
  label: string;
  help?: string;
  accept?: string;
  multiple?: boolean;
  fileNames: string[];
  /** Optional image preview (e.g. uploaded logo). */
  preview?: string;
  onFiles: (files: File[]) => void;
  onClear: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const has = fileNames.length > 0;

  return (
    <Field label={label} help={help} optional>
      <input
        ref={ref}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) onFiles(files);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const files = Array.from(e.dataTransfer.files);
          if (files.length) onFiles(files);
        }}
        className={cn(
          "flex w-full cursor-pointer items-center gap-3.5 rounded-xl border border-dashed px-4 py-4 text-left transition-all duration-150",
          dragging
            ? "border-accent/60 bg-accent-dim"
            : has
              ? "border-hairline-strong bg-white/[0.03]"
              : "border-hairline bg-black/15 hover:border-hairline-strong",
        )}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="h-9 w-9 rounded-lg border border-hairline object-contain" />
        ) : (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-hairline bg-black/25">
            <Upload className="h-4 w-4 text-white/35" />
          </span>
        )}
        <span className="min-w-0 flex-1">
          {has ? (
            <span className="block truncate text-[12px] text-white/75">
              {fileNames.slice(0, 2).join(", ")}
              {fileNames.length > 2 ? ` +${fileNames.length - 2} more` : ""}
            </span>
          ) : (
            <span className="block text-[12px] text-white/45">
              Drop {multiple ? "files" : "a file"} or click to browse
            </span>
          )}
        </span>
        {has && (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
                onClear();
              }
            }}
            aria-label={`Clear ${label}`}
            className="cursor-pointer rounded-md p-1.5 text-white/30 transition-colors hover:bg-white/[0.07] hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </span>
        )}
      </button>
    </Field>
  );
}

/* ---------- List input (one item per line, renders as tags) ---------- */

export function ListField({
  label,
  help,
  optional,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  help?: string;
  optional?: boolean;
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [text, setText] = useState(value.join("\n"));
  const lastEmitted = useRef(value.join("\n"));

  // Resync when the value changes externally (draft load, template prefill)
  // without clobbering in-progress typing.
  useEffect(() => {
    const joined = value.join("\n");
    if (joined !== lastEmitted.current) {
      setText(joined);
      lastEmitted.current = joined;
    }
  }, [value]);

  return (
    <Field label={label} help={help} optional={optional}>
      <Textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          const list = e.target.value
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean);
          lastEmitted.current = list.join("\n");
          onChange(list);
        }}
        rows={4}
        placeholder={placeholder}
        className="font-mono text-[13px] leading-relaxed"
      />
      <p className="text-[11px] text-white/25">One per line.</p>
    </Field>
  );
}
