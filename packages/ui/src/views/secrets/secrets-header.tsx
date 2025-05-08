import { useForm } from 'react-hook-form'

import { RadioSelect, RadioSelectOption } from '@views/components/RadioSelect'

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

  const handleTypeChange = (value: SecretType) => {
    setValue('type', value)
    onChange(value)
  }

  const options: Array<RadioSelectOption<SecretType>> = [
    {
      id: 'new-secret',
      title: 'New Secret',
      description: 'Create a new secret.',
      value: SecretType.NEW
    },
    {
      id: 'existing-secret',
      title: 'Existing Secret',
      description: 'Use an existing secret.',
      value: SecretType.EXISTING
    }
  ]

  return <RadioSelect options={options} value={selectedTypeVal} onValueChange={handleTypeChange} id="secret-type" />
}
