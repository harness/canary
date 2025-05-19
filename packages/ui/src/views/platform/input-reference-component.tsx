import { ReactNode } from 'react'

import { Button, Caption, ControlGroup, Icon, IconProps, Label } from '@/components'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const inputReferenceVariants = cva(
  'flex h-9 min-h-9 cursor-pointer items-center justify-between rounded bg-cn-background-2 px-3 py-2 text-cn-foreground-1 transition-colors',
  {
    variants: {
      state: {
        default: 'border border-cn-borders-2',
        disabled: 'cursor-not-allowed border border-cn-borders-1 bg-cn-background-3 text-cn-foreground-3'
      }
    },
    defaultVariants: {
      state: 'default'
    }
  }
)

export interface InputReferenceProps<T> extends VariantProps<typeof inputReferenceVariants> {
  /**
   * The initial value to display in the input reference
   */
  placeholder: string | ReactNode

  /**
   * The current value of the input reference
   */
  value?: T | null

  /**
   * Function called when the input reference is clicked
   */
  onClick?: () => void

  /**
   * Function called when the edit (pencil) icon is clicked
   */
  onEdit?: () => void

  /**
   * Function called when the clear (cross) icon is clicked
   */
  onClear?: () => void

  /**
   * Function to render the value as a ReactNode
   */
  renderValue?: (value: T) => ReactNode | string

  /**
   * Whether the input reference is disabled
   */
  disabled?: boolean

  /**
   * Additional className for styling
   */
  className?: string

  /**
   * Icon to display at the start of the input
   */
  icon?: IconProps['name']

  /**
   * Label text to display above the input
   */
  label?: string

  /**
   * Optional caption text to display below the input
   */
  caption?: string

  /**
   * Whether the field is optional
   */
  optional?: boolean
}

/**
 * InputReference is a component that looks like an input field but acts as a clickable
 * InputReference element that can trigger actions like opening a drawer, modal, or dropdown.
 * It supports generic types for values.
 */
export const InputReference = <T,>({
  placeholder,
  value,
  onClick,
  onEdit,
  onClear,
  disabled = false,
  className,
  icon,
  label,
  caption,
  optional = false,
  renderValue,
  ...props
}: InputReferenceProps<T>) => {
  // Determine what to display: rendered value if value exists, otherwise placeholder
  const hasValue = value !== null && value !== undefined
  const displayContent = hasValue ? (renderValue ? renderValue(value as T) : value) : placeholder

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClear?.()
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onEdit) {
      onEdit()
    } else if (onClick) {
      onClick()
    }
  }

  const state = disabled ? 'disabled' : 'default'

  return (
    <ControlGroup>
      {!!label && (
        <Label className="mb-2" disabled={disabled} optional={optional}>
          {label}
        </Label>
      )}
      <div
        onClick={disabled ? undefined : onClick}
        className={cn(inputReferenceVariants({ state }), className)}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onKeyDown={e => {
          if (disabled) return
          if (e.key === 'Enter' || e.key === ' ') {
            onClick?.()
          }
        }}
        {...props}
      >
        {icon && <Icon className="mr-2.5" name={icon} />}
        <div className="flex-1 truncate">{displayContent}</div>
        {hasValue && !disabled && (
          <div className="ml-3 flex items-center">
            <Button onClick={handleEdit} size="sm" variant="ghost" iconOnly>
              <Icon name="edit-pen" />
            </Button>
            <Button onClick={handleClear} size="sm" variant="ghost" iconOnly>
              <Icon name="cross" className="text-cn-foreground-danger" />
            </Button>
          </div>
        )}
      </div>
      {caption && <Caption className="mt-1.5">{caption}</Caption>}
    </ControlGroup>
  )
}
