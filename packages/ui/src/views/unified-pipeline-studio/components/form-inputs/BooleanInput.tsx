import { Switch } from '@components/switch'

import { InputComponent, InputProps, useController, type AnyFormikValue, type UseFormReturn } from '@harnessio/forms'

import { InputCaption } from './common/InputCaption'
import { InputWrapper } from './common/InputWrapper'
import { RuntimeInputConfig } from './types/types'

export interface BooleanInputConfig {
  inputType: 'boolean'
  inputConfig?: {
    onChange: (value: AnyFormikValue, formik: UseFormReturn) => void
    tooltip?: string
  } & RuntimeInputConfig
}

type BooleanInputInternalProps = InputProps<AnyFormikValue, BooleanInputConfig>

function BooleanInputInternal(props: BooleanInputInternalProps): JSX.Element {
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
      <InputCaption error={fieldState?.error?.message} caption={description} />
    </InputWrapper>
  )
}

export class BooleanInput extends InputComponent<AnyFormikValue> {
  public internalType = 'boolean'

  renderComponent(props: BooleanInputInternalProps): JSX.Element {
    return <BooleanInputInternal {...props} />
  }
}
