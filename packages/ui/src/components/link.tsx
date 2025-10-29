import { ComponentPropsWithoutRef, forwardRef, MouseEvent, RefAttributes } from 'react'
import type { LinkProps as LinkBaseProps } from 'react-router-dom'

import { useRouterContext } from '@/context'
import { cn } from '@utils/cn'
import { cva, VariantProps } from 'class-variance-authority'

import { IconPropsV2, IconV2 } from './icon-v2'

export const linkVariants = cva('cn-link', {
  variants: {
    variant: {
      default: 'cn-link-default',
      secondary: 'cn-link-secondary'
    },
    size: {
      md: '',
      sm: 'cn-link-sm'
    },
    noHoverUnderline: {
      true: 'cn-link-no-underline'
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'md'
  }
})

interface LinkCommonProps extends VariantProps<typeof linkVariants> {
  /**
   * If true, the 'chevron-left' icon will be displayed before the link text.
   * If a string, that string will be used as the icon name.
   */
  prefixIcon?: boolean | IconPropsV2['name']
  /**
   * If true, the 'arrow-to-top-right' icon will be displayed before the link text.
   * If a string, that string will be used as the icon name.
   */
  suffixIcon?: boolean | IconPropsV2['name']
  /**
   * If true, the link will be disabled and not clickable.
   * The default value is false.
   */
  disabled?: boolean

  /**
   * If true, the underline on hover will be disabled.
   * The default value is false.
   */
  noHoverUnderline?: boolean
}

type LinkProps =
  | ({ external: true } & LinkCommonProps & ComponentPropsWithoutRef<'a'>)
  | ({ external?: false } & LinkCommonProps & LinkBaseProps & RefAttributes<HTMLAnchorElement>)

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      className,
      variant = 'default',
      children,
      prefixIcon,
      suffixIcon,
      noHoverUnderline = false,
      disabled = false,
      size,
      onClick,
      external,
      ...props
    },
    ref
  ) => {
    const { Link: LinkBase } = useRouterContext()
    const LinkComp = external ? 'a' : LinkBase

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
      if (disabled) {
        e.preventDefault()
        e.stopPropagation()
      } else {
        onClick?.(e)
      }
    }

    return (
      <LinkComp
        {...(props as any)}
        className={cn(linkVariants({ variant, size, noHoverUnderline }), className)}
        onClick={handleClick}
        data-disabled={disabled}
        aria-disabled={disabled}
        ref={ref}
      >
        {!!prefixIcon && <IconV2 name={typeof prefixIcon === 'string' ? prefixIcon : 'nav-arrow-left'} size="2xs" />}
        {children}
        {!!suffixIcon && <IconV2 name={typeof suffixIcon === 'string' ? suffixIcon : 'arrow-up-right'} size="2xs" />}
      </LinkComp>
    )
  }
)

Link.displayName = 'Link'

export { Link, type LinkProps, type LinkCommonProps }
