import { Textarea } from '@components/index'

import { InputComponent, InputProps, useController, type AnyFormikValue } from '@harnessio/forms'

import { InputWrapper } from './common/InputWrapper'
import { RuntimeInputConfig } from './types/types'

export interface TextareaFormInputConfig {
  inputType: 'textarea'
  inputConfig?: {
    tooltip?: string
  } & RuntimeInputConfig
}

type TextareaFormInputProps = InputProps<AnyFormikValue, TextareaFormInputConfig>

function TextareaFormInputInternal(props: TextareaFormInputProps): JSX.Element {
  const { readonly, path, input } = props
  const { label, required, placeholder, description } = input

  const { field, fieldState } = useController({
    name: path,
    disabled: readonly
  })

  return (
    <InputWrapper {...props}>
      <Textarea
        label={label}
        optional={!required}
        placeholder={placeholder}
        caption={description}
        error={fieldState?.error?.message}
        {...field}
      />
    </InputWrapper>
  )
}

export class TextareaFormInput extends InputComponent<AnyFormikValue> {
  public internalType = 'textarea'

  renderComponent(props: TextareaFormInputProps): JSX.Element {
    return <TextareaFormInputInternal {...props} />
  }
}
