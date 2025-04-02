import { InputComponent, InputProps, type AnyFormikValue, type UseFormReturn } from '@harnessio/forms'
import { Switch } from '@harnessio/ui/components'

import { FormControl, FormField, FormItem } from '../form'
import { InputError } from './common/InputError'
import InputLabel from './common/InputLabel'
import InputWrapper from './common/InputWrapper'
import { InputType } from './types'

export interface BooleanInputConfig {
  inputType: InputType.boolean
  inputConfig?: {
    onChange: (value: AnyFormikValue, formik: UseFormReturn) => void
  }
}

function BooleanInputInternal(props: InputProps<AnyFormikValue, BooleanInputConfig>): JSX.Element {
  const { readonly, path, input } = props
  const { label = '', required, description } = input

  return (
    <InputWrapper>
      <FormField
        name={path}
        render={({ field }) => (
          <FormItem className="flex space-x-2 space-y-0">
            <FormControl>
              <Switch
                disabled={readonly}
                checked={field.value}
                onCheckedChange={value => {
                  field.onChange(value)
                }}
              />
            </FormControl>
            <InputLabel label={label} required={required} description={description} />
            <InputError />
          </FormItem>
        )}
      />
    </InputWrapper>
  )
}

export class BooleanInput extends InputComponent<AnyFormikValue> {
  public internalType = InputType.boolean

  renderComponent(props: InputProps<AnyFormikValue, BooleanInputConfig>): JSX.Element {
    return <BooleanInputInternal {...props} />
  }
}
