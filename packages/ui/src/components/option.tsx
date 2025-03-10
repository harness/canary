import { FC, HTMLAttributes, ReactElement, ReactNode } from 'react'

import { Caption, Checkbox, Label, Message, MessageTheme, RadioButton } from '@/components'
import { cn } from '@utils/cn'

type ControlType = ReactElement<typeof RadioButton> | ReactElement<typeof Checkbox>

interface OptionProps extends HTMLAttributes<HTMLDivElement> {
  control: ControlType
  id: string
  label?: string | ReactNode
  description?: string | ReactNode
  disabled?: boolean
  error?: string
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
export const Option: FC<OptionProps> = ({ control, id, label, description, className, disabled, error, ...props }) => {
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

        {!!error && (
          <Message className="mt-0.5" theme={MessageTheme.ERROR}>
            {error}
          </Message>
        )}

        {description && (
          <Caption className="ml-2.5 tracking-tight" id={`${id}-description`} role="note">
            {description}
          </Caption>
        )}
      </div>
    </div>
  )
}
