import { CheckCircle2Icon, Clock3Icon, SparklesIcon } from "lucide-react"
import { answerOptions } from "@/components/landing/lib/content"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export function ExamWorkspacePreview() {
  return (
    <div className="rounded-xl border bg-background p-2 shadow-xl shadow-foreground/5">
      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-border" />
            <span className="size-2 rounded-full bg-border" />
            <span className="size-2 rounded-full bg-border" />
          </div>
          <Badge variant="outline">Chemistry · UTME</Badge>
        </div>

        <div className="grid gap-0 xl:grid-cols-[1fr_300px]">
          <div className="flex flex-col gap-5 p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock3Icon data-icon="inline-start" />
                Practice mode
              </div>
              <Badge variant="secondary">Question 04 of 10</Badge>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-primary">Sample question</p>
              <h2 className="text-xl font-semibold leading-snug sm:text-2xl">
                Which gas is produced when dilute hydrochloric acid reacts with
                zinc?
              </h2>
            </div>

            <div className="grid gap-3">
              {answerOptions.map((option) => (
                <div
                  key={option.label}
                  className={cn(
                    "flex min-h-12 items-center gap-3 rounded-lg border bg-background px-3 py-3 text-sm",
                    option.selected && "border-accent bg-accent/10"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-7 items-center justify-center rounded-md border bg-card font-semibold",
                      option.selected &&
                        "border-accent bg-accent text-accent-foreground"
                    )}
                  >
                    {option.label}
                  </span>
                  <span>{option.text}</span>
                  {option.selected ? (
                    <CheckCircle2Icon className="ml-auto text-accent" />
                  ) : null}
                </div>
              ))}
            </div>

            <div className="rounded-lg border bg-muted/60 p-4">
              <p className="flex items-center gap-2 font-medium text-accent">
                <CheckCircle2Icon data-icon="inline-start" />
                Correct answer: B
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Zinc reacts with dilute hydrochloric acid to form zinc chloride
                and hydrogen gas.
              </p>
            </div>
          </div>

          <aside className="border-t bg-muted/50 p-4 xl:border-l xl:border-t-0">
            <div className="flex h-full flex-col gap-4">
              <div>
                <p className="flex items-center gap-2 text-sm font-medium">
                  <SparklesIcon data-icon="inline-start" />
                  AI Tutor
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Available after submission.
                </p>
              </div>
              <Separator />
              <div className="rounded-lg border bg-card p-3 text-sm leading-6">
                Hydrogen is released because zinc displaces hydrogen from the
                acid. The salt left behind is zinc chloride.
              </div>
              <div className="grid gap-2 text-sm">
                <Badge variant="outline" className="w-fit">
                  Explain simply
                </Badge>
                <Badge variant="outline" className="w-fit">
                  Why not oxygen?
                </Badge>
                <Badge variant="outline" className="w-fit">
                  Similar question
                </Badge>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
