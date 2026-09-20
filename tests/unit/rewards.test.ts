import { describe, expect, it } from "vitest";
import {
  BADGES,
  EMPTY_STATE,
  LEVELS,
  POINTS,
  earnedBadges,
  levelFor,
  levelProgress,
  nextLevel,
  type RewardState,
} from "@/lib/rewards";

const state = (overrides: Partial<RewardState> = {}): RewardState => ({
  ...EMPTY_STATE,
  ...overrides,
});

describe("points", () => {
  it("pays for every reason it lists", () => {
    for (const value of Object.values(POINTS)) {
      expect(value).toBeGreaterThan(0);
    }
  });

  it("pays most for reporting a discount that was not honoured", () => {
    // That report is the least comfortable and most valuable signal, so it
    // must never be worth less than confirming a discount did work.
    expect(POINTS.disputed).toBeGreaterThan(POINTS.honoured);
  });

  it("pays more for a review than for a passive visit", () => {
    expect(POINTS.review).toBeGreaterThan(POINTS.visit);
    expect(POINTS.review).toBeGreaterThan(POINTS.save);
  });
});

describe("levels", () => {
  it("starts at zero and rises without gaps", () => {
    expect(LEVELS[0].min).toBe(0);
    for (let i = 1; i < LEVELS.length; i++) {
      expect(LEVELS[i].min).toBeGreaterThan(LEVELS[i - 1].min);
    }
  });

  it("places a score in the highest level it has reached", () => {
    expect(levelFor(0).id).toBe("newcomer");
    expect(levelFor(49).id).toBe("newcomer");
    expect(levelFor(50).id).toBe("bronze");
    expect(levelFor(399).id).toBe("silver");
    expect(levelFor(400).id).toBe("gold");
    expect(levelFor(99999).id).toBe("platinum");
  });

  it("names the next level until there is none", () => {
    expect(nextLevel(0)?.id).toBe("bronze");
    expect(nextLevel(400)?.id).toBe("platinum");
    expect(nextLevel(1000)).toBeNull();
  });

  it("reports progress through the current level", () => {
    expect(levelProgress(0)).toBe(0);
    expect(levelProgress(25)).toBe(50);
    expect(levelProgress(50)).toBe(0);
    expect(levelProgress(1000)).toBe(100);
  });

  it("never reports progress outside nought to a hundred", () => {
    for (const points of [0, 1, 49, 50, 149, 399, 999, 1000, 5000]) {
      const value = levelProgress(points);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(100);
    }
  });
});

describe("badges", () => {
  it("gives a fresh visitor none of them", () => {
    expect(earnedBadges(EMPTY_STATE)).toEqual([]);
  });

  it("uses a positive target and a defined label for each", () => {
    const ids = BADGES.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const badge of BADGES) {
      expect(badge.target).toBeGreaterThan(0);
    }
  });

  it("unlocks the first review badge on one review", () => {
    const earned = earnedBadges(state({ reviews: 1 })).map((b) => b.id);
    expect(earned).toContain("firstReview");
    expect(earned).not.toContain("reviewer");
  });

  it("unlocks the regular reviewer badge at five", () => {
    const earned = earnedBadges(state({ reviews: 5 })).map((b) => b.id);
    expect(earned).toContain("reviewer");
  });

  it("unlocks truth teller on a single dispute", () => {
    expect(earnedBadges(state({ disputes: 1 })).map((b) => b.id)).toContain(
      "truthTeller",
    );
  });

  it("counts saves towards the collector badge", () => {
    const four = state({ saves: ["1", "2", "3", "4"] });
    const five = state({ saves: ["1", "2", "3", "4", "5"] });
    expect(earnedBadges(four).map((b) => b.id)).not.toContain("collector");
    expect(earnedBadges(five).map((b) => b.id)).toContain("collector");
  });

  it("counts distinct categories towards explorer", () => {
    const earned = earnedBadges(
      state({ categories: ["grocery", "pharmacy", "fish"] }),
    ).map((b) => b.id);
    expect(earned).toContain("explorer");
  });

  it("reports partial progress on a locked badge", () => {
    const badge = BADGES.find((b) => b.id === "collector")!;
    expect(badge.progress(state({ saves: ["1", "2"] }))).toBe(2);
  });

  it("can unlock every badge", () => {
    const complete = state({
      reviews: 10,
      disputes: 2,
      saves: ["1", "2", "3", "4", "5", "6"],
      categories: ["a", "b", "c", "d"],
      streak: 9,
    });
    expect(earnedBadges(complete)).toHaveLength(BADGES.length);
  });
});
