import { TextInput } from '@harnessio/ui/components'

import { IInputDefinition, InputComponent, InputProps, useController, type AnyFormValue } from '@harnessio/forms'

import { InputWrapper } from './common/InputWrapper'
import { RuntimeInputConfig } from './types/types'

export interface TextFormInputConfig extends RuntimeInputConfig {
  tooltip?: string
}

export type TextFormInputDefinition = IInputDefinition<TextFormInputConfig, AnyFormValue, 'text'>

type TextFormInputProps = InputProps<AnyFormValue, TextFormInputConfig>

function TextFormInputInternal(props: TextFormInputProps): JSX.Element {
  const { readonly, path, input } = props
  const { label, required, placeholder, description } = input

  const { field, fieldState } = useController({
    name: path,
    disabled: readonly
  })

  return (
    <InputWrapper {...props}>
      <TextInput
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

export class TextFormInput extends InputComponent<AnyFormValue> {
  public internalType = 'text'

  renderComponent(props: TextFormInputProps): JSX.Element {
    return <TextFormInputInternal {...props} />
  }
}
