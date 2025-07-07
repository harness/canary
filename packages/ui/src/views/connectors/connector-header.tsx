import { useForm } from 'react-hook-form'

import { CardSelect } from '@components/card-select'
import { RadioSelectOption } from '@views/components/RadioSelect'

import { ConnectorSelectionType } from './types'

interface ConnectorTypeForm {
  type: ConnectorSelectionType
}
const defaultOptions: Array<RadioSelectOption<ConnectorSelectionType>> = [
  {
    id: 'new-connector',
    title: 'New Connector',
    description: 'Create a new connector',
    value: ConnectorSelectionType.NEW
  },
  {
    id: 'existing-connector',
    title: 'Existing Connector',
    description: 'Use an existing connector',
    value: ConnectorSelectionType.EXISTING
  }
]

export const ConnectorHeader = ({
  onChange,
  selectedType: selectedTypeVal,
  options = defaultOptions
}: {
  onChange: (type: ConnectorSelectionType) => void
  selectedType: ConnectorSelectionType
  options?: Array<RadioSelectOption<ConnectorSelectionType>>
}) => {
  const { setValue } = useForm<ConnectorTypeForm>({
    defaultValues: {
      type: selectedTypeVal
    }
  })

  const handleTypeChange = (value: unknown) => {
    if (value === ConnectorSelectionType.NEW || value === ConnectorSelectionType.EXISTING) {
      setValue('type', value as ConnectorSelectionType)
      onChange(value as ConnectorSelectionType)
    }
  }

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
