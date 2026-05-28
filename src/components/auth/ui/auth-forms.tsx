
import Link from "next/link"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { FormPending } from "@/components/ui/form-pending"
import { Input } from "@/components/ui/input"
import { SubmitButton } from "@/components/ui/submit-button"
import {
  requestPasswordReset,
  signIn,
  signUp,
} from "@/components/auth/actions/auth"

export function LoginForm() {
  return (
    <form action={signIn}>
      <FormPending>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </Field>
          <SubmitButton pendingLabel="Logging in…" className="min-h-11 w-full">
            Log in
          </SubmitButton>
          <FieldDescription className="text-center">
            New here? <Link href="/signup">Create an account</Link>. Forgot your
            password? <Link href="/reset-password">Reset it</Link>.
          </FieldDescription>
        </FieldGroup>
      </FormPending>
    </form>
  )
}

export function SignupForm() {
  return (
    <form action={signUp}>
      <FormPending>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input id="name" name="name" autoComplete="name" required />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={6}
              required
            />
          </Field>
          <SubmitButton pendingLabel="Creating account…" className="min-h-11 w-full">
            Create account
          </SubmitButton>
          <FieldDescription className="text-center">
            Already have an account? <Link href="/login">Log in</Link>.
          </FieldDescription>
        </FieldGroup>
      </FormPending>
    </form>
  )
}

export function ResetPasswordForm() {
  return (
    <form action={requestPasswordReset}>
      <FormPending>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </Field>
          <SubmitButton pendingLabel="Sending…" className="min-h-11 w-full">
            Send reset email
          </SubmitButton>
          <FieldDescription className="text-center">
            Remembered it? <Link href="/login">Log in</Link>.
          </FieldDescription>
        </FieldGroup>
      </FormPending>
    </form>
  )
}
