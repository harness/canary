import * as React from 'react'

import { cn } from '@utils/cn'
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
  'inline-flex items-center border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        tertiary: 'border-transparent bg-background-8 text-foreground-8',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground'
      },
      size: {
        default: 'px-2.5 py-0.5 text-xs font-semibold',
        xl: 'h-[18px] px-2 text-12',
        lg: 'px-3 py-1 text-xs font-normal',
        md: 'h-6 px-2.5',
        sm: 'h-5 px-1 text-12',
        xs: 'px-1.5 py-0 text-11 font-light'
      },
      borderRadius: {
        default: 'rounded-md',
        base: 'rounded',
        full: 'rounded-full'
      },
      hover: {
        [BadgesHoverStates.ENABLED]: '',
        // variant
        [BadgesHoverStates.DISABLED_DEFAULT]: 'hover:!bg-primary',
        [BadgesHoverStates.DISABLED_SECONDARY]: 'hover:!bg-secondary',
        [BadgesHoverStates.DISABLED_DESTRUCTIVE]: 'hover:!bg-destructive',
        [BadgesHoverStates.DISABLED_OUTLINE]: '',
        // theme
        [BadgesHoverStates.DISABLED_DESTRUCTIVE_THEME]: 'hover:!bg-tag-background-red-1',
        [BadgesHoverStates.DISABLED_WARNING_THEME]: 'hover:!bg-tag-background-amber-1',
        [BadgesHoverStates.DISABLED_SUCCESS_THEME]: 'hover:!bg-tag-background-mint-1',
        [BadgesHoverStates.DISABLED_EMPHASIS_THEME]: 'hover:!bg-tag-background-purple-1',
        [BadgesHoverStates.DISABLED_MUTED_THEME]: 'hover:!bg-tag-background-gray-1'
      },
      theme: {
        default: '',
        destructive:
          'border-tag-border-red-1 bg-tag-background-red-1 text-tag-foreground-red-1 hover:bg-tag-background-red-2',
        warning:
          'border-tag-border-amber-1 bg-tag-background-amber-1 text-tag-foreground-amber-1 hover:bg-tag-background-amber-2',
        success:
          'border-tag-border-mint-1 bg-tag-background-mint-1 text-tag-foreground-mint-1 hover:bg-tag-background-mint-2',
        emphasis:
          'border-tag-border-purple-1 bg-tag-background-purple-1 text-tag-foreground-purple-1 hover:bg-tag-background-purple-2',
        muted:
          'border-tag-border-gray-1 bg-tag-background-gray-1 text-tag-foreground-gray-1 hover:bg-tag-background-gray-2'
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
