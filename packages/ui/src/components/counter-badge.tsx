import { forwardRef } from 'react'

import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const counterBadgeVariants = cva('cn-badge cn-badge-counter inline-flex w-fit items-center', {
  variants: {
    variant: {
      outline: 'cn-badge-outline',
      secondary: 'cn-badge-secondary'
    },
    theme: {
      default: 'cn-badge-muted',
      info: 'cn-badge-info',
      success: 'cn-badge-success',
      danger: 'cn-badge-danger'
    }
  },
  defaultVariants: {
    variant: 'outline',
    theme: 'default'
  }
})

type CounterBadgeProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'color' | 'role' | 'aria-readonly' | 'tabIndex' | 'onClick'
> & {
  variant?: VariantProps<typeof counterBadgeVariants>['variant']
  theme?: VariantProps<typeof counterBadgeVariants>['theme']
}

const CounterBadge = forwardRef<HTMLDivElement, CounterBadgeProps>(
  ({ className, variant, theme = 'default', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          counterBadgeVariants({
            variant,
            theme
          }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
CounterBadge.displayName = 'CounterBadge'

export { CounterBadge, counterBadgeVariants }
