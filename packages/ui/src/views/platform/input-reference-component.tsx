import { ReactNode } from 'react'

import {
  ButtonGroup,
  Caption,
  ControlGroup,
  DropdownMenu,
  IconPropsV2,
  IconV2,
  Label,
  Layout,
  LogoPropsV2,
  LogoV2,
  Text
} from '@/components'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const inputReferenceVariants = cva(
  'h-cn-input-md border-cn-input rounded-cn-input bg-cn-input text-cn-1 flex cursor-pointer select-none items-center transition-colors outline-offset-cn-tight',
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
  iconProps?: {
    name: IconPropsV2['name']
    size?: IconPropsV2['size']
    color?: IconPropsV2['color']
  }

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
  iconProps,
  logo,
  label,
  caption,
  optional = false,
  renderValue,
  suffix,
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
      <Layout.Horizontal className="w-full">
        <div
          onClick={disabled ? undefined : onClick}
          className={cn(inputReferenceVariants({ state }), className, 'flex-1')}
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
            {iconProps && <IconV2 className="mr-2.5" {...iconProps} fallback="circle" />}
            {logo && <LogoV2 className="mr-2.5" name={logo} size="xs" />}
            <div
              className={cn(`flex-1 truncate`, {
                'text-cn-disabled': !hasValue
              })}
            >
              {displayContent}
            </div>
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
        {!!hasValue && !disabled && (
          <ButtonGroup
            iconOnly
            size="md"
            buttonsProps={[
              {
                children: <IconV2 name="more-vert" />,
                dropdownProps: {
                  content: (
                    <>
                      <DropdownMenu.IconItem title="Replace" icon="refresh-double" onClick={handleOpen} />
                      <DropdownMenu.IconItem title="Edit" icon="edit-pencil" onClick={handleEdit} />
                      <DropdownMenu.IconItem
                        title={<Text color="danger">Clear</Text>}
                        icon="trash"
                        onClick={handleClear}
                        iconClassName="text-cn-danger"
                      />
                    </>
                  )
                }
              }
            ]}
          />
        )}
      </Layout.Horizontal>

      {caption && <Caption className="mt-1.5">{caption}</Caption>}
    </ControlGroup>
  )
}
