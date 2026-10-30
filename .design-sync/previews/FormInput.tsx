import * as React from 'react'
import { useForm } from 'react-hook-form'
import { FormWrapper, FormInput } from '@harnessio/ui'

function Wrap({ defaults, children }: { defaults: any; children: React.ReactNode }) {
  const methods = useForm({ defaultValues: defaults })
  return (
    <div style={{ padding: 16, width: 420 }}>
      <FormWrapper {...(methods as any)}>{children}</FormWrapper>
    </div>
  )
}

export function TextFields() {
  return (
    <Wrap defaults={{ name: 'deploy-to-production', branch: 'main' }}>
      <FormInput.Text name="name" label="Pipeline name" caption="Lowercase letters, numbers and hyphens." />
      <FormInput.Text name="branch" label="Default branch" optional />
    </Wrap>
  )
}

export function Errors() {
  return (
    <Wrap defaults={{ url: 'htp:/bad', tag: 'v2.4.0' }}>
      <FormInput.Text name="url" label="Webhook URL" error="Enter a valid https URL." />
      <FormInput.Text name="tag" label="Release tag" warning="Tag already exists on another commit." />
    </Wrap>
  )
}

export function TextareaAndNumber() {
  return (
    <Wrap defaults={{ desc: 'Builds, tests and deploys the API service.', retries: 3 }}>
      <FormInput.Textarea name="desc" label="Description" />
      <FormInput.Number name="retries" label="Max retries" />
    </Wrap>
  )
}
