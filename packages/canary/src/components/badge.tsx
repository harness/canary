import * as React from 'react'

import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

enum BadgesHoverStates {
  ENABLED = 'enabled',
  DISABLED_DEFAULT = 'disabled-default',
  DISABLED_SECONDARY = 'disabled-secondary',
  DISABLED_DESTRUCTIVE = 'disabled-destructive',
  DISABLED_OUTLINE = 'disabled-outline',
  DISABLED_DESTRUCTIVE_THEME = 'disabled-destructive-theme',
  DISABLED_WARNING_THEME = 'disabled-warning-theme',
  DISABLED_SUCCESS_THEME = 'disabled-success-theme',
  DISABLED_EMPHASIS_THEME = 'disabled-emphasis-theme',
  DISABLED_MUTED_THEME = 'disabled-muted-theme'
}

const badgeVariants = cva(
  'focus:ring-ring inline-flex items-center rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/80 border-transparent shadow',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/80 border-transparent shadow',
        outline: 'text-foreground'
      },
      size: {
        default: 'px-2.5 py-0.5 text-xs font-semibold',
        lg: 'px-3 py-1 text-xs font-normal',
        sm: 'text-12 h-5 px-1 leading-none',
        xs: 'text-11 px-1.5 py-0 font-light',
        // TODO: Consider switching size variants to numeric values
        // Numeric size variants (like '18') provide clearer context about actual dimensions
        // compared to abstract sizes (xs, sm, lg).
        '18': 'text-12 h-[18px] px-2'
      },
      borderRadius: {
        default: '',
        full: 'rounded-full'
      },
      hover: {
        [BadgesHoverStates.ENABLED]: '',
        // variant
        [BadgesHoverStates.DISABLED_DEFAULT]: 'hover:!bg-primary hover:shadow-none',
        [BadgesHoverStates.DISABLED_SECONDARY]: 'hover:!bg-secondary hover:shadow-none',
        [BadgesHoverStates.DISABLED_DESTRUCTIVE]: 'hover:!bg-destructive hover:shadow-none',
        [BadgesHoverStates.DISABLED_OUTLINE]: '',
        // theme
        [BadgesHoverStates.DISABLED_DESTRUCTIVE_THEME]: 'hover:!bg-[var(--tag-background-red-01)] hover:shadow-none',
        [BadgesHoverStates.DISABLED_WARNING_THEME]: 'hover:!bg-[var(--tag-background-amber-01)] hover:shadow-none',
        [BadgesHoverStates.DISABLED_SUCCESS_THEME]: 'hover:!bg-[var(--tag-background-mint-01)] hover:shadow-none',
        [BadgesHoverStates.DISABLED_EMPHASIS_THEME]: 'hover:!bg-[var(--tag-background-purple-01)] hover:shadow-none',
        [BadgesHoverStates.DISABLED_MUTED_THEME]: 'hover:!bg-[var(--tag-background-gray-01)] hover:shadow-none'
      },
      theme: {
        default: '',
        destructive:
          'border-[var(--tag-border-red-01)] bg-[var(--tag-background-red-01)] text-[var(--tag-foreground-red-01)] hover:bg-[var(--tag-background-red-02)]',
        warning:
          'border-[var(--tag-border-amber-01)] bg-[var(--tag-background-amber-01)] text-[var(--tag-foreground-amber-01)] hover:bg-[var(--tag-background-amber-02)]',
        success:
          'border-[var(--tag-border-mint-01)] bg-[var(--tag-background-mint-01)] text-[var(--tag-foreground-mint-01)] hover:bg-[var(--tag-background-mint-02)]',
        emphasis:
          'border-[var(--tag-border-purple-01)] bg-[var(--tag-background-purple-01)] text-[var(--tag-foreground-purple-01)] hover:bg-[var(--tag-background-purple-02)]',
        muted:
          'border-[var(--tag-border-gray-01)] bg-[var(--tag-background-gray-01)] text-[var(--tag-foreground-gray-01)] hover:bg-[var(--tag-background-gray-02)]'
      }
    },
    compoundVariants: [
      {
        size: 'sm',
        borderRadius: 'full',
        className: 'px-2'
      }
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
      hover: BadgesHoverStates.ENABLED,
      theme: 'default'
    }
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  disableHover?: boolean
  color?: 'destructive' | 'success' | 'warning' | 'muted' | 'default'
}

function Badge({
  className,
  variant = 'default',
  size,
  borderRadius = 'default',
  theme = 'default',
  disableHover,
  ...props
}: BadgeProps) {
  const hover = (
    disableHover ? (theme !== 'default' ? `disabled-${theme}-theme` : `disabled-${variant}`) : BadgesHoverStates.ENABLED
  ) as BadgesHoverStates

  return (
    <div
      className={cn(
        badgeVariants({
          variant,
          size,
          borderRadius,
          theme,
          hover
        }),
        className
      )}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
