import { Layout, Tag } from '@harnessio/ui/components'

interface FormState {
  isValid?: boolean
  isSubmitted?: boolean
}

interface FormStatusProps {
  formState: FormState
}

export function FormStatus({ formState }: FormStatusProps) {
  return (
    <Layout.Vertical gap="sm">
      <Layout.Horizontal gap="sm" align="center">
        <span>Valid:</span>
        <Tag value={formState.isValid ? 'Yes' : 'No'} theme={formState.isValid ? 'green' : 'red'} size="sm" />
      </Layout.Horizontal>
      <Layout.Horizontal gap="sm" align="center">
        <span>Submitted:</span>
        <Tag value={formState.isSubmitted ? 'Yes' : 'No'} theme={formState.isSubmitted ? 'green' : 'red'} size="sm" />
      </Layout.Horizontal>
    </Layout.Vertical>
  )
}
