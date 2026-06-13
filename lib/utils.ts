import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** WCAG relative luminance of a hex color (#rgb or #rrggbb). */
export function relativeLuminance(hex: string): number {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(full.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two hex colors. */
export function contrastRatio(aHex: string, bHex: string): number {
  const a = relativeLuminance(aHex);
  const b = relativeLuminance(bHex);
  const [hi, lo] = a >= b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

/** Linear mix of two hex colors; t=0 returns `from`, t=1 returns `to`. */
function mixHex(from: string, to: string, t: number): string {
  const parse = (hex: string) => {
    const h = hex.replace("#", "");
    const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
  };
  const [f, g] = [parse(from), parse(to)];
  return (
    "#" +
    f
      .map((c, i) =>
        Math.round(c + (g[i] - c) * t)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}

/**
 * Returns the accent color adjusted (mixed toward black or white) until it
 * reads at >= 3:1 against the given page background. Keeps user brand colors
 * usable as text/icon accents on any surface.
 */
export function readableAccentOn(
  accentHex: string,
  bgHex: string,
  minRatio = 3,
): string {
  try {
    if (contrastRatio(accentHex, bgHex) >= minRatio) return accentHex;
    const target = relativeLuminance(bgHex) > 0.5 ? "#0a0a0c" : "#ffffff";
    for (let t = 0.1; t <= 1; t += 0.1) {
      const candidate = mixHex(accentHex, target, t);
      if (contrastRatio(candidate, bgHex) >= minRatio) return candidate;
    }
    return target;
  } catch {
    return accentHex;
  }
}

/**
 * Picks a text color that passes contrast on the given background.
 * User-supplied brand colors can be anything, so every surface that uses one
 * as a background must derive its text color from this — never hardcode
 * white or black next to a brand background.
 */
export function readableTextOn(
  bgHex: string,
  dark = "#0a0a0c",
  light = "#ffffff",
): string {
  try {
    // Contrast ratio against white vs. black; pick the stronger side.
    const L = relativeLuminance(bgHex);
    const contrastWithLight = (1.0 + 0.05) / (L + 0.05);
    const contrastWithDark = (L + 0.05) / 0.05;
    return contrastWithDark >= contrastWithLight ? dark : light;
  } catch {
    return light;
  }
}
