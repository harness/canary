import { MouseEvent, ReactNode } from 'react'

import { Button, buttonVariants } from '@/components/button'
import { DropdownMenu } from '@components/dropdown-menu'
import { Icon } from '@components/icon'
import { Option } from '@components/option'
import { RadioButton, RadioGroup } from '@components/radio'
import { cn } from '@utils/cn'

export interface ButtonWithOptionsOptionType<T extends string> {
  value: T
  label: string
  description?: string
}

// Base props shared by all variants
interface ButtonWithOptionsBaseProps<T extends string> {
  id: string
  handleButtonClick: (e: MouseEvent) => void
  loading?: boolean
  selectedValue?: T
  options: ButtonWithOptionsOptionType<T>[]
  handleOptionChange: (val: T) => void
  className?: string
  buttonClassName?: string
  disabled?: boolean
  children: ReactNode
  dropdownContentClassName?: string
}

// For solid variant with primary theme
interface ButtonWithOptionsSolidProps<T extends string> extends ButtonWithOptionsBaseProps<T> {
  variant?: 'solid'
  theme?: 'primary'
}

// For surface variant with success or danger theme
interface ButtonWithOptionsSurfaceProps<T extends string> extends ButtonWithOptionsBaseProps<T> {
  variant?: 'surface'
  theme?: 'success' | 'danger' | 'muted'
}

// Combined discriminated union
export type ButtonWithOptionsProps<T extends string> = ButtonWithOptionsSolidProps<T> | ButtonWithOptionsSurfaceProps<T>

/**
 * Button with options
 * - If selectedValue exists, it will behave as a radio button
 * - Otherwise, it will function as a regular dropdown item
 *
 * Supported combinations:
 * - variant=solid with theme=primary (default)
 * - variant=surface with theme=success|danger|muted
 */
export const ButtonWithOptions = <T extends string>({
  id,
  handleButtonClick,
  loading = false,
  selectedValue,
  options,
  handleOptionChange,
  className,
  buttonClassName,
  theme = 'primary',
  variant = 'solid',
  disabled = false,
  children,
  dropdownContentClassName
}: ButtonWithOptionsProps<T>) => {
  return (
    <div className={cn('flex', className)}>
      <Button
        className={cn('rounded-r-none border-r-0', buttonClassName)}
        theme={theme}
        variant={variant}
        onClick={handleButtonClick}
        type="button"
        disabled={disabled}
        loading={loading}
      >
        {children}
      </Button>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          className={cn(buttonVariants({ theme, variant }), 'button-split-dropdown')}
          disabled={disabled || loading}
        >
          <Icon name="chevron-down" size={12} className="chevron-down" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className={cn('mt-1 max-w-80', dropdownContentClassName)} align="end">
          {selectedValue ? (
            <RadioGroup value={String(selectedValue)} id={id}>
              <DropdownMenu.Group>
                {options.map(option => (
                  <DropdownMenu.Item
                    key={String(option.value)}
                    onClick={() => handleOptionChange(option.value)}
                    disabled={loading}
                  >
                    <Option
                      control={<RadioButton className="mt-px" value={String(option.value)} id={String(option.value)} />}
                      id={String(option.value)}
                      label={option.label}
                      ariaSelected={selectedValue === option.value}
                      description={option?.description}
                    />
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Group>
            </RadioGroup>
          ) : (
            <DropdownMenu.Group>
              {options.map(option => (
                <DropdownMenu.Item
                  key={String(option.value)}
                  className="px-3 py-2.5"
                  onClick={() => handleOptionChange(option.value)}
                >
                  <span className="flex flex-col gap-y-1.5">
                    <span className="text-cn-foreground-1 leading-none">{option.label}</span>
                    {option?.description && <span className="text-cn-foreground-2">{option.description}</span>}
                  </span>
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Group>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  )
}
