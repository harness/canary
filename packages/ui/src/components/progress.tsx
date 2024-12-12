import * as React from 'react'

import { cn } from '@/utils/cn'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cva, type VariantProps } from 'class-variance-authority'

const progressVariants = cva('', {
  variants: {
    variant: {
      default: 'relative w-full overflow-hidden bg-primary/20',
      divergence: 'relative w-full overflow-hidden bg-transparent'
    },
    size: {
      default: 'h-2',
      sm: 'h-[3px]'
    },
    rounded: {
      default: 'rounded-full',
      sm: 'rounded-[1px]',
      md: 'rounded-[2px]'
    },
    rotated: {
      default: '',
      '180deg': 'rotate-180'
    }
  },
  compoundVariants: [
    {
      variant: 'divergence',
      rounded: 'default',
      size: 'default',
      className: 'h-[3px] rounded-none'
    }
  ],
  defaultVariants: {
    variant: 'default',
    size: 'default',
    rounded: 'default',
    rotated: 'default'
  }
})

const indicatorVariants = cva('', {
  variants: {
    color: {
      default: 'bg-primary',
      accent: 'bg-primary-accent'
    },
    indicatorRounded: {
      default: '',
      'left-sm': 'rounded-l-[1px]',
      'right-sm': 'rounded-r-[1px]',
      'right-md': 'rounded-r-[2px]'
    },
    indicatorColor: {
      default: '',
      'tertiary-background-20': 'bg-tertiary-background/20',
      'tertiary-background-40': 'bg-tertiary-background/40'
    }
  },
  defaultVariants: {
    color: 'default',
    indicatorRounded: 'default'
  }
})

type ProgressVariants = VariantProps<typeof progressVariants>
type IndicatorVariants = VariantProps<typeof indicatorVariants>

type ProgressProps = React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> &
  ProgressVariants &
  IndicatorVariants & {
    value?: number
  }

const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(
  ({ className, value, variant, size, rounded, color, indicatorRounded, indicatorColor, rotated, ...props }, ref) => (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(progressVariants({ variant, size, rounded, rotated }), className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          'h-full w-full flex-1 transition-all',
          indicatorVariants({ color, indicatorRounded, indicatorColor })
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
)

// const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(
//   ({ className, value, variant, size, rounded, color, indicatorRounded, indicatorColor, rotated, ...props }, ref) => {
//     // Calculate the percentage and ensure it's at least 10
//     console.log(value)
//     const adjustedValue = value || 0
//     const percentage = 100 - adjustedValue
//     const adjustedPercentage = percentage < 10 ? 10 : percentage

//     return (
//       <ProgressPrimitive.Root
//         ref={ref}
//         className={cn(progressVariants({ variant, size, rounded, rotated }), className)}
//         {...props}
//       >
//         <ProgressPrimitive.Indicator
//           className={cn(
//             'h-full w-full flex-1 transition-all',
//             indicatorVariants({ color, indicatorRounded, indicatorColor })
//           )}
//           style={{ transform: `translateX(-${adjustedPercentage}%)` }}
//         />
//       </ProgressPrimitive.Root>
//     )
//   }
// )

Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
