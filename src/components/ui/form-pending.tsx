"use client"

import { useFormStatus } from "react-dom"
import { cn } from "@/lib/utils"

type FormPendingProps = {
  children: React.ReactNode
  className?: string
}

export function FormPending({ children, className }: FormPendingProps) {
  const { pending } = useFormStatus()

  return (
    <fieldset disabled={pending} className={cn("contents", className)}>
      {children}
    </fieldset>
  )
}
