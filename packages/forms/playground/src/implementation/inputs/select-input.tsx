import { AnyFormikValue, InputComponent, InputProps, useController } from '../../../../src'
import { InputError } from './common/input-errror'
import InputLabel from './common/input-label'
import InputWrapper from './common/input-wrapper'
import { InputType } from './common/types'

export interface SelectOption {
  label: string
  value: string
}

export interface SelectInputConfig {
  inputType: InputType.select
  inputConfig: {
    options: SelectOption[]
  }
}
function SelectInputInternal(props: InputProps<AnyFormikValue, SelectInputConfig>): JSX.Element {
  const { path, input } = props
  const { label = '', required, inputConfig } = input

  const { field } = useController({
    name: path
  })

  return (
    <InputWrapper>
      <InputLabel label={label} required={required} />
      <select {...field}>
        {inputConfig?.options.map(item => {
          return (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          )
        })}
      </select>

      <InputError path={path} />
    </InputWrapper>
  )
}

export class SelectInput extends InputComponent<AnyFormikValue> {
  public internalType = InputType.select

  renderComponent(props: InputProps<AnyFormikValue, SelectInputConfig>): JSX.Element {
    return <SelectInputInternal {...props} />
  }
}
