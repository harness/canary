import * as React from 'react'

import { cn } from '@/lib/utils'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'

const headingVariants = cva('text-base', {
  variants: {
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right'
    },
    size: {
      1: 'text-xs',
      2: 'text-sm',
      3: 'text-base',
      4: 'text-xl',
      5: 'text-2xl',
      6: 'text-3xl',
      7: 'text-4xl',
      8: 'text-5xl',
      9: 'text-6xl',
      10: 'text-7xl',
      11: 'text-8xl',
      12: 'text-9xl'
    },
    trim: {
      normal: '',
      start: '',
      end: '',
      both: ''
    },
    truncate: {
      true: 'truncate text-nowrap'
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold'
    },
    wrap: {
      wrap: 'text-wrap',
      nowrap: 'text-nowrap',
      pretty: 'text-pretty',
      balance: 'text-balance'
    }
  }
})

interface HeadingProps extends React.ComponentProps<'h1'> {
  /**
   * Shorthand for changing the default rendered element
   * into a semantically appropriate alternative.
   */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

  /**
   * Change the default rendered element for the one
   * passed as a child, merging their props and behavior.
   */
  asChild?: boolean

  /**
   * Sets the CSS text-align property.
   */
  align?: 'left' | 'center' | 'right'

  /**
   * Sets the text size.
   */
  size?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

  /**
   * Trims the leading whitespace from the start or end
   * of the text.
   */
  trim?: 'normal' | 'start' | 'end' | 'both'

  /**
   * Truncates text with an ellipsis.
   */
  truncate?: boolean

  /**
   * Sets the font-weight property.
   */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'

  /**
   * Controls the wrapping behavior of the text.
   */
  wrap?: 'wrap' | 'nowrap' | 'pretty' | 'balance'
}

const Heading = ({ className, children, as, asChild, align, size, trim, truncate, wrap, ...props }: HeadingProps) => {
  const Comp = asChild ? Slot : as ? as.toString() : 'span'
  return (
    <Comp className={cn(headingVariants({ align, size, trim, truncate, wrap }), className)} {...props}>
      {children}
    </Comp>
  )
}

Heading.displayName = 'Heading'

export { Heading }
