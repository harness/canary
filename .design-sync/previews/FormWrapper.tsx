import * as React from 'react'
import { useForm } from 'react-hook-form'
import { FormWrapper, FormInput, Button, ButtonLayout } from '@harnessio/ui'

function Demo({ orientation }: { orientation?: 'horizontal' | 'vertical' }) {
  const methods = useForm({ defaultValues: { name: 'build-and-test', repo: 'harness/canary', description: '' } })
  return (
    <div style={{ padding: 16, width: 460 }}>
      <FormWrapper {...(methods as any)} orientation={orientation} onSubmit={methods.handleSubmit(() => {})}>
        <FormInput.Text name="name" label="Pipeline name" caption="Shown in the executions list." />
        <FormInput.Text name="repo" label="Repository" />
        <FormInput.Textarea name="description" label="Description" optional placeholder="What does this pipeline do?" />
        <ButtonLayout>
          <Button variant="outline">Cancel</Button>
          <Button type="submit">Create pipeline</Button>
        </ButtonLayout>
      </FormWrapper>
    </div>
  )
}

export function Vertical() { return <Demo /> }
export function Horizontal() { return <Demo orientation="horizontal" /> }
