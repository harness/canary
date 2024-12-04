import * as React from 'react'

import { cn } from '@utils/cn'
import { TFunction } from 'i18next'

import { buttonVariants, type ButtonProps } from './button'
import { Icon } from './icon'

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full max-w-full items-center justify-between px-9', className)}
    {...props}
  />
)
Pagination.displayName = 'Pagination'

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn('flex flex-grow items-center justify-center gap-3', className)} {...props} />
  )
)
PaginationContent.displayName = 'PaginationContent'

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('first:mr-auto last:ml-auto', className)} {...props} />
))
PaginationItem.displayName = 'PaginationItem'

type PaginationLinkProps = {
  isActive?: boolean
  disabled?: boolean
  t: TFunction
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<'a'>

const PaginationLink = ({ className, isActive, size, ...props }: Omit<PaginationLinkProps, 't'>) => (
  // "children" prop will provide the content
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  <a
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      buttonVariants({
        variant: 'custom',
        size: size ? size : 'sm_icon',
        borderRadius: 'full'
      }),
      'text-12 bg-background-2 text-foreground-1 hover:bg-background-3 w-auto min-w-7 px-1.5 font-normal',
      {
        'bg-background-8 shadow-pagination-1 hover:bg-background-8 cursor-default': isActive
      },
      className
    )}
    {...props}
  />
)
PaginationLink.displayName = 'PaginationLink'

const PaginationPrevious = ({ t, disabled, className, ...props }: PaginationLinkProps) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn(
      'text-foreground-2 cursor-pointer gap-1.5 bg-transparent pl-2.5 text-sm font-normal',
      'hover:text-foreground-1 hover:bg-transparent',
      { 'text-foreground-7 pointer-events-none cursor-default': disabled },
      className
    )}
    {...props}
  >
    <Icon name="arrow-long" size={12} className="rotate-180" />
    <span>{t('component:pagination.previous', 'Previous')}</span>
  </PaginationLink>
)
PaginationPrevious.displayName = 'PaginationPrevious'

const PaginationNext = ({ t, disabled, className, ...props }: PaginationLinkProps) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn(
      'text-foreground-2 cursor-pointer gap-1.5 bg-transparent pr-2.5 text-sm font-normal',
      'hover:text-foreground-1 hover:bg-transparent',
      { 'text-foreground-7 pointer-events-none cursor-default': disabled },
      className
    )}
    {...props}
  >
    <span>{t('component:pagination.next', 'Next')}</span>
    <Icon name="arrow-long" size={12} />
  </PaginationLink>
)
PaginationNext.displayName = 'PaginationNext'

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn(
      'text-12 bg-background-2 flex h-7 w-7 items-center justify-center rounded-full font-normal',
      className
    )}
    {...props}
  >
    ...
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = 'PaginationEllipsis'

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis
}
