import { MouseEvent, ReactNode } from 'react'

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
}

// For solid variant with primary theme
interface SplitButtonSolidProps<T extends string> extends SplitButtonBaseProps<T> {
  variant?: 'primary'
  theme?: 'default'
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
export const SplitButton = <T extends string>({
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
  dropdownContentClassName
}: SplitButtonProps<T>) => {
  return (
    <div className={cn('flex', className)}>
      <Button
        className={cn('rounded-r-none border-r-0', buttonClassName)}
        theme={theme}
        variant={variant}
        onClick={handleButtonClick}
        type="button"
        disabled={disabled || disableButton}
        loading={loading}
      >
        {children}
      </Button>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          className={cn(buttonVariants({ theme, variant }), 'cn-button-split-dropdown')}
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
                  onClick={() => handleOptionChange(option.value)}
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
                  onClick={() => handleOptionChange(option.value)}
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

SplitButton.displayName = 'SplitButton'
