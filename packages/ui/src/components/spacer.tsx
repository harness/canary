import { ComponentProps } from 'react'

import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const spacerVariants = cva('mt-4', {
  variants: {
    size: {
      1: 'mt-1',
      1.5: 'mt-1.5',
      2: 'mt-2',
      2.5: 'mt-2.5',
      3: 'mt-3',
      4: 'mt-4',
      4.5: 'mt-[18px]',
      5: 'mt-5',
      6: 'mt-6',
      7: 'mt-7',
      8: 'mt-8',
      9: 'mt-9',
      10: 'mt-10',
      11: 'mt-11',
      12: 'mt-12',
      13: 'mt-[3.25rem]',
      14: 'mt-14',
      15: 'mt-[3.75rem]',
      16: 'mt-16'
    }
  }
})

export interface SpacerProps extends ComponentProps<'div'>, VariantProps<typeof spacerVariants> {}

// TODO: Revisit the Spacer component
// 1. Currently, Spacer uses a <span> with `display: block;` and relies on margins instead of height.
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
