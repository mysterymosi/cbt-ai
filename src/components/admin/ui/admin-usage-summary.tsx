import type { AdminUsageSummary } from "@/components/admin/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AdminUsageSummaryCardProps = {
  summary: AdminUsageSummary;
};

export function AdminUsageSummaryCard({ summary }: AdminUsageSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI usage (7 days)</CardTitle>
        <CardDescription>Tutor messages and token totals across all users.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-3">
        <Metric label="Messages" value={String(summary.messageCount)} />
        <Metric label="Input tokens" value={summary.tokensIn.toLocaleString()} />
        <Metric label="Output tokens" value={summary.tokensOut.toLocaleString()} />
      </CardContent>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}
