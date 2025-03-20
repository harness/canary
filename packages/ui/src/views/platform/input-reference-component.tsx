import { ReactNode, useEffect, useState } from 'react'

import { Button, Caption, ControlGroup, Icon, IconProps, Label } from '@/components'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const inputReferenceVariants = cva(
  'flex min-h-9 cursor-pointer items-center justify-between rounded px-3 py-2 transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-input-background text-foreground-1',
        clean: 'bg-transparent'
      },
      size: {
        sm: 'h-8',
        md: 'h-9'
      },
      state: {
        default: 'border-borders-2 border',
        disabled: 'bg-background-3 text-foreground-7 border-borders-1 cursor-not-allowed border'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      state: 'default'
    }
  }
)

export interface InputReferenceProps<T> extends VariantProps<typeof inputReferenceVariants> {
  /**
   * The initial value to display in the input reference
   */
  initialValue: T | null

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
  onClear?: (previousValue?: T) => void

  /**
   * Function to render the value as a ReactNode
   */
  renderValue?: (value: T) => ReactNode

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
  startIcon?: IconProps['name']

  /**
   * Label text to display above the input
   */
  label?: string

  /**
   * Optional caption text to display below the input
   */
  caption?: ReactNode

  /**
   * Whether the field is optional
   */
  optional?: boolean
}

/**
 * InputReference is a component that looks like an input field but acts as a clickable
 * InputReference element that can trigger actions like opening a drawer, modal, or dropdown.
 * It supports generic types for values and maintains its own internal state.
 */
export const InputReference = <T,>({
  initialValue,
  value,
  onClick,
  onEdit,
  onClear,
  disabled = false,
  className,
  startIcon,
  label,
  caption,
  optional = false,
  variant,
  size,
  ...props
}: InputReferenceProps<T>) => {
  const [displayValue, setDisplayValue] = useState<T | null>(initialValue)

  const hasValue = displayValue !== null && displayValue !== initialValue

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDisplayValue(initialValue)
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

  useEffect(() => {
    setDisplayValue(value ?? initialValue)
  }, [initialValue, value])

  const state = disabled ? 'disabled' : 'default'

  return (
    <ControlGroup>
      {!!label && (
        // eslint-disable-next-line i18next/no-literal-string
        <Label className="mb-2.5" color={disabled ? 'disabled-dark' : 'secondary'} optional={optional}>
          {label}
        </Label>
      )}
      <div
        onClick={disabled ? undefined : onClick}
        className={cn(inputReferenceVariants({ variant, size, state }), className)}
        {...props}
      >
        {startIcon && <Icon className="mr-2.5" name={startIcon} />}
        <div className="flex-1 truncate">{displayValue}</div>
        {hasValue && !disabled && (
          <div className="ml-2 flex items-center gap-2">
            <Button onClick={handleEdit} variant="ghost" size="icon">
              <Icon name="edit-pen" />
            </Button>
            <Button onClick={handleClear} variant="ghost" size="icon">
              <Icon name="cross" className="text-destructive" />
            </Button>
          </div>
        )}
      </div>
      {caption && <Caption className="mt-1.5">{caption}</Caption>}
    </ControlGroup>
  )
}
