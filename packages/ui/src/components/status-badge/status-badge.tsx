import { forwardRef } from 'react'

import { IconNameMapV2, IconV2 } from '@components/icon-v2'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const statusBadgeVariants = cva('cn-badge inline-flex w-fit items-center transition-colors', {
  variants: {
    variant: {
      primary: 'cn-badge-primary',
      secondary: 'cn-badge-secondary',
      outline: 'cn-badge-outline',
      ghost: 'cn-badge-ghost',
      status: 'cn-badge-status'
    },
    size: {
      md: '',
      sm: 'cn-badge-sm'
    },

    theme: {
      muted: 'cn-badge-muted',
      success: 'cn-badge-success',
      warning: 'cn-badge-warning',
      danger: 'cn-badge-danger',
      info: 'cn-badge-info',
      merged: 'cn-badge-merged',
      risk: 'cn-badge-risk'
    }
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    theme: 'muted'
  }
})

const statusIndicatorVariants = cva('cn-badge-indicator', {
  variants: {
    shape: {
      circle: 'rounded-cn-full',
      square: 'rounded-cn-px'
    }
  },
  defaultVariants: {
    shape: 'circle'
  }
})

export type StatusBadgeTheme = VariantProps<typeof statusBadgeVariants>['theme']

// Base props without theme-specific requirements
type BadgeBaseProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'color' | 'role' | 'aria-readonly' | 'tabIndex' | 'onClick'
> & {
  size?: 'sm' | 'md'
  icon?: keyof typeof IconNameMapV2
}

// Status theme props (variant is required)
type StatusBadgeStatusVariantProps = BadgeBaseProps & {
  theme?: StatusBadgeTheme
  variant: 'status'
  pulse?: boolean
  icon?: never
  indicatorShape?: VariantProps<typeof statusIndicatorVariants>['shape']
}

// Other theme props (variant is required)
type StatusBadgeOtherThemeProps = BadgeBaseProps & {
  theme?: StatusBadgeTheme
  variant: NonNullable<Exclude<VariantProps<typeof statusBadgeVariants>['variant'], 'status' | 'counter'>> // Make variant required
  pulse?: never
  indicatorShape?: never
}

// Combined props using discriminated union
export type StatusBadgeProps = StatusBadgeOtherThemeProps | StatusBadgeStatusVariantProps

const StatusBadge = forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ className, variant, size, pulse, theme = 'muted', children, icon, indicatorShape, ...props }, ref) => {
    const isStatusVariant = variant === 'status'

    return (
      <div
        ref={ref}
        className={cn(
          statusBadgeVariants({
            variant,
            size,
            theme
          }),
          className
        )}
        {...props}
      >
        {isStatusVariant && (
          <span
            className={cn(statusIndicatorVariants({ shape: indicatorShape }), {
              'animate-pulse': pulse
            })}
            aria-hidden="true"
          />
        )}
        {icon && <IconV2 name={icon} />}
        {children}
      </div>
    )
  }
)

StatusBadge.displayName = 'StatusBadge'

export { StatusBadge, statusBadgeVariants }
