import { Layout } from '@components/layout'
import { Switch } from '@components/switch'

import { InputComponent, InputProps, useController, type AnyFormikValue, type UseFormReturn } from '@harnessio/forms'

import { InputError } from './common/InputError'
import { InputLabel } from './common/InputLabel'
import { InputTooltip } from './common/InputTooltip'
import { InputWrapper } from './common/InputWrapper'

export interface BooleanInputConfig {
  inputType: 'boolean'
  inputConfig?: {
    onChange: (value: AnyFormikValue, formik: UseFormReturn) => void
    tooltip?: string
  }
}

function BooleanInputInternal(props: InputProps<AnyFormikValue, BooleanInputConfig>): JSX.Element {
  const { readonly, path, input } = props
  const { label = '', required, description, inputConfig } = input

  const { field } = useController({
    name: path
  })

  return (
    <InputWrapper>
      {/* TODO: check styling we have on FormItem/}
      {/* <FormItem className="flex space-x-2 space-y-0">  */}
      <Switch
        disabled={readonly}
        checked={field.value}
        onCheckedChange={value => {
          field.onChange(value)
        }}
        label={label}
        description={description}
        required={required}
      />

      <InputError path={path} />

      {inputConfig?.tooltip && <InputTooltip tooltip={inputConfig.tooltip} />}
    </InputWrapper>
  )
}

export class BooleanInput extends InputComponent<AnyFormikValue> {
  public internalType = 'boolean'

  renderComponent(props: InputProps<AnyFormikValue, BooleanInputConfig>): JSX.Element {
    return <BooleanInputInternal {...props} />
  }
}
