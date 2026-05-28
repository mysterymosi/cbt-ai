import { DashboardPage as DashboardFeature } from "@/components/dashboard";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;
  return <DashboardFeature message={message} />;
}
