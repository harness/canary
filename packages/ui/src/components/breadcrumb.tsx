import {
  ComponentProps,
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  forwardRef,
  Fragment,
  MouseEventHandler,
  ReactNode,
  useState
} from 'react'

import { Slot } from '@radix-ui/react-slot'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

import { Avatar, AvatarProps, AvatarSize } from './avatar'
import { Button } from './button'
import { CopyButton } from './copy-button'
import { DropdownMenu } from './dropdown-menu'
import { IconV2, IconV2NamesType } from './icon-v2'
import { Link, type LinkProps } from './link'

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
  /**
   * Opt-in: instead of opening a dropdown, clicking the ellipsis expands the hidden items
   * in place as regular breadcrumb links, replacing the ellipsis.
   */
  expandInline?: boolean
}

const BreadcrumbEllipsis = forwardRef<HTMLButtonElement, BreadcrumbEllipsisProps>(
  ({ className, items, onItemSelect, expandInline = false, ...props }, ref) => {
    const [expanded, setExpanded] = useState(false)

    if (expandInline && expanded) {
      return (
        <>
          {items.map((item, index) => (
            <Fragment key={index}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={item.href}
                  prefixIcon={item.icon}
                  onClick={
                    onItemSelect
                      ? e => {
                          // The consumer owns navigation (e.g. SPA routing); don't also follow the href
                          e.preventDefault()
                          onItemSelect(item)
                        }
                      : undefined
                  }
                >
                  {item.label}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Fragment>
          ))}
        </>
      )
    }

    if (expandInline) {
      return (
        <Button
          ref={ref}
          variant="ghost"
          size="xs"
          iconOnly
          aria-label="Show full path"
          aria-expanded={false}
          tooltipProps={{ content: 'Show full path' }}
          className={cn('cn-breadcrumb-ellipsis', className)}
          {...props}
          onClick={e => {
            props.onClick?.(e)
            setExpanded(true)
          }}
        >
          <IconV2 name="more-horizontal" />
        </Button>
      )
    }

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

type BreadcrumbScopeLinkProps = Omit<ComponentPropsWithoutRef<'div'>, 'onClick'> & {
  /** Size of the breadcrumb - determines avatar size (sm uses lg avatar, xs uses sm avatar) */
  size?: 'sm' | 'xs'
  /** Avatar props (src, icon, name). When provided, a square (non-rounded) avatar replaces the icon */
  avatar?: Omit<AvatarProps, 'size' | 'rounded'>
  /** Icon shown before the text when no avatar is given (e.g. `globe` for account, `folder` for project) */
  icon?: IconV2NamesType
  /** Destination of the text link (the scope's home) */
  href?: string
  /** Called when the text is clicked (the scope's home) */
  onHomeClick?: MouseEventHandler<HTMLElement>
  /** When provided, a second hit target is rendered that calls this to open the scope selector */
  onScopeClick?: ComponentPropsWithoutRef<'button'>['onClick']
  /** Accessible label for the scope selector trigger */
  scopeLabel?: string
}

/**
 * A breadcrumb for a scope level (account, organization or project). The text goes to that scope's home;
 * an optional second hit target opens the scope selector to switch scope.
 */
const BreadcrumbScopeLink = forwardRef<HTMLDivElement, BreadcrumbScopeLinkProps>(
  (
    {
      className,
      size = 'sm',
      avatar,
      icon,
      href,
      onHomeClick,
      onScopeClick,
      scopeLabel = 'Select scope',
      children,
      ...props
    },
    ref
  ) => {
    const avatarSize: AvatarSize = size === 'sm' ? 'lg' : 'sm'
    const homeContent = (
      <>
        {avatar ? (
          <Avatar size={avatarSize} {...avatar} />
        ) : (
          icon && <IconV2 name={icon} size="sm" className="cn-breadcrumb-scope-icon" />
        )}
        <span className="cn-breadcrumb-scope-text">{children}</span>
      </>
    )

    return (
      <div ref={ref} className={cn('cn-breadcrumb-scope', className)} {...props}>
        {/* An <a> without href has no link role and isn't focusable. Without a home destination
            fall back to a button (handler only) or plain text (home not built yet). */}
        {href ? (
          <a href={href} onClick={onHomeClick} className="cn-breadcrumb-scope-link">
            {homeContent}
          </a>
        ) : onHomeClick ? (
          <button type="button" onClick={onHomeClick} className="cn-breadcrumb-scope-link">
            {homeContent}
          </button>
        ) : (
          <span className="cn-breadcrumb-scope-link cn-breadcrumb-scope-link-static">{homeContent}</span>
        )}
        {onScopeClick && (
          <button type="button" aria-label={scopeLabel} onClick={onScopeClick} className="cn-breadcrumb-scope-trigger">
            <IconV2 name="nav-arrow-up" size="sm" className="cn-breadcrumb-scope-chevron" />
          </button>
        )}
      </div>
    )
  }
)
BreadcrumbScopeLink.displayName = 'BreadcrumbScopeLink'

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
  ScopeLink: BreadcrumbScopeLink
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
  BreadcrumbRootInteractiveProps,
  BreadcrumbScopeLinkProps
}
