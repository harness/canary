import { AnyFormValue, IInputDefinition, InputComponent, InputProps, useController } from '../../../../src'
import { InputError } from './common/input-error'
import InputLabel from './common/input-label'
import InputWrapper from './common/input-wrapper'
import { InputType } from './common/types'

export interface CheckboxInputConfig extends IInputDefinition {
  inputType: InputType.checkbox
}

function CheckboxInputInternal(props: InputProps<AnyFormValue>): JSX.Element {
  const { readonly, path, input } = props
  const { label = '', required } = input

  const { field } = useController({
    name: path
  })

  return (
    <InputWrapper {...props}>
      <InputLabel label={label} required={required} />
      <input type="checkbox" {...field} disabled={readonly} tabIndex={0} checked={field.value} />
      <InputError path={path} />
    </InputWrapper>
  )
}

export class CheckboxInput extends InputComponent<AnyFormValue> {
  public internalType = InputType.checkbox

  renderComponent(props: InputProps<AnyFormValue, CheckboxInputConfig>): JSX.Element {
    return <CheckboxInputInternal {...props} />
  }
}
