import type { Review } from "./data";

/**
 * There is no backend yet, so a review a visitor writes lives in their own
 * browser. Every accessor is defensive: private windows, blocked storage and
 * cleared site data all have to degrade to "no local reviews" rather than throw.
 */
const KEY = "discounty.reviews.v1";

type Store = Record<string, Review[]>;

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

export function localReviews(offerId: number): Review[] {
  const list = read()[String(offerId)];
  return Array.isArray(list) ? list : [];
}

export function addLocalReview(review: Review): Review[] {
  const store = read();
  const key = String(review.offerId);
  const next = [review, ...(store[key] ?? [])];
  store[key] = next;
  write(store);
  return next;
}

export function removeLocalReview(offerId: number, id: string): Review[] {
  const store = read();
  const key = String(offerId);
  const next = (store[key] ?? []).filter((r) => r.id !== id);
  store[key] = next;
  write(store);
  return next;
}

export function newReviewId(): string {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
