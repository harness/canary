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

  return <RadioSelect options={options} value={selectedTypeVal} onValueChange={handleTypeChange} id="secret-type" />
}
