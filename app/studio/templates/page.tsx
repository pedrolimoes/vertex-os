"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { TemplateCard } from "@/components/ds/template-card";
import { Eyebrow } from "@/components/glass";
import { TEMPLATES, SITE_STYLES } from "@/lib/templates";

export default function TemplatesPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <Eyebrow>Templates</Eyebrow>
          <h1 className="mt-1.5 font-display text-lg font-semibold tracking-tight text-white">
            Industry presets
          </h1>
          <p className="mt-2.5 max-w-lg text-sm leading-relaxed text-white/45">
            Each preset seeds the generator with services, palette, tone, and one
            of {SITE_STYLES.length} design systems — and ships with a live
            Liquid Glass demo website you can open right now.
          </p>
        </div>
        <Link
          href="/templates"
          className="flex cursor-pointer items-center gap-1.5 font-mono text-[11px] text-white/35 transition-colors hover:text-accent"
        >
          browse live demo sites <ArrowUpRight className="h-3 w-3" />
        </Link>
      </motion.header>

      <div className="mt-7 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.04 * i,
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <TemplateCard
              template={t}
              href={`/studio/generator?template=${t.id}`}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
