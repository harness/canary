import { JSX } from 'react'

import { CalendarInputView, InputCaption, InputLabel, InputWrapper } from '@/views'

import { InputComponent, InputProps, useController, type AnyFormikValue } from '@harnessio/forms'

import { RuntimeInputConfig } from './types/types'

export type CalendarFormInputType = 'calendar'

export interface CalendarInputConfig {
  inputType: 'calendar'
  tooltip?: string
  inputConfig?: {
    /* placeholder for more config */
  } & RuntimeInputConfig
}

type CalendarFormInputProps = InputProps<AnyFormikValue, CalendarInputConfig>

function CalendarFormInputInternal(props: CalendarFormInputProps): JSX.Element {
  const { path, input } = props
  const { label, required, description, readonly } = input

  const { field, fieldState } = useController({
    name: path,
    disabled: readonly
  })

  // Convert ISO date string to timestamp for the form value
  const handleDateChange = (dateString: Date) => {
    if (!dateString) {
      field.onChange('')
      return
    }
    // Convert YYYY-MM-DD to timestamp (milliseconds since epoch)
    const timestamp = new Date(dateString).getTime()
    field.onChange(timestamp)
  }

  return (
    <InputWrapper {...props}>
      <InputLabel label={label} required={required} />
      <CalendarInputView value={field.value} setValue={handleDateChange} />
      <InputCaption error={fieldState?.error?.message} caption={description} />
    </InputWrapper>
  )
}

export class CalendarInput extends InputComponent<AnyFormikValue> {
  public internalType: CalendarFormInputType = 'calendar'

  renderComponent(props: CalendarFormInputProps): JSX.Element {
    return <CalendarFormInputInternal {...props} />
  }
}
