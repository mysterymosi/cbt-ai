import { PracticeSessionPage } from "@/components/practice";

export default async function PracticeSessionRoute({
  params,
  searchParams,
}: {
  params: Promise<{ sessionId: string }>;
  searchParams: Promise<{ question?: string; message?: string }>;
}) {
  const [{ sessionId }, { question, message }] = await Promise.all([
    params,
    searchParams,
  ]);

  return (
    <PracticeSessionPage
      sessionId={sessionId}
      questionId={question}
      message={message}
    />
  );
}
