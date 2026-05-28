import type { PracticeRecommendation } from "@/components/progress/types";
import { getSubjectLabel } from "@/lib/constants/subjects";

export function buildPracticeRecommendation({
  sessionSubject,
  weakestSubject,
  conceptTags,
}: {
  sessionSubject: string;
  weakestSubject: string | null;
  conceptTags: string[];
}): PracticeRecommendation {
  const subject = weakestSubject ?? sessionSubject;
  const count = 10 as const;
  const label = getSubjectLabel(subject);

  if (weakestSubject && weakestSubject !== sessionSubject) {
    return {
      subject,
      count,
      reason: `Your recent accuracy is lower in ${label}. A short follow-up set can help strengthen that area.`,
      href: `/practice?subject=${subject}&count=${count}`,
    };
  }

  if (conceptTags.length) {
    const topics = conceptTags.slice(0, 2).join(", ");
    return {
      subject,
      count,
      reason: `Review ${topics} with another ${count}-question ${label} set.`,
      href: `/practice?subject=${subject}&count=${count}`,
    };
  }

  return {
    subject,
    count,
    reason: `Keep momentum in ${label} with another focused ${count}-question set.`,
    href: `/practice?subject=${subject}&count=${count}`,
  };
}
