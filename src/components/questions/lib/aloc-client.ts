import { toAlocSubject } from "@/components/questions/lib/map-exam-subject";
import {
  normalizeAlocQuestion,
  type AlocQuestionPayload,
  type NormalizedQuestion,
} from "@/components/questions/lib/normalize-aloc-question";
import { env } from "@/env";

const ALOC_BASE_URL = "https://questions.aloc.com.ng/api/v2";
const MAX_SEVERAL_QUESTIONS = 40;
const MAX_MANY_QUESTIONS = 120;
const DEFAULT_PREFETCH_COUNT = 100;

type AlocResponse = {
  data?: unknown;
  questions?: unknown;
  result?: unknown;
  results?: unknown;
  [key: string]: unknown;
};

function isQuestionPayloadArray(
  value: unknown,
): value is AlocQuestionPayload[] {
  return Array.isArray(value);
}

function extractQuestions(payload: AlocResponse): AlocQuestionPayload[] {
  const candidates = [
    payload,
    payload.data,
    payload.questions,
    payload.result,
    payload.results,
  ];

  for (const candidate of candidates) {
    if (isQuestionPayloadArray(candidate)) {
      return candidate;
    }

    if (candidate && typeof candidate === "object") {
      const nested = candidate as AlocResponse;
      const nestedCandidates = [
        nested.data,
        nested.questions,
        nested.result,
        nested.results,
      ];
      const questions = nestedCandidates.find(isQuestionPayloadArray);

      if (questions) {
        return questions;
      }
    }
  }

  throw new Error("ALOC response did not include a questions array.");
}

export async function fetchAlocQuestions({
  subject,
  year,
  count = DEFAULT_PREFETCH_COUNT,
}: {
  subject: string;
  year?: number;
  count?: number;
}): Promise<NormalizedQuestion[]> {
  const alocSubject = toAlocSubject(subject);
  const params = new URLSearchParams({
    subject: alocSubject,
    type: "utme",
  });

  if (year) {
    params.set("year", String(year));
  }

  const boundedCount = Math.max(1, Math.min(count, MAX_MANY_QUESTIONS));
  const path =
    boundedCount <= MAX_SEVERAL_QUESTIONS
      ? `q/${boundedCount}`
      : `m/${boundedCount}`;

  const response = await fetch(
    `${ALOC_BASE_URL}/${path}?${params.toString()}`,
    {
      headers: {
        AccessToken: env.ALOC_ACCESS_TOKEN,
        Accept: "application/json",
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`ALOC request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as AlocResponse;
  const questions = extractQuestions(payload);

  return questions.map((question) => normalizeAlocQuestion(question, subject));
}
