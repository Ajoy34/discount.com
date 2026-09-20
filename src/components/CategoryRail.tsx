import Link from "next/link";
import {
  ShoppingBasket,
  Pill,
  Fish,
  Carrot,
  Wrench,
  PencilRuler,
  Plug,
  Shirt,
} from "lucide-react";
import { categories, type CategoryId } from "@/lib/data";
import { getTranslator, type Locale } from "@/lib/i18n";

const icons: Record<
  CategoryId,
  React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>
> = {
  grocery: ShoppingBasket,
  pharmacy: Pill,
  fish: Fish,
  vegetables: Carrot,
  hardware: Wrench,
  stationery: PencilRuler,
  electronics: Plug,
  clothing: Shirt,
};

const tints: Record<CategoryId, string> = {
  grocery: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  pharmacy: "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300",
  fish: "bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300",
  vegetables:
    "bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300",
  hardware: "bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300",
  stationery:
    "bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300",
  electronics:
    "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300",
  clothing: "bg-pink-50 text-pink-700 dark:bg-pink-950/50 dark:text-pink-300",
};

export default function CategoryRail({ locale }: { locale: Locale }) {
  const t = getTranslator(locale, "Category");

  return (
    <ul className="grid grid-cols-4 gap-3 sm:grid-cols-8">
      {categories.map((id) => {
        const Icon = icons[id];
        return (
          <li key={id}>
            <Link
              href={`/${locale}/search/?category=${id}`}
              className="card-interactive surface flex flex-col items-center gap-2 rounded-2xl px-2 py-4 text-center"
            >
              <span
                className={`grid h-11 w-11 place-items-center rounded-2xl ${tints[id]}`}
              >
                <Icon className="h-5 w-5" aria-hidden={true} />
              </span>
              <span className="line-clamp-1 text-[11px] font-bold sm:text-xs">
                {t(id)}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
