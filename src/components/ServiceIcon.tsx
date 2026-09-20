import { Megaphone, Sparkles, Globe, BookOpen } from "lucide-react";
import type { ConsultancyService } from "@/lib/data";

const glyphs = {
  megaphone: Megaphone,
  sparkles: Sparkles,
  globe: Globe,
  book: BookOpen,
} as const;

const accents: Record<ConsultancyService["accent"], string> = {
  orange:
    "bg-accent-50 text-accent-600 dark:bg-accent-900/40 dark:text-accent-300",
  violet:
    "bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300",
  sky: "bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-300",
  emerald:
    "bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-300",
};

export default function ServiceIcon({
  icon,
  accent,
  className = "h-12 w-12",
}: {
  icon: ConsultancyService["icon"];
  accent: ConsultancyService["accent"];
  className?: string;
}) {
  const Glyph = glyphs[icon];
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-2xl ${accents[accent]} ${className}`}
    >
      <Glyph className="h-5 w-5" aria-hidden="true" />
    </span>
  );
}
