import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";

/**
 * Demo websites get their own typography, distinct from the studio's Geist:
 * Bricolage Grotesque for display (characterful, confident — right for a
 * trade business) and Instrument Sans for body copy.
 */
const demoDisplay = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-demo-display",
});

const demoBody = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-demo-body",
});

export default function TemplatesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`${demoDisplay.variable} ${demoBody.variable}`}>{children}</div>
  );
}
