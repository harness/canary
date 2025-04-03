import { RefAttributes } from 'react'
import type { LinkProps } from 'react-router-dom'

import { useRouterContext } from '@/context'
import { cn } from '@utils/cn'
import { cva, VariantProps } from 'class-variance-authority'

const linkVariants = cva(
  'whitespace-nowrap decoration-transparent decoration-1 underline-offset-4 transition-colors duration-200',
  {
    variants: {
      variant: {
        default: 'text-cn-foreground-1 hover:decoration-foreground-1',
        secondary: 'text-cn-foreground-2 hover:decoration-foreground-4',
        accent: 'text-cn-foreground-accent hover:decoration-foreground-accent'
      }
    }
  }
)

export type StyledLinkProps = LinkProps & RefAttributes<HTMLAnchorElement> & VariantProps<typeof linkVariants>

export const StyledLink = ({ className, variant = 'default', ...props }: StyledLinkProps) => {
  const { Link } = useRouterContext()

  return <Link className={cn(linkVariants({ variant }), className)} {...props} />
}
