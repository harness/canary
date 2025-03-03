import { FC, HTMLAttributes, ReactElement, ReactNode } from 'react'

import { Checkbox, Label, RadioButton } from '@/components'
import { cn } from '@utils/cn'

type ControlType = ReactElement<typeof RadioButton> | ReactElement<typeof Checkbox>

interface OptionProps extends HTMLAttributes<HTMLDivElement> {
  control: ControlType
  id: string
  label?: string | ReactNode
  description?: string | ReactNode
  disabled?: boolean
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
export const Option: FC<OptionProps> = ({ control, id, label, description, className, disabled, ...props }) => {
  return (
    <div
      className={cn('flex items-start', className)}
      role="option"
      aria-labelledby={`${id}-label`}
      aria-selected={false}
      {...props}
    >
      {control}
      <div className="flex flex-col gap-0">
        <Label
          htmlFor={id}
          className={cn('cursor-pointer pl-2.5 leading-tight', { 'cursor-default': disabled })}
          color={disabled ? 'disabled' : 'primary'}
        >
          {label}
        </Label>
        {description && (
          <p
            className="ml-2.5 mt-1.5 text-sm leading-snug tracking-tight text-foreground-4"
            id={`${id}-description`}
            role="note"
          >
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
