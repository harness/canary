import { forwardRef } from 'react'

import { Link, LinkProps } from '@components/link'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@utils/cn'

export type AlertItemLinkProps = LinkProps & {
  asChild?: boolean
}

export const AlertItemLink = forwardRef<HTMLAnchorElement, AlertItemLinkProps>(
  ({ external, asChild = false, children, className, ...linkProps }, ref) => {
    if (asChild) {
      return <Slot ref={ref}>{children}</Slot>
    }

    return (
      <Link
        ref={ref}
        variant="default"
        suffixIcon
        className={cn('z-10', className)}
        {...(external === true
          ? ({ ...linkProps, external: true, target: '_blank', rel: 'noopener noreferrer' } as Extract<
              LinkProps,
              { external: true }
            >)
          : (linkProps as Extract<LinkProps, { external?: false }>))}
      >
        {children}
      </Link>
    )
  }
)

AlertItemLink.displayName = 'AlertItemLink'
