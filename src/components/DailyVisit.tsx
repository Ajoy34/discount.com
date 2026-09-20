"use client";

import { useEffect } from "react";
import { recordVisit } from "@/lib/rewards";

/**
 * Credits the once-a-day visit and extends the streak. It renders nothing and
 * lives in the layout, because the visit is the one reward earned by arriving
 * rather than by doing something, and it must not depend on any single
 * component being on screen.
 */
export default function DailyVisit() {
  useEffect(() => {
    recordVisit();
  }, []);

  return null;
}
