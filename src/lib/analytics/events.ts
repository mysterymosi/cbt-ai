export type AnalyticsEvent =
  | "signup_complete"
  | "first_question_answered"
  | "tutor_opened"
  | "session_complete";

export const ANALYTICS_EVENTS: Record<AnalyticsEvent, string> = {
  signup_complete: "Signup Complete",
  first_question_answered: "First Question Answered",
  tutor_opened: "Tutor Opened",
  session_complete: "Session Complete",
};
