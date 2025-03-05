import { FormControl, FormField, FormItem } from '@components/form'
import { RadioButton, RadioGroup } from '@components/radio'

import { InputComponent, InputProps, type AnyFormikValue } from '@harnessio/forms'

import { InputError } from './common/InputError'
import InputLabel from './common/InputLabel'
import InputWrapper from './common/InputWrapper'
import { InputType } from './types'

export interface RadialInputConfig {
  inputConfig: {
    inputType: InputType.radio
    options: string[]
  }
}

function RadialInputInternal(props: InputProps<AnyFormikValue, RadialInputConfig>): JSX.Element {
  const { readonly, path, input } = props
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
              <RadioGroup className="grid gap-2">
                {options.map((option: string, index: number) => (
                  <label key={index} htmlFor={`${path}-${option}`} className="flex items-start gap-3 rounded-lg border p-4">
                    <RadioButton {...field} id={`${path}-${option}`} value={option} disabled={readonly} className="mt-1" />
                    <div className="flex flex-col">
                      <span className="font-medium">{option}</span>
                      <span className="text-sm">Connect to GitHub {option}</span>
                    </div>
                  </label>
                ))}
              </RadioGroup>
            </FormControl>
            <InputError />
          </FormItem>
        )}
      />
    </InputWrapper>
  )
}

export class RadialInput extends InputComponent<AnyFormikValue> {
  public internalType = InputType.radio

  renderComponent(props: InputProps<AnyFormikValue>): JSX.Element {
    return <RadialInputInternal {...(props as InputProps<AnyFormikValue, RadialInputConfig>)} />
  }
}
