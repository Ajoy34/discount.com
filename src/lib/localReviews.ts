import type { Review } from "./data";

/**
 * There is no backend yet, so a review a visitor writes lives in their own
 * browser. Every accessor is defensive: private windows, blocked storage and
 * cleared site data all have to degrade to "no local reviews" rather than throw.
 */
const KEY = "discounty.reviews.v1";

type Store = Record<string, Review[]>;

const listeners = new Set<() => void>();

/**
 * Snapshots have to be referentially stable or useSyncExternalStore will spin,
 * so the parsed store is cached against the raw string it came from.
 */
let cachedRaw: string | null = null;
let cachedStore: Store = {};
const EMPTY: Review[] = [];

function emit(): void {
  for (const listener of listeners) listener();
}

/** Subscribes to local review changes, including edits in another tab. */
export function subscribeToLocalReviews(onChange: () => void): () => void {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function localReviewsSnapshot(offerId: number): Review[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    raw = null;
  }

  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedStore = read();
  }

  const list = cachedStore[String(offerId)];
  return Array.isArray(list) ? list : EMPTY;
}

/** The server has no storage, so it always sees an empty list. */
export function localReviewsServerSnapshot(): Review[] {
  return EMPTY;
}

function read(): Store {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as Store;
  } catch {
    return {};
  }
}

function write(store: Store): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    // Storage full or blocked; the review simply is not remembered.
  }
}

export function addLocalReview(review: Review): Review[] {
  const store = read();
  const key = String(review.offerId);
  const next = [review, ...(store[key] ?? [])];
  store[key] = next;
  write(store);
  cachedRaw = null;
  emit();
  return next;
}

export function removeLocalReview(offerId: number, id: string): Review[] {
  const store = read();
  const key = String(offerId);
  const next = (store[key] ?? []).filter((r) => r.id !== id);
  store[key] = next;
  write(store);
  cachedRaw = null;
  emit();
  return next;
}

export function newReviewId(): string {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
