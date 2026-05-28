import { PracticeSummaryPage } from "@/components/practice";

export default async function PracticeSummaryRoute({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;

  return <PracticeSummaryPage sessionId={sessionId} />;
}
