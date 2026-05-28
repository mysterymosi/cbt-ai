import { z } from "zod";

const uiMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant", "system"]),
  parts: z.array(
    z.object({
      type: z.string(),
      text: z.string().optional(),
    }),
  ),
});

export const tutorRequestSchema = z.object({
  messages: z.array(uiMessageSchema),
  sessionId: z.string().uuid(),
  questionId: z.string().uuid(),
});
