import { StackedList } from '@components/index'
import { RadioGroup } from '@radix-ui/react-radio-group'
import { cn } from '@utils/cn'

export interface RadioSelectOption<T extends string> {
  id: string
  title: string
  description: string
  value: T
  disabled?: boolean
}

interface RadioSelectProps<T extends string> {
  options: RadioSelectOption<T>[]
  value: T
  onValueChange: (value: T) => void
  id?: string
  className?: string
}

export const RadioSelect = <T extends string>({
  options,
  value,
  onValueChange,
  id,
  className
}: RadioSelectProps<T>) => {
  return (
    <RadioGroup value={value} onValueChange={onValueChange as (value: string) => void} id={id} className={className}>
      <div className="flex flex-col gap-2">
        {options.map(option => (
          <Option
            key={option.id}
            id={option.id}
            control={
              <StackedList.Root
                className={cn('overflow-hidden border-cn-borders-2', {
                  'border-cn-borders-2': value === option.value
                })}
              >
                <StackedList.Item
                  className={cn('cursor-pointer !rounded px-5 py-3', {
                    'bg-gradient-to-b from-white/[0.04] to-white/0': value === option.value,
                    'cursor-not-allowed': option.disabled
                  })}
                  aria-disabled={option.disabled}
                  isHeader
                  isLast
                  disableHover
                  onClick={() => !option.disabled && onValueChange(option.value)}
                >
                  <StackedList.Field
                    title={option.title}
                    description={option.description}
                    className={`${value !== option.value && 'text-cn-foreground-4'}`}
                  />
                </StackedList.Item>
              </StackedList.Root>
            }
          />
        ))}
      </div>
    </RadioGroup>
  )
}

interface OptionProps {
  id: string
  control: React.ReactNode
}

const Option = ({ id, control }: OptionProps) => {
  return <div id={id}>{control}</div>
}
