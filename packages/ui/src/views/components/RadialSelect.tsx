import { RadioButton, StackedList } from '@components/index'
import { RadioGroup } from '@radix-ui/react-radio-group'
import { cn } from '@utils/cn'

export interface RadialOption<T extends string> {
  id: string
  title: string
  description: string
  value: T
}

interface RadialSelectProps<T extends string> {
  options: RadialOption<T>[]
  value: T
  onValueChange: (value: T) => void
  id?: string
  className?: string
}

export const RadialSelect = <T extends string>({
  options,
  value,
  onValueChange,
  id,
  className
}: RadialSelectProps<T>) => {
  return (
    <RadioGroup value={value} onValueChange={onValueChange as (value: string) => void} id={id} className={className}>
      <div className="flex flex-col gap-2">
        {options.map(option => (
          <Option
            key={option.id}
            id={option.id}
            control={
              <StackedList.Root className="overflow-hidden" borderBackground>
                <StackedList.Item
                  className={cn('cursor-pointer !rounded px-5 py-3', {
                    '!bg-background-4': value === option.value
                  })}
                  isHeader
                  isLast
                  actions={<RadioButton value={option.value} />}
                  onClick={() => onValueChange(option.value)}
                >
                  <StackedList.Field title={option.title} description={option.description} />
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
