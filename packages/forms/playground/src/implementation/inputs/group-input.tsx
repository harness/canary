import { JSX, useEffect, useMemo, useState } from 'react'

import { get } from 'lodash-es'

import { AnyFormikValue, InputComponent, InputProps, RenderInputs, useFormContext } from '../../../../src'
import InputLabel from './common/input-label'
import { InputType } from './common/types'

export interface GroupInputConfig {
  inputType: InputType.group
}

function GroupFormInputInternal(props: InputProps<AnyFormikValue>): JSX.Element {
  const { input, factory, path } = props
  const { label = '', inputs = [], required } = input

  const { formState, watch } = useFormContext()
  const values = watch()

  const [groupError, setGroupError] = useState<boolean>(false)

  useEffect(() => {
    const error = get(formState.errors, path)

    let hasError = false
    if (error) {
      hasError = true
    }
    inputs.forEach(input => {
      const errorAtInput = get(formState.errors, input.path)

      if (errorAtInput) {
        hasError = true
      }
    })

    setGroupError(hasError)
  }, [formState.errors, inputs, path])

  const isGroupVisible = useMemo(() => {
    return input.inputs?.reduce(
      (currVisible, childInput) =>
        currVisible ||
        !childInput.isVisible || // all inputs have to have isVisible
        !!childInput?.isVisible?.(values, {}),
      false
    )
  }, [values, input])

  return isGroupVisible ? (
    <div style={{ border: '1px solid lightgray' }}>
      <div style={{ display: 'flex' }}>
        <InputLabel label={label} required={required} />
        {groupError ? ' - ERROR' : null}
      </div>
      <div>
        <RenderInputs items={inputs} factory={factory} />
      </div>
    </div>
  ) : (
    <></>
  )
}

export class GroupInput extends InputComponent<AnyFormikValue> {
  public internalType = InputType.group

  renderComponent(props: InputProps<AnyFormikValue>): JSX.Element {
    return <GroupFormInputInternal {...props} />
  }
}
