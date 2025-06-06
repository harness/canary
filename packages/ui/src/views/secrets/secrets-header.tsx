import { useForm } from 'react-hook-form'

import { CardSelect } from '@components/card-select'
import { RadioSelectOption } from '@views/components/RadioSelect'

import { SecretType } from './types'

interface SecretTypeForm {
  type: SecretType
}

export const SecretsHeader = ({
  onChange,
  selectedType: selectedTypeVal
}: {
  onChange: (type: SecretType) => void
  selectedType: SecretType
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

  const options: Array<RadioSelectOption<SecretType>> = [
    {
      id: 'existing-secret',
      title: 'Existing',
      description: 'Use an existing secret.',
      value: SecretType.EXISTING
    },
    {
      id: 'new-secret',
      title: 'New',
      description: 'Create a new secret.',
      value: SecretType.NEW
    }
  ]

  return (
    <CardSelect.Root type="single" value={selectedTypeVal} onValueChange={handleTypeChange}>
      {options.map(option => (
        <CardSelect.Item value={option.value} key={option.value?.toString()}>
          <CardSelect.Title>{option.title}</CardSelect.Title>
          <CardSelect.Description>{option.description}</CardSelect.Description>
        </CardSelect.Item>
      ))}
    </CardSelect.Root>
  )
}
