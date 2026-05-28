import { track } from "@vercel/analytics/server";
import type { AnalyticsEvent } from "@/lib/analytics/events";

export async function trackServerEvent(
  name: AnalyticsEvent,
  properties?: Record<string, string | number | boolean | null | undefined>,
) {
  await track(name, properties);
}
