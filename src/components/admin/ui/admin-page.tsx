import { searchAdminQuestions, getAdminDashboardData } from "@/components/admin/lib/admin-data";
import { AdminQuestionOverrides } from "./admin-question-overrides";
import { AdminReportQueue } from "./admin-report-queue";
import { AdminUsageSummaryCard } from "./admin-usage-summary";

type AdminPageProps = {
  message?: string;
  query?: string;
};

export async function AdminPage({ message, query }: AdminPageProps) {
  const { openReports, openReportCount, usageSummary } =
    await getAdminDashboardData();
  const questions = query ? await searchAdminQuestions(query) : [];

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">Admin</h1>
        <p className="max-w-2xl text-muted-foreground">
          Review student reports, override cached questions, and monitor tutor usage.
        </p>
        {message ? (
          <p className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
            {message}
          </p>
        ) : null}
      </section>

      <AdminUsageSummaryCard summary={usageSummary} />

      <section className="grid gap-5 xl:grid-cols-2">
        <AdminReportQueue reports={openReports} />
        <AdminQuestionOverrides questions={questions} query={query} />
      </section>

      <p className="text-sm text-muted-foreground">
        {openReportCount} open {openReportCount === 1 ? "report" : "reports"} in queue.
      </p>
    </main>
  );
}
