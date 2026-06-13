import { cn } from "@/lib/utils";

/** Keyboard shortcut chip, Raycast-style. */
export function Kbd({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <kbd
      className={cn(
        "inline-flex h-[18px] min-w-[18px] items-center justify-center rounded border border-hairline bg-white/[0.05] px-1 font-mono text-[10px] font-medium text-white/40 shadow-[inset_0_-1px_0_rgba(0,0,0,0.4)]",
        className,
      )}
    >
      {children}
    </kbd>
  );
}
