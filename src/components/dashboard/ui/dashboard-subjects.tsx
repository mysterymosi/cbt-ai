import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSubjectLabel, UTME_SUBJECTS } from "@/lib/constants/subjects";

type DashboardSubjectsProps = {
  selectedSubjects: string[];
};

export function DashboardSubjects({ selectedSubjects }: DashboardSubjectsProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Subjects</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {UTME_SUBJECTS.map((subject) => {
          const selected = selectedSubjects.includes(subject.value);

          return (
            <Card key={subject.value} size="sm">
              <CardHeader>
                <CardTitle>{subject.label}</CardTitle>
                <CardDescription>
                  {selected ? "Selected" : "Available in beta"}
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>
      {selectedSubjects.length ? (
        <p className="text-sm text-muted-foreground">
          Active focus: {selectedSubjects.map(getSubjectLabel).join(", ")}.
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          Choose subjects to finish onboarding.
        </p>
      )}
    </section>
  );
}
