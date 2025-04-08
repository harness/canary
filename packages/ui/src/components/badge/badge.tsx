import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const badgeVariants = cva('badge inline-flex w-fit items-center transition-colors', {
  variants: {
    variant: {
      solid: 'badge-solid',
      soft: 'badge-soft',
      surface: 'badge-surface',
      status: 'badge-status',
      counter: 'badge-counter'
    },
    size: {
      default: '',
      sm: 'badge-sm'
    },

    theme: {
      muted: 'badge-muted',
      success: 'badge-success',
      warning: 'badge-warning',
      danger: 'badge-danger',
      info: 'badge-info',
      merged: 'badge-merged',
      ai: 'badge-ai',
      primary: 'badge-primary'
    }
  },

  defaultVariants: {
    variant: 'surface',
    size: 'default',
    theme: 'muted'
  }
})

// Base props without theme-specific requirements
type BadgeBaseProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'color' | 'role' | 'aria-readonly' | 'tabIndex' | 'onClick'
> & {
  size?: 'default' | 'sm'
}

// AI theme props (variant not allowed)
type BadgeAIThemeProps = BadgeBaseProps & {
  theme: 'ai'
  variant?: never
  pulse?: never
}

// Status theme props (variant is required)
type BadgeStatusVariantProps = BadgeBaseProps & {
  theme?: Exclude<VariantProps<typeof badgeVariants>['theme'], 'ai'>
  variant: 'status'
  pulse?: boolean
}

// Counter theme props (variant is required)
type BadgeCounterVariantProps = BadgeBaseProps & {
  theme?: Extract<VariantProps<typeof badgeVariants>['theme'], 'primary'>
  variant: 'counter'
  pulse?: never
}

// Other theme props (variant is required)
type BadgeOtherThemeProps = BadgeBaseProps & {
  theme?: Exclude<VariantProps<typeof badgeVariants>['theme'], 'ai'>
  variant: NonNullable<Exclude<VariantProps<typeof badgeVariants>['variant'], 'status' | 'counter'>> // Make variant required
  pulse?: never
}

// Combined props using discriminated union
export type BadgeProps = BadgeAIThemeProps | BadgeOtherThemeProps | BadgeStatusVariantProps | BadgeCounterVariantProps

function Badge({ className, variant, size, pulse, theme = 'muted', children, ...props }: BadgeProps) {
  // If theme is 'ai', we don't use variant
  const effectiveVariant = theme === 'ai' ? undefined : variant

  const isStatusVariant = variant === 'status'

  return (
    <div
      aria-readonly="true"
      tabIndex={-1}
      className={cn(
        badgeVariants({
          variant: effectiveVariant,
          size,
          theme
        }),
        className
      )}
      {...props}
    >
      {isStatusVariant && (
        <span className={cn('badge-indicator rounded-full', { 'animate-pulse': pulse })} aria-hidden="true" />
      )}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
