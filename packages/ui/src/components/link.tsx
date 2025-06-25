import { MouseEvent, RefAttributes } from 'react'
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
      default: '',
      sm: 'cn-link-sm'
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'default'
  }
})

interface LinkProps extends LinkBaseProps, RefAttributes<HTMLAnchorElement>, VariantProps<typeof linkVariants> {
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
}

const Link = ({
  className,
  variant = 'default',
  children,
  prefixIcon,
  suffixIcon,
  disabled = false,
  size,
  onClick,
  ...props
}: LinkProps) => {
  const { Link: LinkBase } = useRouterContext()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      e.preventDefault()
      e.stopPropagation()
    } else {
      onClick?.(e)
    }
  }

  return (
    <LinkBase
      {...props}
      className={cn(linkVariants({ variant, size }), className)}
      onClick={handleClick}
      data-disabled={disabled}
      aria-disabled={disabled}
    >
      {!!prefixIcon && <IconV2 name={typeof prefixIcon === 'string' ? prefixIcon : 'nav-arrow-left'} size="2xs" />}
      {children}
      {!!suffixIcon && <IconV2 name={typeof suffixIcon === 'string' ? suffixIcon : 'arrow-up-right'} size="2xs" />}
    </LinkBase>
  )
}

Link.displayName = 'Link'

export { Link, type LinkProps }
