import { PracticeSetupPage } from "@/components/practice";

export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; subject?: string; count?: string }>;
}) {
  const { message, subject, count } = await searchParams;

  return (
    <PracticeSetupPage message={message} recommendedSubject={subject} recommendedCount={count} />
  );
}
