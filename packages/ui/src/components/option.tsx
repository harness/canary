import { FC, ReactElement, ReactNode } from 'react'

import { Checkbox, Label, Radio, Text } from '@/components'
import { cn } from '@utils/cn'

type ControlType = ReactElement<typeof Radio.Item> | ReactElement<typeof Checkbox>

interface OptionProps {
  control: ControlType
  id: string
  label?: string | ReactNode
  description?: string | ReactNode
  className?: string
  ariaSelected?: boolean
}

/**
 * Individual item that contains a control (radio button or checkbox) with optional label and description
 * @example
 * <Option
 *   control={<Radio.Item value="option1" />}
 *   id="option1"
 *   label="Option 1"
 *   description="Description for Option 1"
 * />
 */
export const Option: FC<OptionProps> = ({ control, id, label, description, ariaSelected, className }) => {
  return (
    <div
      className={cn('flex items-start', className)}
      role="option"
      aria-labelledby={`${id}-label`}
      aria-selected={ariaSelected}
    >
      <div className="mt-0.5">{control}</div>
      <div className="flex flex-col gap-0">
        <Label htmlFor={id} className="mb-1 cursor-pointer pl-2.5" variant="primary">
          {label}
        </Label>
        {description && (
          <Text
            className="ml-2.5 leading-snug tracking-tight"
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
