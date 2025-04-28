import { JSX } from 'react'

import { CalendarInputView, InputError, InputLabel, InputWrapper } from '@/views'

import { InputComponent, InputProps, useController, type AnyFormikValue } from '@harnessio/forms'

export type CalendarInputType = 'calendar'

export interface CalendarInputConfig {
  inputType: CalendarInputType
  tooltip?: string
}

type CalendarFormInputProps = InputProps<AnyFormikValue>

function CalendarFormInputInternal(props: CalendarFormInputProps): JSX.Element {
  const { path, input } = props
  const { label = '', required, description } = input

  const { field } = useController({
    name: path
  })

  // Convert ISO date string to timestamp for the form value
  const handleDateChange = (dateString: Date) => {
    console.log(dateString)
    if (!dateString) {
      field.onChange('')
      return
    }
    // Convert YYYY-MM-DD to timestamp (milliseconds since epoch)
    const timestamp = new Date(dateString).getTime()
    console.log(timestamp)
    field.onChange(timestamp)
  }

  return (
    <InputWrapper>
      <InputLabel label={label} description={description} required={required} />
      <CalendarInputView value={field.value} setValue={handleDateChange} />
      <InputError path={path} />
    </InputWrapper>
  )
}

export class CalendarInput extends InputComponent<AnyFormikValue> {
  public internalType: CalendarInputType = 'calendar'

  renderComponent(props: CalendarFormInputProps): JSX.Element {
    return <CalendarFormInputInternal {...props} />
  }
}
