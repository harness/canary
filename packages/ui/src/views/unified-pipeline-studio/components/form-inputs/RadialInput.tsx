import { FormControl, FormField, FormItem } from '@components/form'
import { RadioSelect } from '@views/components/RadioSelect'

import { InputComponent, InputProps, type AnyFormikValue } from '@harnessio/forms'

import { InputLabel, InputWrapper } from './common'
import { InputError } from './common/InputError'
import { RadioOption } from './types'

export interface RadialInputConfig {
  inputConfig: {
    inputType: 'radio'
    options: RadioOption[]
  }
}

function RadialInputInternal(props: Readonly<InputProps<AnyFormikValue, RadialInputConfig>>): JSX.Element {
  const { path, input } = props
  const { label = '', required, description } = input
  const options = input.inputConfig?.options ?? []

  return (
    <InputWrapper>
      <FormField
        name={path}
        render={({ field }) => (
          <FormItem>
            <InputLabel label={label} description={description} required={required} />
            <FormControl>
              <RadioSelect options={options} value={field.value} onValueChange={field.onChange} id={field.value} />
            </FormControl>
            <InputError path={path} />
          </FormItem>
        )}
      />
    </InputWrapper>
  )
}

export class RadialInput extends InputComponent<AnyFormikValue> {
  public internalType = 'radio'

  renderComponent(props: InputProps<AnyFormikValue>): JSX.Element {
    return <RadialInputInternal {...(props as InputProps<AnyFormikValue, RadialInputConfig>)} />
  }
}
