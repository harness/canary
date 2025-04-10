import { Input } from '@components/input'

import { InputComponent, InputProps, useController, type AnyFormikValue } from '@harnessio/forms'

import { InputError } from './common/InputError'
import { InputLabel } from './common/InputLabel'
import { InputTooltip } from './common/InputTooltip'
import { InputWrapper } from './common/InputWrapper'

export interface NumberInputConfig {
  inputType: 'number'
  inputConfig?: {
    tooltip?: string
  }
}

function NumberInputInternal(props: InputProps<AnyFormikValue, NumberInputConfig>): JSX.Element {
  const { readonly, path, input } = props
  const { label = '', required, placeholder, description, inputConfig } = input

  const { field } = useController({
    name: path
  })

  return (
    <InputWrapper>
      <InputLabel label={label} description={description} required={required} />
      <Input placeholder={placeholder} {...field} disabled={readonly} type="number" />
      <InputError path={path} />
      {inputConfig?.tooltip && <InputTooltip tooltip={inputConfig.tooltip} />}
    </InputWrapper>
  )
}

export class NumberInput extends InputComponent<AnyFormikValue> {
  public internalType = 'number'

  renderComponent(props: InputProps<AnyFormikValue, NumberInputConfig>): JSX.Element {
    return <NumberInputInternal {...props} />
  }
}
