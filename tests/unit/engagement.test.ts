import { describe, expect, it } from "vitest";
import {
  averageRating,
  bidToBeat,
  getOffer,
  getShop,
  leaderboard,
  offerSignals,
  offers,
  rankedLeaderboard,
  reviews,
  reviewsForOffer,
  trendingScore,
  trustScore,
} from "@/lib/data";

describe("reviews", () => {
  it("gives every review a unique id and a real offer", () => {
    const ids = reviews.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const review of reviews) {
      expect(getOffer(review.offerId)).toBeDefined();
    }
  });

  it("keeps ratings within one to five", () => {
    for (const review of reviews) {
      expect(review.rating).toBeGreaterThanOrEqual(1);
      expect(review.rating).toBeLessThanOrEqual(5);
      expect(Number.isInteger(review.rating)).toBe(true);
    }
  });

  it("carries an author, a body and an ISO date", () => {
    for (const review of reviews) {
      expect(review.author.trim()).not.toBe("");
      expect(review.body.trim().length).toBeGreaterThan(10);
      expect(review.postedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("returns only that offer's reviews", () => {
    for (const offer of offers) {
      for (const review of reviewsForOffer(offer.id)) {
        expect(review.offerId).toBe(offer.id);
      }
    }
  });

  it("averages the ratings it was given", () => {
    const offerId = reviews[0].offerId;
    const own = reviewsForOffer(offerId);
    const expected = own.reduce((s, r) => s + r.rating, 0) / own.length;
    expect(averageRating(offerId)).toBeCloseTo(expected, 5);
  });

  it("folds locally written reviews into the average", () => {
    const offerId = reviews[0].offerId;
    const base = averageRating(offerId);
    const extra = { ...reviews[0], id: "local-x", rating: 1 };
    expect(averageRating(offerId, [extra])).toBeLessThan(base);
  });

  it("reports zero for an offer nobody has reviewed", () => {
    expect(averageRating(99999)).toBe(0);
  });
});

describe("trust score", () => {
  it("is the share of reviewers who said the discount held", () => {
    for (const offer of offers) {
      const { confirmed, disputed } = offerSignals(offer.id);
      const total = confirmed + disputed;
      if (total === 0) continue;
      expect(trustScore(offer.id)).toBe(
        Math.round((confirmed / total) * 100),
      );
    }
  });

  it("stays within nought to a hundred", () => {
    for (const offer of offers) {
      expect(trustScore(offer.id)).toBeGreaterThanOrEqual(0);
      expect(trustScore(offer.id)).toBeLessThanOrEqual(100);
    }
  });

  it("does not flatter an offer nobody has vouched for", () => {
    // Zero of zero must not read as a perfect record.
    expect(trustScore(99999)).toBe(0);
  });

  it("ranks the disputed hilsa offer below the confirmed pharmacy one", () => {
    expect(trustScore(3)).toBeLessThan(trustScore(2));
  });
});

describe("trending score", () => {
  it("rewards offers people actually act on", () => {
    // Offer 2 has the most claims and saves of any offer.
    const scores = offers.map((o) => ({ id: o.id, score: trendingScore(o.id) }));
    const top = [...scores].sort((a, b) => b.score - a.score)[0];
    expect(top.id).toBe(2);
  });

  it("is never negative", () => {
    for (const offer of offers) {
      expect(trendingScore(offer.id)).toBeGreaterThanOrEqual(0);
    }
  });

  it("penalises an offer whose discount is disputed", () => {
    // Offer 3 outranks offer 5 on raw reach but is disputed seven times.
    const raw3 = offerSignals(3);
    const raw5 = offerSignals(5);
    expect(raw3.views).toBeGreaterThan(raw5.views);
    expect(raw3.claims).toBeGreaterThan(raw5.claims);
    // Trust drags it down, so the gap is much smaller than reach alone implies.
    const reachRatio = raw3.claims / raw5.claims;
    const trendRatio = trendingScore(3) / trendingScore(5);
    expect(trendRatio).toBeLessThan(reachRatio);
  });
});

describe("leaderboard", () => {
  it("lists each shop once, and each shop exists", () => {
    const ids = leaderboard.map((e) => e.shopId);
    expect(new Set(ids).size).toBe(ids.length);
    for (const entry of leaderboard) {
      expect(getShop(entry.shopId)).toBeDefined();
    }
  });

  it("ranks strictly by bid, highest first", () => {
    const ranked = rankedLeaderboard();
    for (let i = 1; i < ranked.length; i++) {
      expect(ranked[i - 1].bid).toBeGreaterThanOrEqual(ranked[i].bid);
    }
  });

  it("numbers ranks from one with no gaps", () => {
    const ranked = rankedLeaderboard();
    expect(ranked.map((r) => r.rank)).toEqual(
      ranked.map((_, i) => i + 1),
    );
  });

  it("reports movement as the change from the previous cycle", () => {
    for (const row of rankedLeaderboard()) {
      expect(row.movement).toBe(row.previousRank - row.rank);
    }
  });

  it("puts the highest bidder first even though it is not the top rated", () => {
    // Placement is bought; it must not silently follow quality instead.
    const ranked = rankedLeaderboard();
    const highestBid = Math.max(...leaderboard.map((e) => e.bid));
    expect(ranked[0].bid).toBe(highestBid);
  });

  it("asks for more than the current top bid to take first place", () => {
    expect(bidToBeat()).toBeGreaterThan(rankedLeaderboard()[0].bid);
  });

  it("uses positive bids only", () => {
    for (const entry of leaderboard) {
      expect(entry.bid).toBeGreaterThan(0);
    }
  });
});
