import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { FormPending } from "@/components/ui/form-pending"
import { Input } from "@/components/ui/input"
import { SubmitButton } from "@/components/ui/submit-button"
import { UTME_SUBJECTS } from "@/lib/constants/subjects"
import { saveOnboarding } from "@/components/onboarding/actions/onboarding"

export function OnboardingForm({
  defaultName,
  selectedSubjects = [],
}: {
  defaultName?: string | null
  selectedSubjects?: string[]
}) {
  return (
    <form action={saveOnboarding}>
      <FormPending>
        <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input
            id="name"
            name="name"
            defaultValue={defaultName ?? ""}
            autoComplete="name"
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="exam">Target exam</FieldLabel>
          <Input id="exam" value="JAMB/UTME" readOnly />
          <FieldDescription>
            The beta is focused on UTME practice only.
          </FieldDescription>
        </Field>

        <FieldSet>
          <FieldLegend>Subjects</FieldLegend>
          <FieldDescription>
            Pick the subjects you want to practice first.
          </FieldDescription>
          <FieldGroup data-slot="checkbox-group">
            {UTME_SUBJECTS.map((subject) => (
              <Field key={subject.value} orientation="horizontal">
                <Checkbox
                  id={`subject-${subject.value}`}
                  name="subjects"
                  value={subject.value}
                  defaultChecked={selectedSubjects.includes(subject.value)}
                />
                <FieldContent>
                  <FieldLabel htmlFor={`subject-${subject.value}`}>
                    <FieldTitle>{subject.label}</FieldTitle>
                  </FieldLabel>
                </FieldContent>
              </Field>
            ))}
          </FieldGroup>
        </FieldSet>

        <SubmitButton pendingLabel="Saving…" className="min-h-11 w-full">
          Save and continue
        </SubmitButton>
        </FieldGroup>
      </FormPending>
    </form>
  )
}
