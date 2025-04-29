import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const counterBadgeVariants = cva('badge badge-counter inline-flex w-fit items-center', {
  variants: {
    theme: {
      default: 'badge-muted',
      info: 'badge-info'
    }
  },
  defaultVariants: {
    theme: 'default'
  }
})

// Base props without theme-specific requirements
type CounterBadgeProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'color' | 'role' | 'aria-readonly' | 'tabIndex' | 'onClick'
> & {
  theme?: VariantProps<typeof counterBadgeVariants>['theme']
}

function CounterBadge({ className, theme = 'default', children, ...props }: CounterBadgeProps) {
  return (
    <div
      aria-readonly="true"
      tabIndex={-1}
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
CounterBadge.displayName = 'CounterBadge'

export { CounterBadge, counterBadgeVariants }
