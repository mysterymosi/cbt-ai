import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="text-muted-foreground">
          Account settings and password updates will expand after the core
          practice loop is in place.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Email authentication is active for M1.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Use the reset password flow from the login screen if needed.
        </CardContent>
      </Card>
    </main>
  )
}
