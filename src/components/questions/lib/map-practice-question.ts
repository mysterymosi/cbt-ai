import { getQuestionSectionFromPayload } from "@/components/questions/lib/question-section";
import type { PracticeQuestion } from "@/components/practice/types";
import type { Json } from "@/types/database";

export type PracticeQuestionRow = Omit<PracticeQuestion, "section"> & {
  raw_payload: Json;
};

export function mapPracticeQuestion(row: PracticeQuestionRow): PracticeQuestion {
  const { raw_payload, ...question } = row;

  return {
    ...question,
    section: getQuestionSectionFromPayload(raw_payload),
  };
}
