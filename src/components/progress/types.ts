import type { practiceCounts } from "@/components/practice/schemas";

export type SubjectAccuracy = {
  subject: string;
  correct: number;
  total: number;
  accuracy: number;
};

export type RecentSessionScore = {
  subject: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  completedAt: string;
};

export type IncompleteSession = {
  id: string;
  subject: string;
  progress: number;
  totalQuestions: number;
};

export type MissedReviewItem = {
  attemptId: string;
  sessionId: string;
  questionId: string;
  questionText: string;
  subject: string;
  selectedAnswer: string;
  correctAnswer: string;
  createdAt: string;
};

export type PracticeRecommendation = {
  subject: string;
  count: (typeof practiceCounts)[number];
  reason: string;
  href: string;
};

export type DashboardProgress = {
  streakDays: number;
  weakestSubject: SubjectAccuracy | null;
  strongestSubject: SubjectAccuracy | null;
  recentSession: RecentSessionScore | null;
  incompleteSession: IncompleteSession | null;
  recentMissed: MissedReviewItem[];
  subjectAccuracies: SubjectAccuracy[];
  insightMessage: string;
};
