import { Textarea } from '@components/index'

import { InputComponent, InputProps, useController, type AnyFormikValue } from '@harnessio/forms'

import { InputError } from './common/InputError'
import { InputLabel } from './common/InputLabel'
import { InputTooltip } from './common/InputTooltip'
import { InputWrapper } from './common/InputWrapper'
import { RuntimeInputConfig } from './types/types'

export interface TextAreaInputConfig {
  inputType: 'textarea'
  inputConfig?: {
    tooltip?: string
  } & RuntimeInputConfig
}

type TextAreaInputProps = InputProps<AnyFormikValue, TextAreaInputConfig>

function TextAreaInputInternal(props: TextAreaInputProps): JSX.Element {
  const { readonly, path, input } = props
  const { label = '', required, placeholder, description, inputConfig } = input

  const { field } = useController({
    name: path
  })

  return (
    <InputWrapper {...props}>
      <>
        <InputLabel label={label} description={description} required={required} />
        <Textarea placeholder={placeholder} {...field} disabled={readonly} />
        <InputError path={path} />
        {inputConfig?.tooltip && <InputTooltip tooltip={inputConfig.tooltip} />}
      </>
    </InputWrapper>
  )
}

export class TextAreaInput extends InputComponent<AnyFormikValue> {
  public internalType = 'textarea'

  renderComponent(props: TextAreaInputProps): JSX.Element {
    return <TextAreaInputInternal {...props} />
  }
}
