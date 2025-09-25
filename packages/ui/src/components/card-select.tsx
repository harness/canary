import { createContext, forwardRef, HTMLAttributes, ReactNode, useContext, useState } from 'react'

import { cn } from '@utils/cn'
import { cva } from 'class-variance-authority'

import { IconV2, IconV2NamesType } from './icon-v2'
import { LogoV2, LogoV2NamesType } from './logo-v2'

type CardSelectType = 'single' | 'multiple'

interface CardSelectRootProps<T> {
  className?: string
  type: CardSelectType
  name?: string
  value?: T extends 'single' ? unknown : unknown[]
  defaultValue?: T extends 'single' ? unknown : unknown[]
  onValueChange?: T extends 'single' ? (val: unknown) => void : (val: unknown[]) => void
  disabled?: boolean
  layout?: 'horizontal' | 'vertical' | 'grid'
  gap?: 'sm' | 'md' | 'lg'
  rows?: number
  cols?: number
  children: ReactNode
}

interface CardSelectItemProps extends HTMLAttributes<HTMLInputElement> {
  value: unknown
  icon?: IconV2NamesType
  logo?: LogoV2NamesType
  disabled?: boolean
  children: ReactNode
}

interface CardSelectContext {
  type: CardSelectType
  name: string
  currentValue: unknown | unknown[]
  disabled: boolean
  onValueChange: (value: unknown) => void
}

const CardSelectContext = createContext<CardSelectContext | null>(null)

function useCardSelect() {
  const context = useContext(CardSelectContext)
  if (!context) {
    throw new Error('CardSelect.Item must be used within CardSelect.Root')
  }
  return context
}

function isChecked(value: unknown, current: unknown | unknown[]) {
  return Array.isArray(current) ? current.includes(value) : current === value
}

const cardSelectVariants = cva('cn-card-select-root', {
  variants: {
    layout: {
      vertical: 'cn-card-select-vertical',
      horizontal: 'cn-card-select-horizontal',
      grid: 'cn-card-select-grid'
    },
    gap: {
      xs: 'gap-cn-xs',
      sm: 'gap-cn-sm',
      md: 'gap-cn-md',
      lg: 'gap-cn-lg'
    }
  },
  defaultVariants: {
    layout: 'vertical',
    gap: 'md'
  }
})

function CardSelectRoot<T extends CardSelectType>({
  className,
  type,
  layout = 'vertical',
  gap = 'md',
  name = `card-select-${Math.random().toString(36).slice(2)}`,
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  children,
  rows,
  cols
}: CardSelectRootProps<T>) {
  const [internalValue, setInternalValue] = useState<unknown | unknown[]>(
    defaultValue ?? (type === 'multiple' ? [] : undefined)
  )

  const currentValue = value ?? internalValue
  const isControlled = value !== undefined

  const handleValueChange = (itemValue: unknown) => {
    if (disabled) return

    const newValue =
      type === 'multiple'
        ? Array.isArray(currentValue)
          ? currentValue.includes(itemValue)
            ? currentValue.filter(v => v !== itemValue)
            : [...currentValue, itemValue]
          : [itemValue]
        : itemValue

    if (!isControlled) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue as any)
  }

  return (
    <CardSelectContext.Provider
      value={{
        type,
        name,
        currentValue,
        disabled,
        onValueChange: handleValueChange
      }}
    >
      <div
        className={cardSelectVariants({ layout, gap, className })}
        role={type === 'single' ? 'radiogroup' : 'group'}
        style={
          {
            '--cols': cols,
            '--rows': rows
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </CardSelectContext.Provider>
  )
}

const CardSelectItem = forwardRef<HTMLLabelElement, CardSelectItemProps>(
  ({ className, value, icon, logo, disabled: itemDisabled = false, children, ...props }, ref) => {
    const { type, name, currentValue, disabled: groupDisabled, onValueChange } = useCardSelect()
    const isDisabled = itemDisabled || groupDisabled
    const checked = isChecked(value, currentValue)

    return (
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
      <label
        ref={ref}
        className={cn(
          'cn-card-select-item',
          checked && 'data-[state=checked]',
          isDisabled && 'data-[disabled]',
          className
        )}
        data-state={checked ? 'checked' : undefined}
        data-disabled={isDisabled ? '' : undefined}
        aria-checked={checked}
        aria-disabled={isDisabled}
        tabIndex={isDisabled ? -1 : 0}
        role={type === 'multiple' ? 'checkbox' : 'radio'}
        onKeyDown={e => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault()
            if (!isDisabled) {
              onValueChange(value)
            }
          }
        }}
      >
        <div className="cn-card-select-content">
          <div className="cn-card-select-content-left">
            {icon && <IconV2 size="xl" name={icon} className="cn-card-select-icon" />}
            {logo && !icon && <LogoV2 size="md" name={logo} className="cn-card-select-logo" />}
            <div className="cn-card-select-content-container">{children}</div>
          </div>
          {checked && <IconV2 size="md" name="check" className="cn-card-select-check" />}
        </div>
        <input
          type={type === 'multiple' ? 'checkbox' : 'radio'}
          name={name}
          className="cn-card-select-hidden-input"
          aria-hidden="true"
          tabIndex={-1}
          value={String(value)}
          checked={checked}
          disabled={isDisabled}
          onChange={() => onValueChange(value)}
          {...props}
        />
      </label>
    )
  }
)
CardSelectItem.displayName = 'CardSelectItem'

const CardSelectTitle = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('cn-card-select-title', className)} {...props} />
))
CardSelectTitle.displayName = 'CardSelectTitle'

const CardSelectDescription = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('cn-card-select-description', className)} {...props} />
)
CardSelectDescription.displayName = 'CardSelectDescription'

const CardSelect = {
  Root: CardSelectRoot,
  Item: CardSelectItem,
  Title: CardSelectTitle,
  Description: CardSelectDescription
} as const

export { CardSelect }
export type { CardSelectRootProps, CardSelectItemProps }
