import { FormControl, FormField, FormItem } from '@components/form'
import { StackedList } from '@components/index'
import { RadioButton, RadioGroup } from '@components/radio'
import { cn } from '@utils/cn'

import { InputComponent, InputProps, type AnyFormikValue } from '@harnessio/forms'

import { InputError } from './common/InputError'
import InputLabel from './common/InputLabel'
import InputWrapper from './common/InputWrapper'
import { InputType } from './types'

interface OptionProps {
  label: string
  description: string
  value: string
  selected: boolean
  onSelect: (value: string) => void
  disabled?: boolean
}

const Option = ({ description, value, selected, onSelect, disabled, label }: OptionProps) => (
  <div id={label}>
    <StackedList.Root className="overflow-hidden" borderBackground>
      <StackedList.Item
        className={cn('cursor-pointer !rounded px-5 py-3', {
          '!bg-background-4': selected
        })}
        isHeader
        isLast
        actions={<RadioButton value={value} disabled={disabled} />}
        onClick={() => onSelect(value)}
      >
        <StackedList.Field title={label} description={description} />
      </StackedList.Item>
    </StackedList.Root>
  </div>
)

export interface RadialOption {
  label: string
  description: string
  value: string
}

export interface RadialInputConfig {
  inputConfig: {
    inputType: InputType.radio
    options: RadialOption[]
  }
}

function RadialInputInternal(props: InputProps<AnyFormikValue, RadialInputConfig>): JSX.Element {
  const { readonly, path, input } = props
  const { label = '', required, description } = input
  const options = input.inputConfig?.options ?? []

  return (
    <InputWrapper>
      <FormField
        name={path}
        render={({ field }) => (
          <FormItem>
            <InputLabel label={label} description={description} required={required} />
            <FormControl>
              <RadioGroup value={field.value} onValueChange={field.onChange} id={path}>
                <div className="flex flex-col gap-2">
                  {options.map(option => (
                    <Option
                      key={option.label}
                      label={option.label}
                      description={option.description}
                      value={option.value}
                      selected={field.value === option.value}
                      onSelect={field.onChange}
                      disabled={readonly}
                    />
                  ))}
                </div>
              </RadioGroup>
            </FormControl>
            <InputError path={path} />
          </FormItem>
        )}
      />
    </InputWrapper>
  )
}

export class RadialInput extends InputComponent<AnyFormikValue> {
  public internalType = InputType.radio

  renderComponent(props: InputProps<AnyFormikValue>): JSX.Element {
    return <RadialInputInternal {...(props as InputProps<AnyFormikValue, RadialInputConfig>)} />
  }
}
