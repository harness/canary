import { ComponentProps, ComponentPropsWithoutRef, ComponentPropsWithRef, forwardRef, ReactNode } from 'react'

import { Slot } from '@radix-ui/react-slot'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

import { CopyButton } from './copy-button'
import { IconV2 } from './icon-v2'

const breadcrumbVariants = cva('cn-breadcrumb', {
  variants: {
    size: {
      default: 'cn-breadcrumb-default',
      sm: 'cn-breadcrumb-sm'
    }
  },
  defaultVariants: {
    size: 'default'
  }
})

type BreadcrumbRootProps = ComponentPropsWithoutRef<'nav'> &
  VariantProps<typeof breadcrumbVariants> & {
    separator?: ReactNode
  }

const BreadcrumbRoot = forwardRef<HTMLElement, BreadcrumbRootProps>(({ className, size, ...props }, ref) => {
  return <nav ref={ref} aria-label="breadcrumb" className={cn(breadcrumbVariants({ size }), className)} {...props} />
})
BreadcrumbRoot.displayName = 'BreadcrumbRoot'

type BreadcrumbListProps = ComponentPropsWithoutRef<'ol'>

const BreadcrumbList = forwardRef<HTMLOListElement, BreadcrumbListProps>(({ className, ...props }, ref) => (
  <ol ref={ref} className={cn('cn-breadcrumb-list', className)} {...props} />
))
BreadcrumbList.displayName = 'BreadcrumbList'

type BreadcrumbItemProps = ComponentPropsWithoutRef<'li'>

const BreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('cn-breadcrumb-item', className)} {...props} />
))
BreadcrumbItem.displayName = 'BreadcrumbItem'

type BreadcrumbLinkProps = ComponentPropsWithoutRef<'a'> & {
  asChild?: boolean
}

const BreadcrumbLink = forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : 'a'

  return <Comp ref={ref} className={cn('cn-breadcrumb-link', className)} {...props} />
})
BreadcrumbLink.displayName = 'BreadcrumbLink'

type BreadcrumbPageProps = ComponentPropsWithoutRef<'span'>

const BreadcrumbPage = forwardRef<HTMLSpanElement, BreadcrumbPageProps>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn('cn-breadcrumb-page', className)}
    {...props}
  />
))
BreadcrumbPage.displayName = 'BreadcrumbPage'

type BreadcrumbSeparatorProps = ComponentProps<'li'>

const BreadcrumbSeparator = ({ children, className, ...props }: BreadcrumbSeparatorProps) => (
  <span role="presentation" aria-hidden="true" className={cn('cn-breadcrumb-separator', className)} {...props}>
    {children ?? <IconV2 name="slash" skipSize />}
  </span>
)
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator'

type BreadcrumbEllipsisProps = ComponentProps<'span'>

const BreadcrumbEllipsis = forwardRef<HTMLSpanElement, BreadcrumbEllipsisProps>(({ className, ...props }, ref) => (
  <span role="presentation" aria-hidden="true" className={cn('cn-breadcrumb-ellipsis', className)} {...props} ref={ref}>
    <IconV2 name="more-horizontal" skipSize />
    <span className="sr-only">More</span>
  </span>
))
BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis'

type BreadcrumbCopyProps = ComponentPropsWithRef<typeof CopyButton>

const BreadcrumbCopy = ({ className, ...props }: BreadcrumbCopyProps) => (
  <CopyButton size="xs" iconSize="xs" className={cn('cn-breadcrumb-copy', className)} {...props} />
)
BreadcrumbCopy.displayName = 'BreadcrumbCopy'

const Breadcrumb = {
  Root: BreadcrumbRoot,
  List: BreadcrumbList,
  Item: BreadcrumbItem,
  Link: BreadcrumbLink,
  Page: BreadcrumbPage,
  Copy: BreadcrumbCopy,
  Separator: BreadcrumbSeparator,
  Ellipsis: BreadcrumbEllipsis
}

export {
  Breadcrumb,
  BreadcrumbRootProps,
  BreadcrumbListProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbPageProps,
  BreadcrumbSeparatorProps,
  BreadcrumbEllipsisProps
}
