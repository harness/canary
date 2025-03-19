import { Switch } from '@components/switch'

import { InputComponent, InputProps, useController, type AnyFormikValue, type UseFormReturn } from '@harnessio/forms'

import { InputError } from './common/InputError'
import { InputLabel } from './common/InputLabel'
import { InputWrapper } from './common/InputWrapper'

export interface BooleanInputConfig {
  inputType: 'boolean'
  inputConfig?: {
    onChange: (value: AnyFormikValue, formik: UseFormReturn) => void
  }
}

function BooleanInputInternal(props: InputProps<AnyFormikValue, BooleanInputConfig>): JSX.Element {
  const { readonly, path, input } = props
  const { label = '', required, description } = input

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
      />
      <InputLabel label={label} required={required} description={description} />
      <InputError path={path} />
    </InputWrapper>
  )
}

export class BooleanInput extends InputComponent<AnyFormikValue> {
  public internalType = 'boolean'

  renderComponent(props: InputProps<AnyFormikValue, BooleanInputConfig>): JSX.Element {
    return <BooleanInputInternal {...props} />
  }
}
