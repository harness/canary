import * as React from 'react'

import { cn } from '@utils/cn'
import { TFunction } from 'i18next'

import { ButtonProps, buttonVariants } from '../button'
import { Icon } from '../icon'

const PaginationPrimitiveRoot = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full max-w-[700px] items-center justify-between', className)}
    {...props}
  />
)
PaginationPrimitiveRoot.displayName = 'PaginationPrimitiveRoot'

const PaginationPrimitiveContent = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn('flex flex-grow items-center justify-center gap-3', className)} {...props} />
  )
)
PaginationPrimitiveContent.displayName = 'PaginationPrimitiveContent'

const PaginationPrimitiveItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn('first:mr-auto last:ml-auto', className)} {...props} />
)
PaginationPrimitiveItem.displayName = 'PaginationPrimitiveItem'

type PaginationPrimitiveLinkGeneralProps = {
  isActive?: boolean
  disabled?: boolean
  t: TFunction
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<'a'>

interface PaginationPrimitiveLinkProps extends Omit<PaginationPrimitiveLinkGeneralProps, 't'> {
  isFullRounded?: boolean
}

const PaginationPrimitiveLink = ({
  className,
  isActive,
  size,
  isFullRounded = true,
  children,
  ...props
}: PaginationPrimitiveLinkProps) => (
  <a
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      buttonVariants({
        variant: 'custom',
        size: size ? size : 'sm_icon',
        borderRadius: isFullRounded ? 'full' : 'default'
      }),
      'text-1 bg-cn-background-2 text-cn-foreground-1 hover:bg-cn-background-3 w-auto min-w-7 px-1.5 font-normal',
      {
        'bg-cn-background-8 shadow-1 hover:bg-cn-background-8 cursor-default': isActive
      },
      className
    )}
    {...props}
  >
    {children}
  </a>
)
PaginationPrimitiveLink.displayName = 'PaginationPrimitiveLink'

const PaginationPrimitivePrevious = ({
  t,
  disabled,
  className,
  href = '#',
  ...props
}: PaginationPrimitiveLinkGeneralProps) => (
  <PaginationPrimitiveLink
    aria-label="Go to previous page"
    size="default"
    isFullRounded={false}
    className={cn(
      'text-cn-foreground-2 cursor-pointer gap-1.5 bg-transparent text-sm font-normal',
      'hover:text-cn-foreground-1 hover:bg-transparent',
      { 'text-cn-foreground-3 pointer-events-none cursor-default': disabled },
      className
    )}
    href={href}
    {...props}
  >
    <Icon name="arrow-long" size={12} className="rotate-180" />
    <span>{t('component:pagination.previous', 'Previous')}</span>
  </PaginationPrimitiveLink>
)
PaginationPrimitivePrevious.displayName = 'PaginationPrimitivePrevious'

const PaginationPrimitiveNext = ({
  t,
  disabled,
  className,
  href = '#',
  ...props
}: PaginationPrimitiveLinkGeneralProps) => (
  <PaginationPrimitiveLink
    aria-label="Go to next page"
    size="default"
    isFullRounded={false}
    className={cn(
      'text-cn-foreground-2 cursor-pointer gap-1.5 bg-transparent text-sm font-normal',
      'hover:text-cn-foreground-1 hover:bg-transparent',
      { 'text-cn-foreground-3 pointer-events-none cursor-default': disabled },
      className
    )}
    href={href}
    {...props}
  >
    <span>{t('component:pagination.next', 'Next')}</span>
    <Icon name="arrow-long" size={12} />
  </PaginationPrimitiveLink>
)
PaginationPrimitiveNext.displayName = 'PaginationPrimitiveNext'

const PaginationPrimitiveEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn(
      'text-1 bg-cn-background-2 flex h-7 w-7 items-center justify-center rounded-full font-normal',
      className
    )}
    {...props}
  >
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
