import { RefAttributes } from 'react'
import type { LinkProps } from 'react-router-dom'

import { useRouterContext } from '@/context'
import { cn } from '@utils/cn'
import { cva, VariantProps } from 'class-variance-authority'

import { Icon } from './icon'

export const linkVariants = cva('link', {
  variants: {
    variant: {
      default: 'text-cn-foreground-1 hover:decoration-foreground-1',
      secondary: 'text-cn-foreground-2 hover:decoration-foreground-4',
      accent: 'text-cn-foreground-accent hover:decoration-foreground-accent'
    },
    size: {
      default: '',
      sm: 'link-sm'
    }
  }
})

export interface StyledLinkProps
  extends LinkProps,
    RefAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  /**
   * If true, the link will open in a new tab and have an arrow icon.
   */
  isExternal?: boolean
}

export const StyledLink = ({ className, variant = 'default', children, isExternal, ...props }: StyledLinkProps) => {
  const { Link } = useRouterContext()

  return (
    <Link className={cn(linkVariants({ variant }), className)} {...props}>
      {children} {isExternal && <Icon name="arrow-to-top-right" />}
    </Link>
  )
}

export { StyledLink as Hyperlink }
