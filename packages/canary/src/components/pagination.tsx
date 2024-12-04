import * as React from 'react'

import { buttonVariants, type ButtonProps } from '@/components/button'
import { cn } from '@/lib/utils'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'

import { Icon } from './icon'

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full max-w-full items-center justify-between', className)}
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
  <li ref={ref} className={cn('', className)} {...props} />
))
PaginationItem.displayName = 'PaginationItem'

type PaginationLinkProps = {
  isActive?: boolean
  disabled?: boolean
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<'a'>

const PaginationLink = ({ className, isActive, size, ...props }: PaginationLinkProps) => (
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  <a
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? 'secondary' : 'tertiary',
        size: size ? size : 'sm_icon',
        borderRadius: 'full'
      }),
      'w-auto min-w-7 px-1.5 text-[12px] font-normal',
      { 'bg-primary/15': isActive },
      className
    )}
    {...props}
  />
)
PaginationLink.displayName = 'PaginationLink'

const PaginationPrevious = ({ disabled, className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn(
      'bg-transparent, cursor-pointer gap-1.5 pl-2.5 text-sm font-normal',
      { 'text-tertiary-background pointer-events-none cursor-default opacity-40 hover:bg-transparent': disabled },
      className
    )}
    {...props}
  >
    <Icon name="arrow-long" size={12} className="text-tertiary-background rotate-180" />
    <span>Previous</span>
  </PaginationLink>
)
PaginationPrevious.displayName = 'PaginationPrevious'

const PaginationNext = ({ disabled, className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn(
      'bg-transparent, cursor-pointer gap-1.5 pr-2.5 text-sm font-normal',
      { 'text-tertiary-background pointer-events-none cursor-default opacity-40 hover:bg-transparent': disabled },
      className
    )}
    {...props}
  >
    <span>Next</span>
    <Icon name="arrow-long" size={12} />
  </PaginationLink>
)
PaginationNext.displayName = 'PaginationNext'

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn('bg-tertiary flex h-7 w-7 items-center justify-center rounded-full text-sm font-normal', className)}
    {...props}
  >
    <DotsHorizontalIcon className="size-4" />
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
