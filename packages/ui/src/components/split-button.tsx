import { ForwardedRef, forwardRef, MouseEvent, ReactNode, useCallback, useState } from 'react'

import { Button, ButtonProps, buttonVariants } from '@/components/button'
import { DropdownMenu } from '@components/dropdown-menu'
import { cn } from '@utils/cn'

import { IconV2 } from './icon-v2'

export interface SplitButtonOptionType<T extends string> {
  value: T
  label: string
  description?: string
  disabled?: boolean
}

// Base props shared by all variants
interface SplitButtonBaseProps<T extends string> {
  handleButtonClick: (e: MouseEvent) => void
  loading?: boolean
  selectedValue?: T
  options: SplitButtonOptionType<T>[]
  handleOptionChange: (val: T) => void
  className?: string
  buttonClassName?: string
  disabled?: boolean
  disableButton?: boolean
  disableDropdown?: boolean
  children: ReactNode
  dropdownContentClassName?: string
  size?: 'sm' | 'md' | 'xs'
}

// Base props with all possible variants and themes
export interface SplitButtonProps<T extends string> extends SplitButtonBaseProps<T> {
  variant?: ButtonProps['variant']
  theme?: ButtonProps['theme']
}

/**
 * Button with options
 * - If selectedValue exists, it will behave as a radio button
 * - Otherwise, it will function as a regular dropdown item
 *
 * Supported combinations:
 * - variant=solid with theme=primary (default)
 * - variant=surface with theme=success|danger|muted
 */
const SplitButtonInner = forwardRef(
  <T extends string>(
    {
      handleButtonClick,
      loading = false,
      selectedValue,
      options,
      handleOptionChange,
      className,
      buttonClassName,
      theme = 'default',
      variant = 'primary',
      disabled = false,
      disableDropdown = false,
      disableButton = false,
      children,
      dropdownContentClassName,
      size = 'md'
    }: SplitButtonProps<T>,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    const [isOpen, setIsOpen] = useState(false)

    const handleOptionSelect = useCallback(
      (optionValue: T) => {
        const option = options.find(opt => opt.value === optionValue)
        if (!loading && option && !option.disabled) {
          handleOptionChange(optionValue)
          setIsOpen(false) // Close dropdown after selection
        }
      },
      [loading, options, handleOptionChange]
    )

    return (
      <div className={cn('flex', className)}>
        <Button
          ref={ref}
          className={cn('rounded-r-cn-none border-r-0', buttonClassName)}
          theme={theme}
          variant={variant}
          size={size}
          onClick={handleButtonClick}
          type="button"
          disabled={disabled || disableButton}
          loading={loading}
        >
          {children}
        </Button>
        <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenu.Trigger
            className={cn(buttonVariants({ theme, variant, size }), 'cn-button-split-dropdown')}
            disabled={disabled || loading || disableDropdown}
          >
            <IconV2 name="nav-arrow-down" />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className={cn('max-w-80', dropdownContentClassName)} align="end">
            {selectedValue ? (
              <DropdownMenu.RadioGroup
                value={String(selectedValue)}
                onValueChange={value => {
                  const option = options.find(opt => String(opt.value) === value)
                  if (option) {
                    handleOptionSelect(option.value)
                  }
                }}
              >
                {options.map(option => (
                  <DropdownMenu.RadioItem
                    title={option.label}
                    description={option?.description}
                    value={String(option.value)}
                    key={String(option.value)}
                    disabled={loading || option.disabled}
                  />
                ))}
              </DropdownMenu.RadioGroup>
            ) : (
              <DropdownMenu.Group>
                {options.map(option => (
                  <DropdownMenu.Item
                    title={option.label}
                    description={option.description}
                    key={String(option.value)}
                    onSelect={() => handleOptionSelect(option.value)}
                    disabled={loading || option.disabled}
                  />
                ))}
              </DropdownMenu.Group>
            )}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    )
  }
)

SplitButtonInner.displayName = 'SplitButton'

export const SplitButton = SplitButtonInner as <T extends string>(
  props: SplitButtonProps<T> & { ref?: ForwardedRef<HTMLButtonElement> }
) => JSX.Element
