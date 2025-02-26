import { MouseEvent, ReactNode } from 'react'

import { Button, buttonVariants } from '@/components/button'
import { DropdownMenu } from '@components/dropdown-menu'
import { Icon } from '@components/icon'
import { Option } from '@components/option'
import { RadioButton, RadioGroup } from '@components/radio'
import { cn } from '@utils/cn'
import { type VariantProps } from 'class-variance-authority'

type ButtonWithOptionsSizes = Extract<VariantProps<typeof buttonVariants>['size'], 'default' | 'md'>
export type ButtonWithOptionsTheme = Exclude<
  NonNullable<VariantProps<typeof buttonVariants>['theme']>,
  null | undefined
>
export type ButtonWithOptionsVariant = Exclude<
  NonNullable<VariantProps<typeof buttonVariants>['variant']>,
  null | undefined
>

const buttonPaddings: Record<ButtonWithOptionsSizes, string> = {
  default: 'pl-4 pr-2.5',
  md: 'pl-5 pr-2.5'
}

const separatorThemes: Record<ButtonWithOptionsTheme, string> = {
  default: 'before:bg-inherit',
  primary: 'before:bg-button-border-accent-1',
  error: 'before:bg-button-border-danger-1',
  success: 'before:bg-button-border-success-1',
  disabled: 'before:bg-button-border-disabled-1',
  // TODO: Add warning and muted themes
  warning: '',
  muted: ''
}

export interface ButtonWithOptionsOptionType<T extends string> {
  value: T
  label: string
  description?: string
}

export interface ButtonWithOptionsProps<T extends string> {
  id: string
  handleButtonClick: (e: MouseEvent) => void
  loading?: boolean
  selectedValue?: T
  options: ButtonWithOptionsOptionType<T>[]
  handleOptionChange: (val: T) => void
  className?: string
  buttonClassName?: string
  size?: ButtonWithOptionsSizes
  theme?: ButtonWithOptionsTheme
  variant?: ButtonWithOptionsVariant
  disabled?: boolean
  children: ReactNode
  dropdownContentClassName?: string
}

/**
 * Button with options
 * - If selectedValue exists, it will behave as a radio button
 * - Otherwise, it will function as a regular dropdown item
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
  size = 'default',
  theme = 'primary',
  variant = 'default',
  disabled = false,
  children,
  dropdownContentClassName
}: ButtonWithOptionsProps<T>) => {
  return (
    <div className={cn('flex', className)}>
      <Button
        className={cn(
          'rounded-r-none',
          theme !== 'primary' && 'border-y border-l',
          buttonPaddings[size],
          buttonClassName
        )}
        theme={theme}
        variant={variant}
        size={size}
        onClick={handleButtonClick}
        type="button"
        disabled={disabled}
        loading={loading}
      >
        {children}
      </Button>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          className={cn(
            buttonVariants({ theme, variant }),
            'relative h-[inherit] w-8 p-0 flex-shrink-0 rounded-l-none before:absolute before:left-0 before:h-[calc(100%-8px)] before:w-px',
            theme !== 'primary' && 'border-y border-r',
            separatorThemes[theme || 'default']
          )}
          disabled={disabled || loading}
        >
          <Icon name="chevron-down" size={12} className="chevron-down" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          className={cn('mt-1 max-w-80', dropdownContentClassName)}
          align="end"
          onCloseAutoFocus={event => event.preventDefault()} // Prevent focus on hidden content
        >
          {selectedValue ? (
            <RadioGroup value={String(selectedValue)} id={id}>
              <DropdownMenu.Group>
                {options.map(option => (
                  <DropdownMenu.Item
                    key={String(option.value)}
                    onClick={() => handleOptionChange(option.value)}
                    disabled={!!loading}
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
                    <span className="leading-none text-foreground-8">{option.label}</span>
                    {option?.description && <span className="text-foreground-4">{option.description}</span>}
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
