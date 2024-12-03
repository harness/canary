import { FC, ReactElement, ReactNode } from 'react'

import { Checkbox, Label, RadioButton, Text } from '@/components'
import { cn } from '@utils/cn'

type ControlType = ReactElement<typeof RadioButton> | ReactElement<typeof Checkbox>

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
 *   control={<RadioButton value="option1" />}
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
      {control}
      <div className="flex flex-col gap-0">
        <Label htmlFor={id} className="cursor-pointer pl-4 leading-tight">
          {label}
        </Label>
        {description && (
          <Text
            className="ml-4 mt-1.5 leading-snug tracking-tight"
            as="p"
            size={2}
            color="tertiaryBackground"
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
