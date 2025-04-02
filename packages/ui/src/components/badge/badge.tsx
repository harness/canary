import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

// Extend HTMLAttributes to include inert attribute
// move it to right place where we have global types
// declare module 'react' {
//   interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
//     // Add inert attribute support
//     inert?: boolean
//   }
// }

const badgeVariants = cva('badge inline-flex items-center transition-colors', {
  variants: {
    variant: {
      solid: 'badge-solid',
      soft: 'badge-soft',
      surface: 'badge-surface',
      status: 'badge-status',
      counter: 'badge-counter'
      // default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
      // secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
      // tertiary: 'border-transparent bg-cn-background-8 text-cn-foreground-8',
      // quaternary: 'border-cn-borders-2 bg-cn-background-2 text-cn-foreground-5',
      // destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
      // outline: 'text-cn-foreground',
    },
    /**
     * CDS: How to take it forward?
     *
     * In new CDS we have -default and -sm sizes alone.
     */
    size: {
      default: '',
      sm: 'badge-sm'

      // xl: 'h-[18px] px-2 text-12',
      // lg: 'px-3 py-1 text-xs font-normal',
      // md: 'h-6 px-2.5',
      // xs: 'h-[18px] px-1.5 text-11 font-light'
    },
    /**
     * CDS: How to take it forward?
     *
     * Delete -base and have -base and -full?
     */
    // borderRadius: {
    //   default: 'badge-rounded-default',
    //   base: 'badge-rounded-default',
    //   full: 'badge-rounded-full'
    // },
    /**
     * CDS: How to take it forward?
     * Delete -theme?
     */
    theme: {
      // destructive:
      //   'border-tag-border-red-1 bg-tag-background-red-1 text-tag-foreground-red-1 hover:bg-tag-background-red-2',
      // warning:
      //   'border-tag-border-amber-1 bg-tag-background-amber-1 text-tag-foreground-amber-1 hover:bg-tag-background-amber-2',
      // success:
      //   'border-tag-border-mint-1 bg-tag-background-mint-1 text-tag-foreground-mint-1 hover:bg-tag-background-mint-2',
      // emphasis:
      //   'border-tag-border-purple-1 bg-tag-background-purple-1 text-tag-foreground-purple-1 hover:bg-tag-background-purple-2',
      // muted:
      //   'border-tag-border-gray-1 bg-tag-background-gray-1 text-tag-foreground-gray-1 hover:bg-tag-background-gray-2'
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
  // compoundVariants: [
  //   {
  //     variant: 'status',
  //     className: 'bg-red-500'
  //   }
  // ],
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
      // role="status"
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

const a = <Badge variant="counter">test</Badge>

const b = (
  <Badge className="leading-none" variant="status" theme="warning" pulse>
    Running
  </Badge>
)
