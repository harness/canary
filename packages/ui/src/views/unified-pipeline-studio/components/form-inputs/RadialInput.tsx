import { FormControl, FormField, FormItem } from '@components/form'
import { RadioSelect } from '@views/components/RadioSelect'

import { InputComponent, InputProps, type AnyFormikValue } from '@harnessio/forms'

import { InputLabel, InputWrapper } from './common'
import { InputError } from './common/InputError'
import { InputTooltip } from './common/InputTooltip'
import { RadioOption } from './types'
import { RuntimeInputConfig } from './types/types'

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
  const { label = '', required, description, inputConfig } = input
  const options = inputConfig?.options ?? []

  return (
    <InputWrapper {...props}>
      <FormField
        name={path}
        render={({ field }) => (
          <FormItem>
            <InputLabel label={label} description={description} required={required} />
            <FormControl>
              <RadioSelect options={options} value={field.value} onValueChange={field.onChange} id={field.value} />
            </FormControl>
            <InputError path={path} />

            {inputConfig?.tooltip && <InputTooltip tooltip={inputConfig.tooltip} />}
          </FormItem>
        )}
      />
    </InputWrapper>
  )
}

export class RadialInput extends InputComponent<AnyFormikValue> {
  public internalType = 'radio'

  renderComponent(props: RadialInputProps): JSX.Element {
    return <RadialInputInternal {...props} />
  }
}
