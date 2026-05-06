import {
  ComponentProps,
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  forwardRef,
  ReactNode,
  useCallback
} from 'react'

import { useRouterContext } from '@/context/router-context'
import { NonEmptyString } from '@/types'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

import { Avatar, AvatarProps, AvatarSize } from './avatar'
import { Button } from './button'
import { CopyButton } from './copy-button'
import { DropdownMenu } from './dropdown-menu'
import { IconV2, IconV2NamesType } from './icon-v2'
import { Link, type LinkProps } from './link'

export interface BreadcrumbLinkItem<T extends string = string> {
  label: string
  to: NonEmptyString<T>
  prefixIcon?: IconV2NamesType
}

export interface BreadcrumbPageItem {
  label: string
  prefixIcon?: IconV2NamesType
}

export type BreadcrumbItems = [...BreadcrumbLinkItem[], BreadcrumbPageItem]

const breadcrumbVariants = cva('cn-breadcrumb', {
  variants: {
    size: {
      sm: 'cn-breadcrumb-sm',
      xs: 'cn-breadcrumb-xs'
    }
  },
  defaultVariants: {
    size: 'sm'
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

type BreadcrumbItemProps = ComponentPropsWithoutRef<'li'> & {
  prefixIcon?: IconV2NamesType
}

const BreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, prefixIcon, children, ...props }, ref) => (
    <li ref={ref} className={cn('cn-breadcrumb-item', className)} {...props}>
      {prefixIcon && <IconV2 name={prefixIcon} size="sm" className="cn-breadcrumb-prefix-icon" />}
      {children}
    </li>
  )
)
BreadcrumbItem.displayName = 'BreadcrumbItem'

type BreadcrumbLinkProps = ComponentPropsWithoutRef<'a'> & {
  asChild?: boolean
  prefixIcon?: IconV2NamesType
}

const BreadcrumbLink = forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ asChild, className, prefixIcon, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'a'

    const content = prefixIcon ? (
      <>
        <IconV2 name={prefixIcon} size="sm" className="cn-breadcrumb-prefix-icon" />
        {children}
      </>
    ) : (
      children
    )

    const linkClassName = cn('cn-breadcrumb-link', prefixIcon && 'cn-breadcrumb-link-with-icon', className)

    // When asChild is true and prefixIcon is provided, we need to wrap content
    // because Slot expects a single child element
    if (asChild && prefixIcon) {
      return (
        <Comp ref={ref} className={linkClassName} {...props}>
          <span className="cn-breadcrumb-link-content">{content}</span>
        </Comp>
      )
    }

    return (
      <Comp ref={ref} className={linkClassName} {...props}>
        {content}
      </Comp>
    )
  }
)
BreadcrumbLink.displayName = 'BreadcrumbLink'

type BreadcrumbHeaderLinkProps = LinkProps & {
  prefixIcon?: IconV2NamesType
  isLast?: boolean
}

const BreadcrumbHeaderLink = forwardRef<HTMLAnchorElement, BreadcrumbHeaderLinkProps>(
  ({ className, isLast, prefixIcon, children, ...props }, ref) => {
    const content = prefixIcon ? (
      <>
        <IconV2 color="inherit" name={prefixIcon} size="sm" className="cn-breadcrumb-prefix-icon" />
        {children}
      </>
    ) : (
      children
    )

    const linkClassName = cn(
      'cn-breadcrumb-link',
      {
        'cn-breadcrumb-link-with-icon': prefixIcon,
        'text-cn-1': isLast,
        'text-cn-3': !isLast
      },
      className
    )

    return (
      <Link variant="secondary" noHoverUnderline ref={ref} className={linkClassName} {...props}>
        {content}
      </Link>
    )
  }
)
BreadcrumbHeaderLink.displayName = 'BreadcrumbHeaderLink'

type BreadcrumbPageProps = ComponentPropsWithoutRef<'span'> & {
  prefixIcon?: IconV2NamesType
}

const BreadcrumbPage = forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
  ({ className, prefixIcon, children, ...props }, ref) => (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn('cn-breadcrumb-page', prefixIcon && 'cn-breadcrumb-page-with-icon', className)}
      {...props}
    >
      {prefixIcon && <IconV2 name={prefixIcon} size="sm" className="cn-breadcrumb-prefix-icon" />}
      {children}
    </span>
  )
)
BreadcrumbPage.displayName = 'BreadcrumbPage'

type BreadcrumbSeparatorProps = ComponentProps<'li'>

const BreadcrumbSeparator = ({ children, className, ...props }: BreadcrumbSeparatorProps) => (
  <span role="presentation" aria-hidden="true" className={cn('cn-breadcrumb-separator', className)} {...props}>
    {children ?? <IconV2 name="slash" skipSize />}
  </span>
)
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator'

interface BreadcrumbEllipsisItem {
  /** Display label for the item */
  label: string
  /** URL to navigate to */
  href: string
  /** Optional icon to display */
  icon?: IconV2NamesType
}

type BreadcrumbEllipsisProps = Omit<ComponentPropsWithoutRef<'button'>, 'children'> & {
  /** Hidden items to show in dropdown when clicked */
  items: BreadcrumbEllipsisItem[]
  /** Callback when an item is selected */
  onItemSelect?: (item: BreadcrumbEllipsisItem) => void
}

const BreadcrumbEllipsis = forwardRef<HTMLButtonElement, BreadcrumbEllipsisProps>(
  ({ className, items, onItemSelect, ...props }, ref) => {
    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button
            ref={ref}
            variant="ghost"
            size="xs"
            iconOnly
            ignoreIconOnlyTooltip
            className={cn('cn-breadcrumb-ellipsis', className)}
            {...props}
          >
            <IconV2 name="more-horizontal" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="start">
          {items.map((item, index) => (
            <DropdownMenu.Item
              key={index}
              title={item.label}
              onSelect={() => {
                onItemSelect?.(item)
                // Navigate if href is provided and no custom handler
                if (!onItemSelect && item.href) {
                  window.location.href = item.href
                }
              }}
            />
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    )
  }
)
BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis'

type BreadcrumbCopyProps = ComponentPropsWithRef<typeof CopyButton>

const BreadcrumbCopy = ({ className, ...props }: BreadcrumbCopyProps) => (
  <CopyButton size="xs" iconSize="xs" className={cn('cn-breadcrumb-copy', className)} {...props} />
)
BreadcrumbCopy.displayName = 'BreadcrumbCopy'

type BreadcrumbRootInteractiveProps = ComponentPropsWithoutRef<'button'> & {
  /** Size of the breadcrumb dropdown - determines avatar size (sm uses lg avatar, xs uses sm avatar) */
  size?: 'sm' | 'xs'
  /**
   * Whether this is the only visible root item (no other breadcrumb items after it).
   * - `true`: Shows 'account' icon (user is at root level, no navigation deeper)
   * - `false`: Shows 'organizations' icon (user has navigated deeper)
   * Only applies when no custom icon/src/name is provided in avatar prop.
   */
  isRootOnly?: boolean
  /** Avatar props to customize the avatar appearance (src, icon, name, etc.) */
  avatar?: Omit<AvatarProps, 'size' | 'rounded'>
}

const BreadcrumbRootInteractive = forwardRef<HTMLButtonElement, BreadcrumbRootInteractiveProps>(
  ({ className, size = 'sm', isRootOnly = false, avatar, children, ...props }, ref) => {
    const avatarSize: AvatarSize = size === 'sm' ? 'lg' : 'sm'
    // Default icon: 'account' only when root is the only visible item, otherwise 'organizations'
    const defaultIcon: IconV2NamesType = isRootOnly ? 'account' : 'organizations'

    return (
      <button ref={ref} type="button" className={cn('cn-breadcrumb-dropdown', className)} {...props}>
        <Avatar
          size={avatarSize}
          rounded
          icon={!avatar?.src && !avatar?.name ? (avatar?.icon ?? defaultIcon) : avatar?.icon}
          {...avatar}
        />
        <span className="cn-breadcrumb-dropdown-text">{children}</span>
        <IconV2 name="up-down" size="sm" className="cn-breadcrumb-dropdown-chevron" />
      </button>
    )
  }
)
BreadcrumbRootInteractive.displayName = 'BreadcrumbRootInteractive'

interface BreadcrumbNavProps {
  items: BreadcrumbItems
}

// Parses the URL rather than using shell route functions (e.g. routes.toMode) because this
// component lives in @harnessio/ui which has no access to shell route definitions.
function getHomePath(pathname: string): string {
  // Gitness/standalone: path contains /+/ scope delimiter
  const scopeEnd = pathname.indexOf('/+')
  if (scopeEnd !== -1) {
    return pathname.slice(0, scopeEnd + 2)
  }

  // Shell: /ng/account/{id}/{mode}[/module]/orgs/{org}/projects/{project}/...
  // Strip the module segment and everything after the project to get project home.
  const modeMatch = pathname.match(/^(\/ng\/account\/[^/]+\/[^/]+)/)
  if (modeMatch) {
    const modeBase = modeMatch[1]
    const orgsMatch = pathname.match(/\/orgs\/[^/]+\/projects\/[^/]+/)
    if (orgsMatch) {
      return `${modeBase}${orgsMatch[0]}`
    }
    return modeBase
  }

  return '/'
}

const BreadcrumbNav = ({ items }: BreadcrumbNavProps) => {
  // Uses window.location (not router context location) because MFEs like Code run their own
  // React Router with a basename — their context location only sees relative paths (e.g. "/repos").
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/'
  const homeTo = getHomePath(pathname)
  const linkItems = items.slice(0, -1) as BreadcrumbLinkItem[]
  const pageItem = items[items.length - 1]

  const { navigateToRoute } = useRouterContext()

  const handleHomeClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!navigateToRoute) return
      e.preventDefault()
      navigateToRoute(homeTo)
    },
    [navigateToRoute, homeTo]
  )

  return (
    <BreadcrumbRoot size="sm">
      <BreadcrumbList>
        {/* Uses <a href> so it works even without navigateToRoute (falls back to full page load).
            When navigateToRoute is provided, onClick intercepts for client-side navigation. */}
        <BreadcrumbItem>
          <BreadcrumbLink href={homeTo} onClick={handleHomeClick}>
            Home
          </BreadcrumbLink>
          <BreadcrumbSeparator />
        </BreadcrumbItem>
        {linkItems.map((item, index) => (
          <BreadcrumbItem key={index} prefixIcon={item.prefixIcon}>
            <BreadcrumbLink asChild>
              <Link variant="secondary" noHoverUnderline to={item.to}>
                {item.label}
              </Link>
            </BreadcrumbLink>
            <BreadcrumbSeparator />
          </BreadcrumbItem>
        ))}
        <BreadcrumbItem prefixIcon={pageItem.prefixIcon}>
          <BreadcrumbPage>{pageItem.label}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </BreadcrumbRoot>
  )
}
BreadcrumbNav.displayName = 'BreadcrumbNav'

const Breadcrumb = {
  Root: BreadcrumbRoot,
  List: BreadcrumbList,
  Item: BreadcrumbItem,
  Link: BreadcrumbLink,
  HeaderLink: BreadcrumbHeaderLink,
  Page: BreadcrumbPage,
  Copy: BreadcrumbCopy,
  Separator: BreadcrumbSeparator,
  Ellipsis: BreadcrumbEllipsis,
  RootInteractive: BreadcrumbRootInteractive,
  Nav: BreadcrumbNav
}

export {
  Breadcrumb,
  BreadcrumbRootProps,
  BreadcrumbListProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbPageProps,
  BreadcrumbSeparatorProps,
  BreadcrumbEllipsisProps,
  BreadcrumbEllipsisItem,
  BreadcrumbRootInteractiveProps
}
