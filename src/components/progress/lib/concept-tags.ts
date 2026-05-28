import { google } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { z } from "zod";
import { env } from "@/env";

const conceptTagsSchema = z.object({
  concepts: z.array(z.string().min(2).max(48)).min(1).max(4),
});

export async function generateSessionConceptTags(
  subject: string,
  missedQuestionTexts: string[],
): Promise<string[]> {
  if (!missedQuestionTexts.length) {
    return [];
  }

  if (!env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return [];
  }

  const questionsBlock = missedQuestionTexts
    .map((text, index) => `${index + 1}. ${text}`)
    .join("\n");

  try {
    const { output } = await generateText({
      model: google("gemini-2.5-flash"),
      output: Output.object({ schema: conceptTagsSchema }),
      prompt: `You label UTME/JAMB ${subject} weak areas for a Nigerian secondary school student.

From these missed questions, return 2-4 short concept labels (2-4 words each) such as "Stoichiometry", "Organic nomenclature", or "Quadratic equations".

Use only concepts clearly suggested by the questions. Do not invent topics not implied by the text.

Missed questions:
${questionsBlock}`,
    });

    if (!output) {
      return [];
    }

    return output.concepts;
  } catch {
    return [];
  }
}

export function parseConceptTags(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}
