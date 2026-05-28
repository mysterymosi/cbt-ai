import type { LucideIcon } from "lucide-react"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function FeatureCard({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon
  title: string
  text: string
}) {
  return (
    <Card className="bg-card/95">
      <CardHeader>
        <span className="flex size-9 items-center justify-center rounded-md border bg-background text-primary">
          <Icon data-icon="inline-start" />
        </span>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{text}</CardDescription>
      </CardHeader>
    </Card>
  )
}
