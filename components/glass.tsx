import { cn } from "@/lib/utils";

/**
 * Cinematic stage for the studio: a key overhead light, two slow-drifting
 * spatial light fields (aqua + spatial-blue), a faint engineering grid, and
 * a floor falloff so glass panels read as suspended above the scene.
 * Atmosphere only — every light source stays under ~6% so content leads.
 */
export function StudioBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none fixed inset-0 -z-10", className)}
    >
      {/* Drifting ambient light — the spatial-computing atmosphere. */}
      <div
        className="absolute -left-[10%] -top-[15%] h-[55vh] w-[55vh] animate-aurora-drift rounded-full opacity-70 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(110,231,210,0.07), transparent 65%)",
        }}
      />
      <div
        className="absolute -right-[8%] top-[8%] h-[50vh] w-[50vh] animate-aurora-drift rounded-full opacity-60 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(122,162,255,0.07), transparent 65%)",
          animationDelay: "-6s",
        }}
      />
      {/* Engineering grid — quiet, masked toward the top light. */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 0%, black 30%, transparent)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 70% at 50% 0%, black 30%, transparent)",
        }}
      />
      {/* floor falloff so panels read as floating */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
    </div>
  );
}

/** Mono eyebrow label above page titles. */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "font-mono text-[11px] uppercase tracking-[0.24em] text-white/30",
        className,
      )}
    >
      {children}
    </div>
  );
}
