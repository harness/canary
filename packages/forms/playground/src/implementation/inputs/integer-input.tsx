import { useEffect } from 'react'

import { InputComponent, InputProps, useController, type AnyFormValue } from '../../../../src/index'
import { InputError } from './common/input-error'
import InputLabel from './common/input-label'
import InputWrapper from './common/input-wrapper'
import { InputType } from './common/types'

export interface IntegerInputConfig {
  inputType: InputType.integer
}

function IntegerInputInternal(props: InputProps<AnyFormValue>): JSX.Element {
  const { readonly, path, input } = props
  const { label = '', required, placeholder } = input

  const { field } = useController({
    name: path
  })

  useEffect(() => {
    if (field.value == 444) {
      throw new Error()
    }
  }, [field.value])

  return (
    <InputWrapper {...props}>
      <InputLabel label={label} required={required} />
      <input type="number" placeholder={placeholder} {...field} disabled={readonly} tabIndex={0} />
      <InputError path={path} />
    </InputWrapper>
  )
}

export class IntegerInput extends InputComponent<AnyFormValue> {
  public internalType = InputType.integer

  renderComponent(props: InputProps<AnyFormValue>): JSX.Element {
    return <IntegerInputInternal {...props} />
  }
}
