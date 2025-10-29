import { forwardRef } from 'react'

import { Link, LinkProps } from '@components/link'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@utils/cn'

export type AlertLinkProps = LinkProps & {
  asChild?: boolean
}

export const AlertLink = forwardRef<HTMLAnchorElement, AlertLinkProps>(
  ({ external, asChild = false, children, className, ...linkProps }, ref) => {
    if (asChild) {
      return (
        <div className="cn-alert-link-wrapper">
          <Slot ref={ref}>{children}</Slot>
        </div>
      )
    }

    const narrowedProps = external
      ? (linkProps as Extract<LinkProps, { external: true; target: '_blank'; rel: 'noopener noreferrer' }>)
      : (linkProps as Extract<LinkProps, { external?: false }>)

    return (
      <div className="cn-alert-link-wrapper">
        <Link
          ref={ref}
          variant="default"
          suffixIcon
          className={cn('cn-alert-link', className)}
          {...narrowedProps}
          {...linkProps}
        >
          {children}
        </Link>
      </div>
    )
  }
)

AlertLink.displayName = 'AlertLink'
