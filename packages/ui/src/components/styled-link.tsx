import { MouseEvent, RefAttributes } from 'react'
import type { LinkProps } from 'react-router-dom'

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
  }
})

interface StyledLinkProps extends LinkProps, RefAttributes<HTMLAnchorElement>, VariantProps<typeof linkVariants> {
  prefixIcon?: boolean | IconProps['name']
  suffixIcon?: boolean | IconProps['name']
  disabled?: boolean
}

const StyledLink = ({
  className,
  variant = 'default',
  children,
  prefixIcon,
  suffixIcon,
  disabled = false,
  size,
  onClick,
  ...props
}: StyledLinkProps) => {
  const { Link } = useRouterContext()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      e.preventDefault()
      e.stopPropagation()
    } else {
      onClick?.(e)
    }
  }

  return (
    <span className={cn(linkVariants({ variant, size }), className)} data-disabled={disabled}>
      {!!prefixIcon && (
        <Icon className="cn-link-icon" name={typeof prefixIcon === 'string' ? prefixIcon : 'chevron-left'} skipSize />
      )}
      <Link {...props} onClick={handleClick} aria-disabled={disabled}>
        {children}
      </Link>
      {!!suffixIcon && (
        <Icon
          className="cn-link-icon"
          name={typeof suffixIcon === 'string' ? suffixIcon : 'arrow-to-top-right'}
          skipSize
        />
      )}
    </span>
  )
}

export { StyledLink as Link, type StyledLinkProps as LinkProps }
