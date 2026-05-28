import { AdminPage } from "@/components/admin";

export default async function AdminRoute({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; q?: string }>;
}) {
  const { message, q } = await searchParams;
  return <AdminPage message={message} query={q} />;
}
