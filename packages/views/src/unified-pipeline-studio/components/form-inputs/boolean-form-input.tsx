import { Switch } from '@harnessio/ui/components'

import { IInputDefinition, InputComponent, InputProps, useController, type AnyFormValue } from '@harnessio/forms'

import { InputCaption } from './common/InputCaption'
import { InputWrapper } from './common/InputWrapper'
import { RuntimeInputConfig } from './types/types'

export type BooleanFormInputConfig = RuntimeInputConfig

export type BooleanFormInputDefinition = IInputDefinition<BooleanFormInputConfig, AnyFormValue, 'boolean'>

type BooleanFormInputProps = InputProps<AnyFormValue, BooleanFormInputConfig>

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

export class BooleanFormInput extends InputComponent<AnyFormValue> {
  public internalType = 'boolean'

  renderComponent(props: BooleanFormInputProps): JSX.Element {
    return <BooleanFormInputInternal {...props} />
  }
}
