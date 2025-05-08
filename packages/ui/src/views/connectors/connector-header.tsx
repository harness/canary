import { useForm } from 'react-hook-form'

import { RadioSelect, RadioSelectOption } from '@views/components/RadioSelect'

import { ConnectorSelectionType } from './types'

interface ConnectorTypeForm {
  type: ConnectorSelectionType
}
const defaultOptions: Array<RadioSelectOption<ConnectorSelectionType>> = [
  {
    id: 'new-connector',
    title: 'New Connector',
    description: 'Create a new connector.',
    value: ConnectorSelectionType.NEW
  },
  {
    id: 'existing-connector',
    title: 'Existing Connector',
    description: 'Use an existing connector.',
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

  const handleTypeChange = (value: ConnectorSelectionType) => {
    setValue('type', value)
    onChange(value)
  }

  return <RadioSelect options={options} value={selectedTypeVal} onValueChange={handleTypeChange} id="secret-type" />
}
