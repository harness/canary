import { forwardRef } from 'react'

import { Link, LinkProps } from '@components/link'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@utils/cn'

export interface AlertLinkProps extends LinkProps {
  external?: boolean
  asChild?: boolean
}

export const AlertLink = forwardRef<HTMLAnchorElement, AlertLinkProps>(
  ({ external = false, asChild = false, children, className, ...linkProps }, ref) => {
    if (asChild) {
      return (
        <div className="cn-alert-link-wrapper">
          <Slot ref={ref}>{children}</Slot>
        </div>
      )
    }

    const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}

    return (
      <div className="cn-alert-link-wrapper">
        <Link
          ref={ref}
          variant="secondary"
          suffixIcon
          className={cn('cn-alert-link', className)}
          {...externalProps}
          {...linkProps}
        >
          {children}
        </Link>
      </div>
    )
  }
)

AlertLink.displayName = 'AlertLink'
