/**
 * Points, levels, badges and streaks.
 *
 * The rewards that pay out here are the ones the product can actually honour
 * without a backend or a partner: standing, badges and a place on the
 * contributor board. Points are earned for signals that make the site more
 * useful to other people — reviews, and especially saying when a discount was
 * not honoured — rather than for time spent.
 *
 * Progress lives in the visitor's own browser, so it is read through the same
 * subscribe/snapshot pattern the local reviews use.
 */

export type RewardReason =
  | "review"
  | "honoured"
  | "disputed"
  | "save"
  | "visit"
  | "streak";

export const POINTS: Record<RewardReason, number> = {
  review: 25,
  honoured: 10,
  // Reporting a discount that was not honoured is the most valuable and the
  // least comfortable thing a visitor can do, so it pays the most.
  disputed: 20,
  save: 5,
  visit: 5,
  streak: 5,
};

export interface Level {
  id: string;
  min: number;
}

export const LEVELS: Level[] = [
  { id: "newcomer", min: 0 },
  { id: "bronze", min: 50 },
  { id: "silver", min: 150 },
  { id: "gold", min: 400 },
  { id: "platinum", min: 1000 },
];

export interface BadgeDefinition {
  id: string;
  icon: "star" | "shield" | "flame" | "compass" | "bookmark" | "award";
  /** Progress target, for the "3 of 5" line under a locked badge. */
  target: number;
  progress: (state: RewardState) => number;
}

export interface RewardEntry {
  at: string;
  reason: RewardReason;
  points: number;
}

export interface RewardState {
  points: number;
  reviews: number;
  honoured: number;
  disputes: number;
  saves: string[];
  categories: string[];
  lastVisit: string | null;
  streak: number;
  history: RewardEntry[];
}

export const EMPTY_STATE: RewardState = {
  points: 0,
  reviews: 0,
  honoured: 0,
  disputes: 0,
  saves: [],
  categories: [],
  lastVisit: null,
  streak: 0,
  history: [],
};

export const BADGES: BadgeDefinition[] = [
  {
    id: "firstReview",
    icon: "star",
    target: 1,
    progress: (s) => s.reviews,
  },
  {
    id: "reviewer",
    icon: "award",
    target: 5,
    progress: (s) => s.reviews,
  },
  {
    id: "truthTeller",
    icon: "shield",
    target: 1,
    progress: (s) => s.disputes,
  },
  {
    id: "collector",
    icon: "bookmark",
    target: 5,
    progress: (s) => s.saves.length,
  },
  {
    id: "explorer",
    icon: "compass",
    target: 3,
    progress: (s) => s.categories.length,
  },
  {
    id: "regular",
    icon: "flame",
    target: 7,
    progress: (s) => s.streak,
  },
];

export function levelFor(points: number): Level {
  let current = LEVELS[0];
  for (const level of LEVELS) if (points >= level.min) current = level;
  return current;
}

export function nextLevel(points: number): Level | null {
  return LEVELS.find((l) => l.min > points) ?? null;
}

/** How far through the current level the visitor is, as a percentage. */
export function levelProgress(points: number): number {
  const current = levelFor(points);
  const next = nextLevel(points);
  if (!next) return 100;
  const span = next.min - current.min;
  if (span <= 0) return 100;
  return Math.min(100, Math.round(((points - current.min) / span) * 100));
}

export function earnedBadges(state: RewardState): BadgeDefinition[] {
  return BADGES.filter((b) => b.progress(state) >= b.target);
}

/* ------------------------------------------------------------------ */
/* Persistence                                                         */
/* ------------------------------------------------------------------ */

const KEY = "discounty.rewards.v1";
const listeners = new Set<() => void>();

let cachedRaw: string | null = null;
let cachedState: RewardState = EMPTY_STATE;

function emit(): void {
  for (const listener of listeners) listener();
}

export function subscribeToRewards(onChange: () => void): () => void {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function rawState(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function parse(raw: string | null): RewardState {
  if (!raw) return EMPTY_STATE;
  try {
    const parsed = JSON.parse(raw) as Partial<RewardState>;
    return {
      ...EMPTY_STATE,
      ...parsed,
      saves: Array.isArray(parsed.saves) ? parsed.saves : [],
      categories: Array.isArray(parsed.categories) ? parsed.categories : [],
      history: Array.isArray(parsed.history) ? parsed.history : [],
    };
  } catch {
    return EMPTY_STATE;
  }
}

/** Referentially stable while the stored string is unchanged. */
export function rewardsSnapshot(): RewardState {
  const raw = rawState();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedState = parse(raw);
  }
  return cachedState;
}

export function rewardsServerSnapshot(): RewardState {
  return EMPTY_STATE;
}

function persist(state: RewardState): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Blocked or full storage; progress simply is not kept.
  }
  cachedRaw = null;
  emit();
}

function award(
  state: RewardState,
  reason: RewardReason,
  multiplier = 1,
): RewardState {
  const points = POINTS[reason] * multiplier;
  return {
    ...state,
    points: state.points + points,
    history: [
      { at: new Date().toISOString(), reason, points },
      ...state.history,
    ].slice(0, 50),
  };
}

export function recordReview(options: {
  honoured: boolean;
  category: string;
}): RewardState {
  let next = rewardsSnapshot();
  next = award(next, "review");
  next = award(next, options.honoured ? "honoured" : "disputed");

  next = {
    ...next,
    reviews: next.reviews + 1,
    honoured: next.honoured + (options.honoured ? 1 : 0),
    disputes: next.disputes + (options.honoured ? 0 : 1),
    categories: next.categories.includes(options.category)
      ? next.categories
      : [...next.categories, options.category],
  };

  persist(next);
  return next;
}

export function toggleSave(offerId: number): RewardState {
  const state = rewardsSnapshot();
  const id = String(offerId);
  const saved = state.saves.includes(id);

  // Un-saving does not claw points back; that would punish tidying up.
  const next = saved
    ? { ...state, saves: state.saves.filter((s) => s !== id) }
    : { ...award(state, "save"), saves: [...state.saves, id] };

  persist(next);
  return next;
}

export function isSaved(state: RewardState, offerId: number): boolean {
  return state.saves.includes(String(offerId));
}

const dayInMs = 24 * 60 * 60 * 1000;
const today = () => new Date().toISOString().slice(0, 10);

/**
 * Credits one visit per day and extends the streak only when the last visit
 * was yesterday. Returns null when the visit was already counted, so callers
 * can tell "nothing happened" from "points awarded".
 */
export function recordVisit(): RewardState | null {
  const state = rewardsSnapshot();
  const day = today();
  if (state.lastVisit === day) return null;

  const consecutive =
    state.lastVisit !== null &&
    Date.parse(day) - Date.parse(state.lastVisit) <= dayInMs;

  const streak = consecutive ? state.streak + 1 : 1;
  let next = award(state, "visit");
  if (consecutive) next = award(next, "streak", Math.min(streak, 5));

  next = { ...next, lastVisit: day, streak };
  persist(next);
  return next;
}

export function resetRewards(): void {
  persist(EMPTY_STATE);
}
