import { Textarea } from '@components/index'

import { IInputDefinition, InputComponent, InputProps, useController, type AnyFormValue } from '@harnessio/forms'

import { InputWrapper } from './common/InputWrapper'
import { RuntimeInputConfig } from './types/types'

export interface TextareaFormInputConfig extends RuntimeInputConfig {
  tooltip?: string
}

export type TextareaFormInputDefinition = IInputDefinition<TextareaFormInputConfig, AnyFormValue, 'textarea'>

type TextareaFormInputProps = InputProps<AnyFormValue, TextareaFormInputConfig>

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

export class TextareaFormInput extends InputComponent<AnyFormValue> {
  public internalType = 'textarea'

  renderComponent(props: TextareaFormInputProps): JSX.Element {
    return <TextareaFormInputInternal {...props} />
  }
}
