import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function AuthErrorPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authentication link failed</CardTitle>
          <CardDescription>
            The sign-in link may have expired or already been used.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/login"
            className={cn(buttonVariants(), "min-h-11 w-full cursor-pointer")}
          >
            Back to login
          </Link>
        </CardContent>
      </Card>
    </main>
  )
}
