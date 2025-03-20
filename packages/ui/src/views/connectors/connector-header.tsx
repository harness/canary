import { useForm } from 'react-hook-form'

import { RadialOption, RadioSelect } from '@views/components/RadioSelect'

import { ConnectorType } from './types'

interface ConnectorTypeForm {
  type: ConnectorType
}

export const ConnectorHeader = ({
  onChange,
  selectedType: selectedTypeVal
}: {
  onChange: (type: ConnectorType) => void
  selectedType: ConnectorType
}) => {
  const { setValue } = useForm<ConnectorTypeForm>({
    defaultValues: {
      type: selectedTypeVal
    }
  })

  const handleTypeChange = (value: ConnectorType) => {
    setValue('type', value)
    onChange(value)
  }

  const options: Array<RadialOption<ConnectorType>> = [
    {
      id: 'new-connector',
      title: 'New Connector',
      description: 'Create a new connector.',
      value: ConnectorType.NEW
    },
    {
      id: 'existing-connector',
      title: 'Existing Connector',
      description: 'Use an existing connector.',
      value: ConnectorType.EXISTING
    }
  ]

  return <RadioSelect options={options} value={selectedTypeVal} onValueChange={handleTypeChange} id="secret-type" />
}
