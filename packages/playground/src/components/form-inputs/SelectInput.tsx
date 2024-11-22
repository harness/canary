import {
  FormControl,
  FormField,
  FormItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@harnessio/canary'
import { AnyFormikValue, InputComponent, InputProps } from '@harnessio/forms'

import { InputError } from './common/InputError'
import InputLabel from './common/InputLabel'
import InputWrapper from './common/InputWrapper'
import { InputType } from './types'

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
  const { readonly, path, input } = props
  const { label = '', required, placeholder, description, inputConfig } = input

  return (
    <InputWrapper>
      <FormField
        name={path}
        render={({ field }) => (
          <FormItem>
            <InputLabel label={label} description={description} required={required} />
            <FormControl>
              <Select
                disabled={readonly}
                value={field.value}
                onValueChange={value => {
                  field.onChange(value)
                }}
              >
                <SelectTrigger ref={field.ref}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {inputConfig?.options.map(item => {
                    return (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </FormControl>
            <InputError />
          </FormItem>
        )}
      />
    </InputWrapper>
  )
}

export class SelectInput extends InputComponent<AnyFormikValue> {
  public internalType = InputType.select

  renderComponent(props: InputProps<AnyFormikValue, SelectInputConfig>): JSX.Element {
    return <SelectInputInternal {...props} />
  }
}
