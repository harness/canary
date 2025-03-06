import { Textarea } from '@components/index'

import { InputComponent, InputProps, useController, type AnyFormikValue } from '@harnessio/forms'

import { InputError } from './common/InputError'
import InputLabel from './common/InputLabel'
import InputWrapper from './common/InputWrapper'
import { InputType } from './types'

export interface TextAreaInputConfig {
  inputType: InputType.textarea
}

function TextAreaInputInternal(props: InputProps<AnyFormikValue>): JSX.Element {
  const { readonly, path, input } = props
  const { label = '', required, placeholder, description } = input

  const { field } = useController({
    name: path
  })

  return (
    <InputWrapper>
      <InputLabel label={label} description={description} required={required} />
      <Textarea placeholder={placeholder} {...field} disabled={readonly} />
      <InputError />
    </InputWrapper>
  )
}

export class TextAreaInput extends InputComponent<AnyFormikValue> {
  public internalType = InputType.textarea

  renderComponent(props: InputProps<AnyFormikValue>): JSX.Element {
    return <TextAreaInputInternal {...props} />
  }
}
