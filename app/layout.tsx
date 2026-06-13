import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

// Editorial display voice — the "design agency" register used for
// discovery headlines and the landing experience.
const editorial = Fraunces({
  subsets: ["latin"],
  variable: "--font-editorial",
  axes: ["opsz", "SOFT", "WONK"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "VertexOS — a design studio for local-business websites",
  description:
    "Brief the studio like a real agency. VertexOS turns a full discovery into a design brief, an industry-specific website, a visual editor, and an exportable Next.js project — with your own AI provider.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${sans.variable} ${mono.variable} ${editorial.variable} min-h-screen font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
