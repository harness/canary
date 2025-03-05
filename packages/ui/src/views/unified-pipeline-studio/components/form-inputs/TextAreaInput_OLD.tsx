import { FormControl, FormField, FormItem } from '@components/form'
import { Textarea } from '@components/index'

import { InputComponent, InputProps, type AnyFormikValue } from '@harnessio/forms'

import { InputError } from './common/InputError'
import InputLabel from './common/InputLabel'
import InputWrapper from './common/InputWrapper'
import { InputType } from './types'

export interface TextAreaInputConfig {
  inputType: InputType.textarea
}

function TextAreaInputInternal_OLD(props: InputProps<AnyFormikValue>): JSX.Element {
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
              <Textarea placeholder={placeholder} {...field} disabled={readonly} />
            </FormControl>
            <InputError />
          </FormItem>
        )}
      />
    </InputWrapper>
  )
}

export class TextAreaInput_OLD extends InputComponent<AnyFormikValue> {
  public internalType = InputType.textarea

  renderComponent(props: InputProps<AnyFormikValue>): JSX.Element {
    return <TextAreaInputInternal_OLD {...props} />
  }
}
