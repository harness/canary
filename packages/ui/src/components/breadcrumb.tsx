import { ComponentProps, ComponentPropsWithoutRef, forwardRef, ReactNode } from 'react'

import { ChevronRightIcon, DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@utils/cn'

type BreadcrumbProps = ComponentPropsWithoutRef<'nav'> & {
  separator?: ReactNode
}

const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(({ ...props }, ref) => {
  return <nav ref={ref} aria-label="breadcrumb" {...props} />
})
Breadcrumb.displayName = 'Breadcrumb'

type BreadcrumbListProps = ComponentPropsWithoutRef<'ol'>

const BreadcrumbList = forwardRef<HTMLOListElement, BreadcrumbListProps>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      'text-muted-foreground flex flex-wrap items-center gap-1.5 break-words text-sm sm:gap-2.5',
      className
    )}
    {...props}
  />
))
BreadcrumbList.displayName = 'BreadcrumbList'

type BreadcrumbItemProps = ComponentPropsWithoutRef<'li'>

const BreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('inline-flex items-center gap-1.5 font-medium', className)} {...props} />
))
BreadcrumbItem.displayName = 'BreadcrumbItem'

type BreadcrumbLinkProps = ComponentPropsWithoutRef<'a'> & {
  asChild?: boolean
}

const BreadcrumbLink = forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : 'a'

  return <Comp ref={ref} className={cn('hover:text-foreground transition-colors', className)} {...props} />
})
BreadcrumbLink.displayName = 'BreadcrumbLink'

type BreadcrumbPageProps = ComponentPropsWithoutRef<'span'>

const BreadcrumbPage = forwardRef<HTMLSpanElement, BreadcrumbPageProps>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn('text-foreground font-normal', className)}
    {...props}
  />
))
BreadcrumbPage.displayName = 'BreadcrumbPage'

type BreadcrumbSeparatorProps = ComponentProps<'li'>

const BreadcrumbSeparator = ({ children, className, ...props }: BreadcrumbSeparatorProps) => (
  <span role="presentation" aria-hidden="true" className={cn('[&>svg]:size-3.5', className)} {...props}>
    {children ?? <ChevronRightIcon />}
  </span>
)
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator'

type BreadcrumbEllipsisProps = ComponentProps<'span'>

const BreadcrumbEllipsis = ({ className, ...props }: BreadcrumbEllipsisProps) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <DotsHorizontalIcon className="size-4" />
    <span className="sr-only">More</span>
  </span>
)
BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis'

export {
  Breadcrumb,
  BreadcrumbProps,
  BreadcrumbList,
  BreadcrumbListProps,
  BreadcrumbItem,
  BreadcrumbItemProps,
  BreadcrumbLink,
  BreadcrumbLinkProps,
  BreadcrumbPage,
  BreadcrumbPageProps,
  BreadcrumbSeparator,
  BreadcrumbSeparatorProps,
  BreadcrumbEllipsis,
  BreadcrumbEllipsisProps
}
