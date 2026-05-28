"use client";

import { useEffect, useRef } from "react";
import type { AnalyticsEvent } from "@/lib/analytics/events";
import { trackEvent } from "@/lib/analytics/track";

type TrackOnceProps = {
  event: AnalyticsEvent;
  properties?: Record<string, string | number | boolean>;
};

export function TrackOnce({ event, properties }: TrackOnceProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) {
      return;
    }

    tracked.current = true;
    trackEvent(event, properties);
  }, [event, properties]);

  return null;
}
