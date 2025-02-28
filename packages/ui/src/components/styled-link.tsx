import type { LinkProps } from 'react-router-dom'

import { useRouterContext } from '@/context'
import { cn } from '@utils/cn'

type StyledLinkProps = LinkProps & React.RefAttributes<HTMLAnchorElement>

export function StyledLink({ className, ...props }: StyledLinkProps) {
  const { Link } = useRouterContext()
  return (
    <Link
      className={cn(
        'text-foreground-accent hover:decoration-foreground-accent underline decoration-transparent underline-offset-4 transition-colors duration-200',
        className
      )}
      {...props}
    />
  )
}
