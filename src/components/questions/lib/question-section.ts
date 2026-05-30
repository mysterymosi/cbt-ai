import type { AlocQuestionPayload } from "@/components/questions/lib/normalize-aloc-question";

export function getQuestionSectionFromPayload(rawPayload: unknown): string | null {
  if (!rawPayload || typeof rawPayload !== "object") {
    return null;
  }

  const section = (rawPayload as AlocQuestionPayload).section;

  if (typeof section !== "string") {
    return null;
  }

  const trimmed = section.trim();
  return trimmed || null;
}
