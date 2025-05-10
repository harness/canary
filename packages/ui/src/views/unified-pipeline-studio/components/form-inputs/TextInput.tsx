import { Input } from '@components/input'

import { InputComponent, InputProps, useController, type AnyFormikValue } from '@harnessio/forms'

import { InputError } from './common/InputError'
import { InputLabel } from './common/InputLabel'
import { InputTooltip } from './common/InputTooltip'
import { InputWrapper } from './common/InputWrapper'
import { RuntimeInputConfig } from './types/types'

export interface TextInputConfig {
  inputType: 'text'
  inputConfig?: {
    tooltip?: string
  } & RuntimeInputConfig
}

type TextInputProps = InputProps<AnyFormikValue, TextInputConfig>
// TODO: Design system: Replace it with new TextInput component. Check with Srdjan.
function TextInputInternal(props: TextInputProps): JSX.Element {
  const { readonly, path, input } = props
  const { label = '', required, placeholder, description, inputConfig } = input

  const { field } = useController({
    name: path
  })

  return (
    <InputWrapper {...props}>
      <>
        <InputLabel label={label} description={description} required={required} />
        <Input placeholder={placeholder} {...field} disabled={readonly} tabIndex={0} />
        <InputError path={path} />
        {inputConfig?.tooltip && <InputTooltip tooltip={inputConfig.tooltip} />}
      </>
    </InputWrapper>
  )
}

export class TextInput extends InputComponent<AnyFormikValue> {
  public internalType = 'text'

  renderComponent(props: TextInputProps): JSX.Element {
    return <TextInputInternal {...props} />
  }
}
