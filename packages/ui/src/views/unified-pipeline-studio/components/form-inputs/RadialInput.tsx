import { FormControl } from '@components/form'
import { RadioSelect } from '@views/components/RadioSelect'

import { InputComponent, InputProps, useController, type AnyFormikValue } from '@harnessio/forms'

import { InputLabel, InputWrapper } from './common'
import { InputCaption } from './common/InputCaption'
import { RuntimeInputConfig } from './types/types'

export interface RadioOption {
  label: string
  description: string
  value: string | boolean
  id: string
  title: string
}

export interface RadialInputConfig {
  inputConfig: {
    inputType: 'radio'
    options: RadioOption[]
    tooltip?: string
  } & RuntimeInputConfig
}

type RadialInputProps = InputProps<AnyFormikValue, RadialInputConfig>

function RadialInputInternal(props: RadialInputProps): JSX.Element {
  const { path, input } = props
  const { label, required, description, inputConfig, readonly } = input
  const options = inputConfig?.options ?? []

  const { field, fieldState } = useController({
    name: path,
    disabled: readonly
  })

  return (
    <InputWrapper {...props}>
      <InputLabel label={label} required={required} />
      <FormControl>
        <RadioSelect options={options} value={field.value} onValueChange={field.onChange} id={field.value} />
      </FormControl>
      <InputCaption error={fieldState?.error?.message} caption={description} />
    </InputWrapper>
  )
}

export class RadialInput extends InputComponent<AnyFormikValue> {
  public internalType = 'radio'

  renderComponent(props: RadialInputProps): JSX.Element {
    return <RadialInputInternal {...props} />
  }
}
