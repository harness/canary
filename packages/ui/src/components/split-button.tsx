import { ForwardedRef, forwardRef, MouseEvent, ReactNode } from 'react'

import { Button, buttonVariants } from '@/components/button'
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
export interface SplitButtonSolidProps<T extends string> extends SplitButtonBaseProps<T> {
  variant?: 'primary' | 'outline'
  theme?: 'default' | 'success' | 'danger'
}

// For surface variant with success or danger theme
interface SplitButtonSurfaceProps<T extends string> extends SplitButtonBaseProps<T> {
  variant?: 'outline'
  theme?: 'success' | 'danger' | 'default'
}

// Combined discriminated union
export type SplitButtonProps<T extends string> = SplitButtonSolidProps<T> | SplitButtonSurfaceProps<T>

/**
 * Button with options
 * - If selectedValue exists, it will behave as a radio button
 * - Otherwise, it will function as a regular dropdown item
 *
 * Supported combinations:
 * - variant=solid with theme=primary (default)
 * - variant=surface with theme=success|danger|muted
 */
const SplitButtonBase = <T extends string>(
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
  ref: ForwardedRef<HTMLDivElement>
) => {
  return (
    <div className={cn('flex', className)} ref={ref}>
      <Button
        className={cn('rounded-r-none border-r-0', buttonClassName)}
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
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          className={cn(buttonVariants({ theme, variant, size }), 'cn-button-split-dropdown')}
          disabled={disabled || loading || disableDropdown}
        >
          <IconV2 name="nav-arrow-down" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className={cn('mt-1 max-w-80', dropdownContentClassName)} align="end">
          {selectedValue ? (
            <DropdownMenu.RadioGroup value={String(selectedValue)}>
              {options.map(option => (
                <DropdownMenu.RadioItem
                  title={option.label}
                  description={option?.description}
                  value={String(option.value)}
                  key={String(option.value)}
                  onClick={() => {
                    if (!loading && !option.disabled) {
                      handleOptionChange(option.value)
                    }
                  }}
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
                  onClick={() => {
                    if (!loading && !option.disabled) {
                      handleOptionChange(option.value)
                    }
                  }}
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

export const SplitButton = forwardRef(SplitButtonBase) as <T extends string>(
  props: SplitButtonProps<T> & { ref?: ForwardedRef<HTMLButtonElement> }
) => ReturnType<typeof SplitButtonBase>
