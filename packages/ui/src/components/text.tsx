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

export const typographyVariantConfig = {
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
  'caption-strong': 'font-caption-strong',
  'caption-single-line-normal': 'font-caption-single-line-normal',
  'caption-single-line-soft': 'font-caption-single-line-soft'
}

export const textVariants = cva('', {
  variants: {
    variant: typographyVariantConfig,
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
      'foreground-1': 'text-cn-1',
      'foreground-2': 'text-cn-2',
      'foreground-3': 'text-cn-3',
      disabled: 'text-cn-disabled',
      success: 'text-cn-success',
      warning: 'text-cn-warning',
      merged: 'text-cn-merged',
      danger: 'text-cn-danger',
      accent: 'text-cn-brand'
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

const textVariantToElement: Record<
  TextVariant,
  { element: TextElement; color: VariantProps<typeof textVariants>['color'] }
> = {
  'heading-hero': { element: 'p', color: 'foreground-1' },
  'heading-section': { element: 'p', color: 'foreground-1' },
  'heading-subsection': { element: 'p', color: 'foreground-1' },
  'heading-base': { element: 'p', color: 'foreground-1' },
  'heading-small': { element: 'p', color: 'foreground-1' },
  'body-normal': { element: 'p', color: 'foreground-2' },
  'body-single-line-normal': { element: 'p', color: 'foreground-2' },
  'body-strong': { element: 'p', color: 'foreground-2' },
  'body-single-line-strong': { element: 'p', color: 'foreground-2' },
  'body-code': { element: 'pre', color: 'foreground-2' },
  'caption-normal': { element: 'span', color: 'foreground-2' },
  'caption-soft': { element: 'span', color: 'foreground-2' },
  'caption-strong': { element: 'span', color: 'foreground-2' },
  'caption-single-line-normal': { element: 'span', color: 'foreground-2' },
  'caption-single-line-soft': { element: 'span', color: 'foreground-2' }
}

const getTextNode = ({ as, variant = 'body-normal', asChild }: Pick<TextProps, 'as' | 'asChild' | 'variant'>) => {
  if (asChild) return Slot

  if (as) return as

  if (textVariantToElement[variant ?? 'body-normal']) {
    return textVariantToElement[variant ?? 'body-normal'].element
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
      color: _color,
      wrap,
      as,
      title,
      ...props
    },
    ref
  ) => {
    const [titleText, setTitleText] = useState('')

    const Comp = getTextNode({ as, variant, asChild })
    const isHeading = !as && !!variant?.startsWith('heading')
    const color = _color ?? textVariantToElement[variant ?? 'body-normal'].color

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
        {...wrapConditionalObjectElement({ title: title || titleText }, !!isTruncated || !!lineClamp)}
      >
        {children}
      </Comp>
    )
  }
)

TextWithRef.displayName = 'Text'
const Text = TextWithRef as unknown as TextComponent

export { Text, type TextProps }
