import { ComponentProps } from 'react'

import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const spacerVariants = cva('mt-4 block', {
  variants: {
    size: {
      1: 'mt-1',
      1.5: 'mt-1.5',
      2: 'mt-2',
      2.5: 'mt-2.5',
      3: 'mt-3',
      4: 'mt-4',
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

export interface SpacerProps extends ComponentProps<'span'>, VariantProps<typeof spacerVariants> {}

const Spacer = ({ className, size, ...props }: SpacerProps) => (
  <span aria-hidden className={cn(spacerVariants({ size, className }))} {...props}></span>
)

Spacer.displayName = 'Spacer'

export { Spacer }
