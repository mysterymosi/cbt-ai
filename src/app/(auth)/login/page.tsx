import { AuthCard, LoginForm } from "@/components/auth"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const { message } = await searchParams

  return (
    <AuthCard
      title="Log in"
      description="Continue your UTME practice and keep your progress saved."
      message={message}
    >
      <LoginForm />
    </AuthCard>
  )
}
