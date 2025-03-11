import { Input } from '@components/input'

import { InputComponent, InputProps, useController, type AnyFormikValue } from '@harnessio/forms'

import { InputError } from './common/InputError'
import InputLabel from './common/InputLabel'
import InputWrapper from './common/InputWrapper'
import { InputType } from './types'

export interface NumberInputConfig {
  inputType: InputType.number
}

function NumberInputInternal(props: InputProps<AnyFormikValue>): JSX.Element {
  const { readonly, path, input } = props
  const { label = '', required, placeholder, description } = input

  const { field } = useController({
    name: path
  })

  return (
    <InputWrapper>
      <InputLabel label={label} description={description} required={required} />
      <Input placeholder={placeholder} {...field} disabled={readonly} type="number" />
      <InputError path={path} />
    </InputWrapper>
  )
}

export class NumberInput extends InputComponent<AnyFormikValue> {
  public internalType = InputType.number

  renderComponent(props: InputProps<AnyFormikValue>): JSX.Element {
    return <NumberInputInternal {...props} />
  }
}
