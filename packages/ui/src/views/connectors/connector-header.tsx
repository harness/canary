import { useForm } from 'react-hook-form'

import { RadioOption, RadioSelect } from '@views/components/RadioSelect'

import { ConnectorSelectionType } from './types'

interface ConnectorTypeForm {
  type: ConnectorSelectionType
}

export const ConnectorHeader = ({
  onChange,
  selectedType: selectedTypeVal
}: {
  onChange: (type: ConnectorSelectionType) => void
  selectedType: ConnectorSelectionType
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

  const options: Array<RadioOption<ConnectorSelectionType>> = [
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

  return <RadioSelect options={options} value={selectedTypeVal} onValueChange={handleTypeChange} id="secret-type" />
}
