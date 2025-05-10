import { Input } from '@components/input'

import { InputComponent, InputProps, useController, type AnyFormikValue } from '@harnessio/forms'

import { InputError } from './common/InputError'
import { InputLabel } from './common/InputLabel'
import { InputTooltip } from './common/InputTooltip'
import { InputWrapper } from './common/InputWrapper'
import { RuntimeInputConfig } from './types/types'

export interface NumberInputConfig {
  inputType: 'number'
  inputConfig?: {
    tooltip?: string
  } & RuntimeInputConfig
}

type NumberInputProps = InputProps<AnyFormikValue, NumberInputConfig>

// TODO: Design system: Replace it with new NumberInput component. Check with Srdjan.
function NumberInputInternal(props: NumberInputProps): JSX.Element {
  const { readonly, path, input } = props
  const { label = '', required, placeholder, description, inputConfig } = input

  const { field } = useController({
    name: path
  })

  return (
    <InputWrapper {...props}>
      <>
        <InputLabel label={label} description={description} required={required} />
        <Input
          placeholder={placeholder}
          {...field}
          disabled={readonly}
          type="number"
          onChange={evt => {
            field.onChange(parseFloat(evt.currentTarget.value))
          }}
        />
        <InputError path={path} />
        {inputConfig?.tooltip && <InputTooltip tooltip={inputConfig.tooltip} />}
      </>
    </InputWrapper>
  )
}

export class NumberInput extends InputComponent<AnyFormikValue> {
  public internalType = 'number'

  renderComponent(props: NumberInputProps): JSX.Element {
    return <NumberInputInternal {...props} />
  }
}
