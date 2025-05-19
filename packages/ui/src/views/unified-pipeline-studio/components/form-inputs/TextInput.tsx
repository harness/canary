import { TextInput as TextInputUI } from '@components/index'

import { InputComponent, InputProps, useController, type AnyFormikValue } from '@harnessio/forms'

import { InputWrapper } from './common/InputWrapper'
import { RuntimeInputConfig } from './types/types'

export interface TextInputConfig {
  inputType: 'text'
  inputConfig?: {
    tooltip?: string
  } & RuntimeInputConfig
}

type TextInputProps = InputProps<AnyFormikValue, TextInputConfig>

function TextInputInternal(props: TextInputProps): JSX.Element {
  const { readonly, path, input } = props
  const { label, required, placeholder, description } = input

  const { field, fieldState } = useController({
    name: path,
    disabled: readonly
  })

  return (
    <InputWrapper {...props}>
      <TextInputUI
        label={label}
        caption={description}
        optional={!required}
        placeholder={placeholder}
        error={fieldState?.error?.message}
        {...field}
      />
    </InputWrapper>
  )
}

export class TextInput extends InputComponent<AnyFormikValue> {
  public internalType = 'text'

  renderComponent(props: TextInputProps): JSX.Element {
    return <TextInputInternal {...props} />
  }
}
