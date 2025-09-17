import { ReactNode } from 'react'

import { Button, Caption, ControlGroup, IconPropsV2, IconV2, Label, LogoPropsV2, LogoV2 } from '@/components'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const inputReferenceVariants = cva(
  'h-cn-input-md border-cn-input rounded-cn-input bg-cn-input text-cn-1 flex cursor-pointer select-none items-center transition-colors',
  {
    variants: {
      state: {
        default: '',
        disabled: 'opacity-cn-disabled cursor-not-allowed'
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
   * Additional className for styling Control Group
   */
  wrapperClassName?: string

  /**
   * Icon to display at the start of the input
   */
  icon?: IconPropsV2['name']

  /**
   * Logo to display at the start of the input
   */
  logo?: LogoPropsV2['name']

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

  /**
   * Suffix element to display at the end of the input
   */
  suffix?: ReactNode

  /**
   * Whether to show the reset button
   */
  showReset?: boolean

  /**
   * Function called when the open (arrow) icon is clicked
   */
  onOpen?: () => void
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
  logo,
  label,
  caption,
  optional = false,
  renderValue,
  suffix,
  showReset = true,
  onOpen,
  wrapperClassName = '',
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

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onOpen) {
      onOpen()
    } else if (onClick) {
      onClick()
    }
  }

  const state = disabled ? 'disabled' : 'default'

  return (
    <ControlGroup className={wrapperClassName}>
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
        <div className="flex w-full items-center justify-between pl-cn-input-md">
          {icon && <IconV2 className="mr-2.5" name={icon} />}
          {logo && <LogoV2 className="mr-2.5" name={logo} size="xs" />}
          <div
            className={cn(`flex-1 truncate`, {
              'text-cn-disabled': !hasValue
            })}
          >
            {displayContent}
          </div>
          {hasValue && !disabled && (
            <div className="ml-3 flex items-center">
              <Button onClick={handleEdit} size="sm" variant="ghost" iconOnly tooltipProps={{ content: 'Edit' }}>
                <IconV2 name="edit-pencil" />
              </Button>
              {showReset && (
                <Button onClick={handleClear} size="sm" variant="ghost" iconOnly ignoreIconOnlyTooltip>
                  <IconV2 name="xmark" color="danger" />
                </Button>
              )}
            </div>
          )}
          {!!onOpen && !disabled && (
            <Button onClick={handleOpen} size="sm" variant="ghost" iconOnly tooltipProps={{ content: 'Open' }}>
              <IconV2 name="nav-arrow-right" />
            </Button>
          )}
        </div>
        {suffix ? (
          <div
            className="aspect-1 flex h-full items-center justify-center rounded-l-none border-l border-inherit"
            // Don't trigger onClick of the parent div when suffix is clicked
            onPointerDown={e => {
              e.stopPropagation()
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation()
              }
            }}
            role="none"
          >
            {suffix}
          </div>
        ) : null}
      </div>
      {caption && <Caption className="mt-1.5">{caption}</Caption>}
    </ControlGroup>
  )
}
