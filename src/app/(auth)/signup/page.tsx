import { AuthCard, SignupForm } from "@/components/auth"

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const { message } = await searchParams

  return (
    <AuthCard
      title="Create your account"
      description="Set up email access first. Subject selection comes next."
      message={message}
    >
      <SignupForm />
    </AuthCard>
  )
}
