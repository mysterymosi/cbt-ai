import { Badge } from "@/components/ui/badge"

export function SectionIntro({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string
  title: string
  text: string
}) {
  return (
    <div className="flex flex-col gap-3">
      <Badge className="w-fit" variant="outline">
        {eyebrow}
      </Badge>
      <h2 className="text-3xl font-semibold leading-tight">{title}</h2>
      <p className="max-w-xl leading-7 text-muted-foreground">{text}</p>
    </div>
  )
}
