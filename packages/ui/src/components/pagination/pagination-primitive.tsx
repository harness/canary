import * as React from 'react'

import { useRouterContext } from '@/context'
import { IconV2 } from '@components/icon-v2'
import { cn } from '@utils/cn'

import { Button, ButtonSizes, buttonVariants } from '../button'

const PaginationPrimitiveRoot = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav role="navigation" aria-label="pagination" className={cn('cn-pagination-root', className)} {...props} />
)
PaginationPrimitiveRoot.displayName = 'PaginationPrimitiveRoot'

const PaginationPrimitiveContent = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(
  ({ className, ...props }, ref) => <ul ref={ref} className={cn('cn-pagination-content', className)} {...props} />
)
PaginationPrimitiveContent.displayName = 'PaginationPrimitiveContent'

const PaginationPrimitiveItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn(className)} {...props} />
)
PaginationPrimitiveItem.displayName = 'PaginationPrimitiveItem'

type PaginationPrimitiveLinkGeneralProps = {
  isActive?: boolean
  disabled?: boolean
  onClick?: (e: React.MouseEvent) => void
  size?: ButtonSizes
} & React.ComponentProps<'a'> &
  React.ComponentProps<'button'>

interface PaginationPrimitiveLinkProps extends Omit<PaginationPrimitiveLinkGeneralProps, 't'> {
  disabled?: boolean
  iconOnly?: boolean
}

const PaginationPrimitiveLink = ({
  className,
  isActive,
  children,
  href,
  ref,
  disabled = false,
  onClick,
  iconOnly,
  size,
  ...props
}: PaginationPrimitiveLinkProps) => {
  const { Link: LinkBase } = useRouterContext()
  if (!onClick && !href) {
    throw new Error('PaginationPrimitiveLink must have either onClick or href')
  }

  if (onClick) {
    return (
      <Button
        ignoreIconOnlyTooltip
        iconOnly={iconOnly}
        ref={ref as React.Ref<HTMLButtonElement>}
        variant="outline"
        disabled={disabled}
        onClick={onClick}
        size={size}
        className={cn(
          {
            'cn-button-active': isActive,
            'cn-button-disabled': disabled
          },
          className
        )}
        {...props}
      >
        {children}
      </Button>
    )
  }

  return (
    <LinkBase
      to={href as string}
      className={cn(
        buttonVariants({ variant: 'outline', rounded: false, size }),
        {
          'cn-button-active': isActive,
          'cn-button-disabled': disabled,
          'cn-button-icon-only': iconOnly
        },
        className
      )}
      data-disabled={disabled}
      aria-disabled={disabled}
      aria-current={isActive ? 'page' : undefined}
      onClick={disabled ? e => e.preventDefault() : undefined}
      {...props}
    >
      {children}
    </LinkBase>
  )
}

PaginationPrimitiveLink.displayName = 'PaginationPrimitiveLink'

const PaginationPrimitivePrevious = ({
  disabled,
  className,
  href = '#',
  ...props
}: PaginationPrimitiveLinkGeneralProps) => {
  return (
    <PaginationPrimitiveLink
      aria-label="Go to previous page"
      disabled={disabled}
      className={className}
      href={href}
      iconOnly
      {...props}
      size="sm"
    >
      <IconV2 name="nav-arrow-left" />
    </PaginationPrimitiveLink>
  )
}
PaginationPrimitivePrevious.displayName = 'PaginationPrimitivePrevious'

const PaginationPrimitiveNext = ({
  disabled,
  className,
  href = '#',
  ...props
}: PaginationPrimitiveLinkGeneralProps) => {
  return (
    <PaginationPrimitiveLink
      aria-label="Go to next page"
      disabled={disabled}
      className={className}
      href={href}
      iconOnly
      {...props}
      size="sm"
    >
      <IconV2 name="nav-arrow-right" />
    </PaginationPrimitiveLink>
  )
}
PaginationPrimitiveNext.displayName = 'PaginationPrimitiveNext'

const PaginationPrimitiveEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => (
  <span aria-hidden className={cn('cn-pagination-ellipsis', className)} {...props}>
    ...
    <span className="sr-only">More pages</span>
  </span>
)
PaginationPrimitiveEllipsis.displayName = 'PaginationPrimitiveEllipsis'

const PaginationPrimitive = {
  Root: PaginationPrimitiveRoot,
  Content: PaginationPrimitiveContent,
  Link: PaginationPrimitiveLink,
  Item: PaginationPrimitiveItem,
  Previous: PaginationPrimitivePrevious,
  Next: PaginationPrimitiveNext,
  Ellipsis: PaginationPrimitiveEllipsis
}

export { PaginationPrimitive }
