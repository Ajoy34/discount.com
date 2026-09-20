"use client";

import { useSyncExternalStore } from "react";
import {
  rewardsServerSnapshot,
  rewardsSnapshot,
  subscribeToRewards,
  type RewardState,
} from "@/lib/rewards";

/**
 * Reward progress lives in storage the server cannot see, so it is read as an
 * external store: no state written from an effect, and it stays in step across
 * tabs and across every component showing it.
 */
export function useRewards(): RewardState {
  return useSyncExternalStore(
    subscribeToRewards,
    rewardsSnapshot,
    rewardsServerSnapshot,
  );
}
