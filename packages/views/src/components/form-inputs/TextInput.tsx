import { InputComponent, InputProps, type AnyFormikValue } from '@harnessio/forms'
import { Input } from '@harnessio/ui/components'

import { FormControl, FormField, FormItem } from '../form'
import { InputError } from './common/InputError'
import InputLabel from './common/InputLabel'
import InputWrapper from './common/InputWrapper'
import { InputType } from './types'

export interface TextInputConfig {
  inputType: InputType.text
}

function TextInputInternal(props: InputProps<AnyFormikValue>): JSX.Element {
  const { readonly, path, input } = props
  const { label = '', required, placeholder, description } = input

  return (
    <InputWrapper>
      <FormField
        name={path}
        render={({ field }) => (
          <FormItem>
            <InputLabel label={label} description={description} required={required} />
            <FormControl>
              <Input placeholder={placeholder} {...field} disabled={readonly} tabIndex={0} />
            </FormControl>
            <InputError />
          </FormItem>
        )}
      />
    </InputWrapper>
  )
}

export class TextInput extends InputComponent<AnyFormikValue> {
  public internalType = InputType.text

  renderComponent(props: InputProps<AnyFormikValue>): JSX.Element {
    return <TextInputInternal {...props} />
  }
}
