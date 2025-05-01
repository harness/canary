import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const counterBadgeVariants = cva('cn-badge cn-badge-surface cn-badge-counter inline-flex w-fit items-center', {
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

function CounterBadge({ className, theme = 'default', children, ...props }: CounterBadgeProps) {
  return (
    <div
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
