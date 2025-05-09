import { Switch } from '@components/switch'

import { InputComponent, InputProps, useController, type AnyFormikValue, type UseFormReturn } from '@harnessio/forms'

import { InputError } from './common/InputError'
import { InputTooltip } from './common/InputTooltip'
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
  const { label = '', required, description, inputConfig } = input

  const { field } = useController({
    name: path
  })

  return (
    <InputWrapper {...props}>
      <>
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
        <InputError path={path} />
        {inputConfig?.tooltip && <InputTooltip tooltip={inputConfig.tooltip} />}
      </>
    </InputWrapper>
  )
}

export class BooleanInput extends InputComponent<AnyFormikValue> {
  public internalType = 'boolean'

  renderComponent(props: BooleanInputInternalProps): JSX.Element {
    return <BooleanInputInternal {...props} />
  }
}
