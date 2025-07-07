import { Switch } from '@components/switch'

import { InputComponent, InputProps, useController, type AnyFormikValue } from '@harnessio/forms'

import { InputCaption } from './common/InputCaption'
import { InputWrapper } from './common/InputWrapper'
import { RuntimeInputConfig } from './types/types'

export interface BooleanFormInputConfig {
  inputType: 'boolean'
  inputConfig?: {
    tooltip?: string
  } & RuntimeInputConfig
}

type BooleanFormInputProps = InputProps<AnyFormikValue, BooleanFormInputConfig>

function BooleanFormInputInternal(props: BooleanFormInputProps): JSX.Element {
  const { readonly, path, input } = props
  const { label = '', required, description } = input

  const { field, fieldState } = useController({
    name: path
  })

  return (
    <InputWrapper {...props}>
      <Switch
        disabled={readonly}
        checked={field.value}
        onCheckedChange={value => {
          field.onChange(value)
        }}
        label={label}
        caption={description}
        showOptionalLabel={!required}
      />
      <InputCaption error={fieldState?.error?.message} />
    </InputWrapper>
  )
}

export class BooleanFormInput extends InputComponent<AnyFormikValue> {
  public internalType = 'boolean'

  renderComponent(props: BooleanFormInputProps): JSX.Element {
    return <BooleanFormInputInternal {...props} />
  }
}
