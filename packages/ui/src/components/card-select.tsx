import { createContext, forwardRef, HTMLAttributes, ReactNode, useContext, useState } from 'react'

import { useTranslation } from '@/context'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

import { IconV2, IconV2NamesType } from './icon-v2'
import { LogoV2, LogoV2NamesType } from './logo-v2'
import { StatusBadge } from './status-badge/status-badge'

type CardSelectType = 'single' | 'multiple'

type CardSelectRootProps<T> = {
  className?: string
  type: CardSelectType
  name?: string
  value?: T extends 'single' ? unknown : unknown[]
  defaultValue?: T extends 'single' ? unknown : unknown[]
  onValueChange?: T extends 'single' ? (val: unknown) => void : (val: unknown[]) => void
  disabled?: boolean
  /**
   * Single-select only. When true, re-clicking the selected item clears it (`onValueChange(null)`).
   * Off by default so `type="single"` stays radio-sticky for existing consumers. No-op for
   * `type="multiple"`, which already toggles.
   */
  deselectable?: boolean
  rows?: number
  cols?: number
  children: ReactNode
} & VariantProps<typeof cardSelectVariants>

interface CardSelectItemProps extends HTMLAttributes<HTMLInputElement> {
  value: unknown
  icon?: IconV2NamesType
  logo?: LogoV2NamesType
  disabled?: boolean
  /** Renders a selected-state glow ring in addition to the standard checked border. */
  glow?: boolean
  /** Forces disabled + renders a "Coming Soon" badge (see status-badge.tsx theme="info"). Overrides `disabled`. */
  comingSoon?: boolean
  children: ReactNode
}

interface CardSelectContext {
  type: CardSelectType
  name: string
  currentValue: unknown | unknown[]
  disabled: boolean
  deselectable: boolean
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
  deselectable = false,
  children,
  rows,
  cols
}: CardSelectRootProps<T>) {
  const [internalValue, setInternalValue] = useState<unknown | unknown[]>(
    defaultValue ?? (type === 'multiple' ? [] : undefined)
  )

  // `value !== undefined` (not `value ??`) so a parent can pass `null` as controlled empty
  // and actually clear a stale check. `null ?? internalValue` would fall through.
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  const handleValueChange = (itemValue: unknown) => {
    if (disabled) return

    const newValue =
      type === 'multiple'
        ? Array.isArray(currentValue)
          ? currentValue.includes(itemValue)
            ? currentValue.filter(v => v !== itemValue)
            : [...currentValue, itemValue]
          : [itemValue]
        : deselectable && isChecked(itemValue, currentValue)
          ? null
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
        deselectable,
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
  (
    {
      className,
      value,
      icon,
      logo,
      disabled: itemDisabled = false,
      glow = false,
      comingSoon = false,
      children,
      ...props
    },
    ref
  ) => {
    const { type, name, currentValue, disabled: groupDisabled, deselectable, onValueChange } = useCardSelect()
    const { t } = useTranslation()
    const isDisabled = itemDisabled || groupDisabled || comingSoon
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
        data-coming-soon={comingSoon ? '' : undefined}
        data-glow={glow && checked ? '' : undefined}
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
        onClick={e => {
          // Native <input type="radio"> onChange does not fire on the already-checked input,
          // so re-click would be a no-op without this. Opt-in via deselectable so default
          // single-select stays radio-sticky. Only intercept the selected item — first-select
          // still goes through onChange, avoiding a double fire.
          if (deselectable && type === 'single' && checked && !isDisabled) {
            e.preventDefault()
            onValueChange(value)
          }
        }}
      >
        <div className="cn-card-select-content">
          <div className="cn-card-select-content-left">
            {icon && <IconV2 size="xl" name={icon} className="cn-card-select-icon" />}
            {logo && !icon && <LogoV2 size="md" name={logo} className="cn-card-select-logo" />}
            <div className="cn-card-select-content-container">{children}</div>
          </div>
          {comingSoon && (
            <StatusBadge variant="secondary" theme="info" size="sm" className="cn-card-select-coming-soon-badge">
              {t('component:cardSelect.comingSoon', 'Coming Soon')}
            </StatusBadge>
          )}
          {checked && !comingSoon && <IconV2 size="md" name="check" className="cn-card-select-check" />}
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
