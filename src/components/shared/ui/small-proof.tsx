import type { LucideIcon } from "lucide-react"

export function SmallProof({
  icon: Icon,
  text,
}: {
  icon: LucideIcon
  text: string
}) {
  return (
    <div className="flex min-h-12 items-center gap-3 rounded-lg border bg-card px-3 text-sm font-medium">
      <Icon data-icon="inline-start" />
      {text}
    </div>
  )
}
