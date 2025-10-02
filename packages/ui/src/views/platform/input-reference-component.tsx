import { ForwardedRef, forwardRef, ReactNode, Ref } from 'react'

import {
  ButtonGroup,
  CommonInputsProp,
  ControlGroup,
  DropdownMenu,
  FormCaption,
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
  'h-cn-input-md border-cn-input rounded-cn-input bg-cn-input text-cn-1 flex cursor-pointer select-none items-center transition-colors min-w-0 grow',
  {
    variants: {
      state: {
        default:
          'hover:border-cn-brand focus-visible:shadow-ring-selected focus-visible:outline-none focus-visible:border-cn-brand',
        disabled: 'opacity-cn-disabled cursor-not-allowed'
      }
    },
    defaultVariants: {
      state: 'default'
    }
  }
)

export interface InputReferenceProps<T> extends VariantProps<typeof inputReferenceVariants>, CommonInputsProp {
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

  dropdownTriggerRef?: Ref<HTMLButtonElement>
}

/**
 * InputReference is a component that looks like an input field but acts as a clickable
 * InputReference element that can trigger actions like opening a drawer, modal, or dropdown.
 * It supports generic types for values.
 */
const InputReferenceInner = <T,>(
  {
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
    orientation = 'vertical',
    labelSuffix,
    tooltipProps,
    tooltipContent,
    dropdownTriggerRef,
    ...props
  }: InputReferenceProps<T>,
  ref: ForwardedRef<HTMLDivElement>
) => {
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
  const isHorizontal = orientation === 'horizontal'

  return (
    <ControlGroup.Root className={wrapperClassName} orientation={orientation}>
      {(!!label || (isHorizontal && !!caption)) && (
        <ControlGroup.LabelWrapper>
          {!!label && (
            <Label
              disabled={disabled}
              optional={optional}
              suffix={labelSuffix}
              tooltipProps={tooltipProps}
              tooltipContent={tooltipContent}
            >
              {label}
            </Label>
          )}
          {isHorizontal && !!caption && <FormCaption disabled={disabled}>{caption}</FormCaption>}
        </ControlGroup.LabelWrapper>
      )}

      <ControlGroup.InputWrapper>
        <Layout.Horizontal gap="sm" className="w-full">
          <div
            ref={ref}
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
            <Layout.Horizontal className="grow pi-cn-input-md min-w-0" gap="xs" align="center" justify="between">
              {iconProps && <IconV2 {...iconProps} fallback="circle" />}

              {logo && <LogoV2 name={logo} size="xs" />}

              <div
                className={cn(`flex-1 truncate`, {
                  'text-cn-disabled': !hasValue
                })}
              >
                {displayContent}
              </div>
            </Layout.Horizontal>

            {suffix && (
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
            )}
          </div>
          {hasValue && !disabled && (
            <ButtonGroup
              iconOnly
              size="md"
              buttonsProps={[
                {
                  ref: dropdownTriggerRef,
                  children: <IconV2 name="more-vert" />,
                  dropdownProps: {
                    contentProps: {
                      align: 'end'
                    },
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

        {caption && !isHorizontal && <FormCaption disabled={disabled}>{caption}</FormCaption>}
      </ControlGroup.InputWrapper>
    </ControlGroup.Root>
  )
}

const InputReference = forwardRef(InputReferenceInner) as <T>(
  props: InputReferenceProps<T> & { ref?: ForwardedRef<HTMLDivElement> }
) => ReturnType<typeof InputReferenceInner>

export { InputReference }
