import { InputComponent, InputProps, useController, type AnyFormikValue } from '../../../../src/index'
import { InputError } from './common/input-errror'
import InputLabel from './common/input-label'
import InputWrapper from './common/input-wrapper'
import { InputType } from './common/types'

export interface TextInputConfig {
  inputType: InputType.text
}

function TextInputInternal(props: InputProps<AnyFormikValue>): JSX.Element {
  const { readonly, path, input } = props
  const { label = '', required, placeholder } = input

  const { field } = useController({
    name: path
  })

  return (
    <InputWrapper>
      <InputLabel label={label} required={required} />
      <input placeholder={placeholder} {...field} disabled={readonly} tabIndex={0} />
      <InputError path={path} />
    </InputWrapper>
  )
}

export class TextInput extends InputComponent<AnyFormikValue> {
  public internalType = InputType.text

  renderComponent(props: InputProps<AnyFormikValue>): JSX.Element {
    return <TextInputInternal {...props} />
  }
}
