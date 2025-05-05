import { MouseEvent, RefAttributes } from 'react'
import type { LinkProps as LinkBaseProps } from 'react-router-dom'

import { useRouterContext } from '@/context'
import { cn } from '@utils/cn'
import { cva, VariantProps } from 'class-variance-authority'

import { Icon, IconProps } from './icon'

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
  prefixIcon?: boolean | IconProps['name']
  /**
   * If true, the 'arrow-to-top-right' icon will be displayed before the link text.
   * If a string, that string will be used as the icon name.
   */
  suffixIcon?: boolean | IconProps['name']
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
      {!!prefixIcon && (
        <Icon className="cn-link-icon" name={typeof prefixIcon === 'string' ? prefixIcon : 'chevron-left'} skipSize />
      )}
      {children}
      {!!suffixIcon && (
        <Icon
          className="cn-link-icon"
          name={typeof suffixIcon === 'string' ? suffixIcon : 'arrow-to-top-right'}
          skipSize
        />
      )}
    </LinkBase>
  )
}

export { Link, type LinkProps }
