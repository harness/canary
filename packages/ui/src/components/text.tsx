import { ComponentProps, ElementType } from 'react'

import { Slot } from '@radix-ui/react-slot'
import { cn } from '@utils/cn'
import { cva, VariantProps } from 'class-variance-authority'

type TextElement =
  | 'span'
  | 'div'
  | 'p'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'label'
  | 'legend'
  | 'caption'
  | 'figcaption'
  | 'blockquote'
  | 'pre'
  | 'kbd'
  | 'var'
  | 'code'
  | 'samp'
  | 'cite'
  | 'time'
  | 'address'
  | 'strong'
  | 'abbr'
  | 'em'

const textVariants = cva('', {
  variants: {
    variant: {
      'heading-hero': 'font-heading-hero',
      'heading-section': 'font-heading-section',
      'heading-subsection': 'font-heading-subsection',
      'heading-base': 'font-heading-base',
      'heading-small': 'font-heading-small',
      'body-normal': 'font-body-normal',
      'body-single-line-normal': 'font-body-single-line-normal',
      'body-strong': 'font-body-strong',
      'body-single-line-strong': 'font-body-single-line-strong',
      'body-code': 'font-body-code',
      'caption-normal': 'font-caption-normal',
      'caption-soft': 'font-caption-soft',
      'caption-single-line-normal': 'font-caption-single-line-normal',
      'caption-single-line-soft': 'font-caption-single-line-soft'
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right'
    },
    truncate: {
      true: 'truncate'
    },
    color: {
      inherit: 'text-inherit',
      'foreground-1': 'text-cn-foreground-1',
      'foreground-2': 'text-cn-foreground-2',
      'foreground-3': 'text-cn-foreground-3',
      'state-disabled': 'text-cn-foreground-disabled',
      success: 'text-cn-foreground-success',
      warning: 'text-cn-foreground-warning',
      danger: 'text-cn-foreground-danger'
    },
    wrap: {
      wrap: 'text-wrap',
      nowrap: 'text-nowrap',
      pretty: 'text-pretty',
      balance: 'text-balance'
    }
  },
  defaultVariants: {
    variant: 'body-normal',
    align: 'left',
    color: 'foreground-2',
    truncate: false,
    wrap: 'wrap'
  }
})

const textVariantToElement: Record<string, TextElement> = {
  'heading-hero': 'h1',
  'heading-section': 'h2',
  'heading-subsection': 'h3',
  'heading-base': 'h4',
  'heading-small': 'h5',
  'body-code': 'pre'
}

const getTextNode = ({ as, variant, asChild }: Pick<TextProps, 'as' | 'asChild' | 'variant'>) => {
  if (asChild) {
    return Slot
  }

  if (textVariantToElement[variant]) {
    return textVariantToElement[variant]
  }

  return (as ?? 'span') as ElementType
}

type TextProps<E extends TextElement = 'span'> = Omit<ComponentProps<E>, 'color'> &
  Omit<VariantProps<typeof textVariants>, 'variant'> & {
    variant: Exclude<VariantProps<typeof textVariants>['variant'], undefined | null>
    /**
     * Shorthand for changing the default rendered element
     * into a semantically appropriate alternative.
     */
    as?: TextElement
    /**
     * Change the default rendered element for the one
     * passed as a child, merging their props and behavior.
     */
    asChild?: boolean
  }

const Text = <E extends TextElement = 'span'>({
  className,
  children,
  variant,
  as,
  asChild,
  align,
  color,
  truncate,
  wrap,
  ...props
}: TextProps<E>) => {
  const Comp = getTextNode({ as, variant, asChild })

  return (
    <Comp className={cn(textVariants({ variant, align, color, truncate, wrap }), className)} {...props}>
      {children}
    </Comp>
  )
}

export { Text }
