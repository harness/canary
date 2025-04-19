import { FC, ReactElement, ReactNode } from 'react'

import { Checkbox, Label, LabelProps, RadioButton, Text } from '@/components'
import { cn } from '@utils/cn'

type ControlType = ReactElement<typeof RadioButton> | ReactElement<typeof Checkbox>

interface OptionProps {
  control: ControlType
  id: string
  label?: string | ReactNode
  description?: string | ReactNode
  className?: string
  ariaSelected?: boolean
  labelProps?: Partial<LabelProps>
}

/**
 * Individual item that contains a control (radio button or checkbox) with optional label and description
 * @example
 * <Option
 *   control={<RadioButton value="option1" />}
 *   id="option1"
 *   label="Option 1"
 *   description="Description for Option 1"
 * />
 */
export const Option: FC<OptionProps> = ({
  control,
  id,
  label,
  description,
  ariaSelected,
  className,
  labelProps = {}
}) => {
  return (
    <div
      className={cn('flex items-start', className)}
      role="option"
      aria-labelledby={`${id}-label`}
      aria-selected={ariaSelected}
    >
      {control}
      <div className="flex flex-col gap-0">
        {!!label && (
          <Label {...labelProps} className="cursor-pointer pl-2.5 leading-tight" htmlFor={id}>
            {label}
          </Label>
        )}
        {!!description && (
          <Text
            className="ml-2.5 mt-1.5 leading-snug tracking-tight"
            as="p"
            size={2}
            color="foreground-4"
            id={`${id}-description`}
            role="note"
          >
            {description}
          </Text>
        )}
      </div>
    </div>
  )
}
