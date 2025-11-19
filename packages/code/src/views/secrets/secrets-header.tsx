import { useForm } from 'react-hook-form'

import { CardSelect } from '@harnessio/ui/components'

import { SecretType } from './types'

interface SecretTypeForm {
  type: SecretType
}

export const SecretsHeader = ({
  onChange,
  selectedType: selectedTypeVal,
  disableNewSecret
}: {
  onChange: (type: SecretType) => void
  selectedType: SecretType
  disableNewSecret?: boolean
}) => {
  const { setValue } = useForm<SecretTypeForm>({
    defaultValues: {
      type: selectedTypeVal
    }
  })

  const handleTypeChange = (value: unknown) => {
    if (value === SecretType.EXISTING || value === SecretType.NEW) {
      setValue('type', value as SecretType)
      onChange(value as SecretType)
    }
  }

  const options = [
    {
      id: 'new-secret',
      title: 'New',
      description: 'Create a new secret.',
      value: SecretType.NEW,
      disabled: disableNewSecret
    },
    {
      id: 'existing-secret',
      title: 'Existing',
      description: 'Use an existing secret.',
      value: SecretType.EXISTING
    }
  ]

  return (
    <CardSelect.Root type="single" value={selectedTypeVal} onValueChange={handleTypeChange}>
      {options.map(option => (
        <CardSelect.Item value={option.value} key={option.value?.toString()} disabled={option.disabled}>
          <CardSelect.Title>{option.title}</CardSelect.Title>
          <CardSelect.Description>{option.description}</CardSelect.Description>
        </CardSelect.Item>
      ))}
    </CardSelect.Root>
  )
}
