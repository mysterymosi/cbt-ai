"use client";

import { track } from "@vercel/analytics";
import type { AnalyticsEvent } from "@/lib/analytics/events";

export function trackEvent(
  name: AnalyticsEvent,
  properties?: Record<string, string | number | boolean>,
) {
  track(name, properties);
}
