"use client";

import { Star } from "lucide-react";

/**
 * Read-only display of a rating. Purely decorative to a screen reader, which
 * gets the number from the caller's own text instead of five icon names.
 */
export function Stars({
  value,
  className = "h-4 w-4",
}: {
  value: number;
  className?: string;
}) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`${className} ${
            n <= Math.round(value)
              ? "fill-accent-500 text-accent-500"
              : "text-[var(--border-subtle)]"
          }`}
        />
      ))}
    </span>
  );
}

/**
 * Editable rating, built as a radio group so it is reachable and operable with
 * arrow keys rather than being five unlabelled buttons.
 */
export function StarInput({
  name,
  value,
  onChange,
  legend,
  starLabel,
  starsLabel,
}: {
  name: string;
  value: number;
  onChange: (value: number) => void;
  legend: string;
  starLabel: string;
  starsLabel: string;
}) {
  return (
    <fieldset>
      <legend className="mb-1.5 block text-sm font-bold">{legend}</legend>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => {
          const id = `${name}-${n}`;
          return (
            <span key={n} className="relative">
              <input
                id={id}
                type="radio"
                name={name}
                value={n}
                checked={value === n}
                onChange={() => onChange(n)}
                className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
              <label
                htmlFor={id}
                className="block cursor-pointer rounded-md p-1 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-[var(--ring-focus)]"
              >
                <span className="sr-only">
                  {n} {n === 1 ? starLabel : starsLabel}
                </span>
                <Star
                  className={`h-7 w-7 transition-transform hover:scale-110 ${
                    n <= value
                      ? "fill-accent-500 text-accent-500"
                      : "text-[var(--border-subtle)]"
                  }`}
                  aria-hidden="true"
                />
              </label>
            </span>
          );
        })}
      </div>
    </fieldset>
  );
}
