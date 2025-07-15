import { forwardRef } from 'react'

import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const counterBadgeVariants = cva('cn-badge cn-badge-counter cn-badge-surface inline-flex w-fit items-center', {
  variants: {
    theme: {
      default: 'cn-badge-muted',
      info: 'cn-badge-info',
      success: 'cn-badge-success',
      danger: 'cn-badge-danger'
    }
  },
  defaultVariants: {
    theme: 'default'
  }
})

type CounterBadgeProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'color' | 'role' | 'aria-readonly' | 'tabIndex' | 'onClick'
> & {
  theme?: VariantProps<typeof counterBadgeVariants>['theme']
}

const CounterBadge = forwardRef<HTMLDivElement, CounterBadgeProps>(
  ({ className, theme = 'default', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          counterBadgeVariants({
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
