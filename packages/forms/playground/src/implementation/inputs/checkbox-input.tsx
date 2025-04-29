import { AnyFormikValue, IInputDefinition, InputComponent, InputProps, useController } from '../../../../src'
import { InputError } from './common/input-errror'
import InputLabel from './common/input-label'
import InputWrapper from './common/input-wrapper'
import { InputType } from './common/types'

export interface CheckboxInputConfig extends IInputDefinition {
  inputType: InputType.checkbox
}

function CheckboxInputInternal(props: InputProps<AnyFormikValue>): JSX.Element {
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

export class CheckboxInput extends InputComponent<AnyFormikValue> {
  public internalType = InputType.checkbox

  renderComponent(props: InputProps<AnyFormikValue, CheckboxInputConfig>): JSX.Element {
    return <CheckboxInputInternal {...props} />
  }
}
