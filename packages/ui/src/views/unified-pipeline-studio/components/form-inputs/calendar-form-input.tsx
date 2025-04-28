/*
 * Copyright 2025 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

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
  const handleDateChange = (dateString: string) => {
    console.log(dateString)
    if (!dateString) {
      field.onChange('')
      return
    }
    // Convert YYYY-MM-DD to timestamp (milliseconds since epoch)
    const timestamp = new Date(dateString).getTime()
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
