import { ComponentProps } from 'react'

import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const spacerVariants = cva('mt-[var(--cn-spacing-4)]', {
  variants: {
    size: {
      1: 'mt-[var(--cn-spacing-1)]' /* 1rem */,
      1.5: 'mt-[var(--cn-spacing-1-half)]',
      2: 'mt-[var(--cn-spacing-2)]',
      2.5: 'mt-[var(--cn-spacing-2-half)]',
      3: 'mt-[var(--cn-spacing-3)]',
      4: 'mt-[var(--cn-spacing-4)]',
      4.5: 'mt-[var(--cn-spacing-4-half)]',
      5: 'mt-[var(--cn-spacing-5)]',
      6: 'mt-[var(--cn-spacing-6)]',
      7: 'mt-[var(--cn-spacing-7)]',
      8: 'mt-[var(--cn-spacing-8)]',
      9: 'mt-[var(--cn-spacing-9)]',
      10: 'mt-[var(--cn-spacing-10)]',
      11: 'mt-[var(--cn-spacing-11)]',
      12: 'mt-[var(--cn-spacing-12)]',
      14: 'mt-[var(--cn-spacing-14)]',
      15: 'mt-[var(--cn-spacing-15)]',
      16: 'mt-[var(--cn-spacing-16)]',
      20: 'mt-[var(--cn-spacing-20)]'
    }
  }
})

export interface SpacerProps extends ComponentProps<'div'>, VariantProps<typeof spacerVariants> {}

// TODO: Revisit the Spacer component
// 1. Currently, Spacer relies on margins instead of height.
//    This results in a confusing DevTools experience, where the spacer appears to have a height of 0,
//    and developers need to manually calculate the rem values.
//    Suggestion: Replace margins with height in `spacerVariants` for better DevEx.
// 2. Discuss the overall purpose of the Spacer component:
//    - For UI development, prefer using `gap`, `space`, `margin`, or `padding` directly on parent elements.
//    - Retain Spacer primarily for higher-level product or page layouts where Tailwind classes are avoided,
//      and a reusable abstraction for spacing is beneficial.

const Spacer = ({ className, size, ...props }: SpacerProps) => (
  <div aria-hidden className={cn(spacerVariants({ size, className }))} {...props} />
)

Spacer.displayName = 'Spacer'

export { Spacer }
