import { ComponentProps, ElementType, forwardRef, ReactElement, Ref, useCallback, useState } from 'react'

import { useMergeRefs, wrapConditionalObjectElement } from '@/utils'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@utils/cn'
import { cva, VariantProps } from 'class-variance-authority'

type TextElement =
  | 'div'
  | 'p'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'span'
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
  | 'li'
  | 'dt'
  | 'dd'

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
      'foreground-4': 'text-cn-foreground-4',
      disabled: 'text-cn-foreground-disabled',
      success: 'text-cn-foreground-success',
      warning: 'text-cn-foreground-warning',
      danger: 'text-cn-foreground-danger'
    },
    lineClamp: {
      default: '',
      1: 'line-clamp-1',
      2: 'line-clamp-2',
      3: 'line-clamp-3',
      4: 'line-clamp-4',
      5: 'line-clamp-5',
      6: 'line-clamp-6'
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
    color: 'foreground-2',
    truncate: false
  }
})

type TextVariant = Exclude<VariantProps<typeof textVariants>['variant'], undefined | null>

const textVariantToElement: Record<TextVariant, TextElement> = {
  'heading-hero': 'p',
  'heading-section': 'p',
  'heading-subsection': 'p',
  'heading-base': 'p',
  'heading-small': 'p',
  'body-normal': 'p',
  'body-single-line-normal': 'p',
  'body-strong': 'p',
  'body-single-line-strong': 'p',
  'body-code': 'pre',
  'caption-normal': 'span',
  'caption-soft': 'span',
  'caption-single-line-normal': 'span',
  'caption-single-line-soft': 'span'
}

const getTextNode = ({ as, variant = 'body-normal', asChild }: Pick<TextProps, 'as' | 'asChild' | 'variant'>) => {
  if (asChild) return Slot

  if (as) return as

  if (textVariantToElement[variant ?? 'body-normal']) {
    return textVariantToElement[variant ?? 'body-normal']
  }

  return 'span' as ElementType
}

type TextProps<E extends TextElement = 'span'> = Omit<ComponentProps<E>, 'color'> &
  VariantProps<typeof textVariants> & {
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

type TextComponent = <E extends TextElement = 'span'>(
  props: TextProps<E> & { ref?: Ref<HTMLElement> }
) => ReactElement | null

const TextWithRef = forwardRef<HTMLElement, TextProps>(
  (
    {
      className,
      children,
      truncate = false,
      lineClamp,
      variant = 'body-normal',
      asChild,
      align,
      color = 'foreground-2',
      wrap,
      as,
      ...props
    },
    ref
  ) => {
    const [titleText, setTitleText] = useState('')

    const Comp = getTextNode({ as, variant, asChild })
    const isHeading = !as && !!variant?.startsWith('heading')

    const getTitleFromRef = useCallback(
      (element: HTMLElement | null) => {
        if (element && (truncate || lineClamp)) {
          setTitleText(element.innerText || '')
        }
      },
      [truncate, lineClamp]
    )

    const compRef = useMergeRefs<HTMLElement>([getTitleFromRef, ref])

    const isTruncated = lineClamp ? false : truncate

    return (
      <Comp
        ref={compRef}
        className={cn(textVariants({ variant, align, color, truncate: isTruncated, lineClamp, wrap }), className)}
        {...props}
        {...wrapConditionalObjectElement({ role: 'heading' }, isHeading)}
        {...wrapConditionalObjectElement({ title: titleText }, !!isTruncated || !!lineClamp)}
      >
        {children}
      </Comp>
    )
  }
)

TextWithRef.displayName = 'Text'
const Text = TextWithRef as unknown as TextComponent

export { Text, type TextProps }
