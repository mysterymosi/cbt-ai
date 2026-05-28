import { AuthCard, ResetPasswordForm } from "@/components/auth"

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const { message } = await searchParams

  return (
    <AuthCard
      title="Reset password"
      description="We will send a secure password reset link to your email."
      message={message}
    >
      <ResetPasswordForm />
    </AuthCard>
  )
}
