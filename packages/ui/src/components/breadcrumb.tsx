import {
  ComponentProps,
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  forwardRef,
  Fragment,
  ReactNode,
  useEffect,
  useRef,
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
   * in place as regular breadcrumb links, replacing the ellipsis. The button is labelled
   * "Show full path" automatically.
   *
   * Note: once expanded, `Ellipsis` renders a Fragment of links instead of the button, so a
   * `ref` passed to it is `null` while expanded.
   */
  expandInline?: boolean
  /**
   * Opt-in: label the ellipsis button "Show full path" (`aria-label` + tooltip). Requires a
   * `TooltipProvider` ancestor. Defaults to `false`, so existing dropdown ellipses are
   * unchanged (no label, no tooltip). With `expandInline` the button is always labelled, and
   * this only adds the tooltip.
   */
  showTooltip?: boolean
}

const BreadcrumbEllipsis = forwardRef<HTMLButtonElement, BreadcrumbEllipsisProps>(
  ({ className, items, onItemSelect, expandInline = false, showTooltip = false, ...props }, ref) => {
    const [expanded, setExpanded] = useState(false)
    const firstItemRef = useRef<HTMLAnchorElement>(null)
    const focusFirstItem = useRef(false)

    // The ellipsis button unmounts when expanding, so move focus to the first revealed link
    // (only after a user click) to keep keyboard and screen-reader users in place.
    useEffect(() => {
      if (expanded && focusFirstItem.current) {
        focusFirstItem.current = false
        firstItemRef.current?.focus()
      }
    }, [expanded])

    // Collapse again when the hidden path itself changes (e.g. the user navigated and this
    // instance stayed mounted). Keyed on content, not array identity, so re-renders don't reset it.
    const itemsSignature = items.map(item => `${item.label}\u0000${item.href ?? ''}`).join('\u0001')
    useEffect(() => {
      if (expandInline) setExpanded(false)
    }, [expandInline, itemsSignature])

    if (expandInline && expanded) {
      return (
        <>
          {items.map((item, index) => (
            <Fragment key={index}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                <BreadcrumbLink
                  ref={index === 0 ? firstItemRef : undefined}
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
          {...(showTooltip ? { tooltipProps: { content: 'Show full path' } } : { ignoreIconOnlyTooltip: true })}
          className={cn('cn-breadcrumb-ellipsis', className)}
          {...props}
          onClick={e => {
            props.onClick?.(e)
            focusFirstItem.current = true
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
            {...(showTooltip
              ? { 'aria-label': 'Show full path', tooltipProps: { content: 'Show full path' } }
              : { ignoreIconOnlyTooltip: true })}
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
   * - `true`: Shows the root icon (user is at root level, no navigation deeper)
   * - `false`: Shows 'organizations' icon (user has navigated deeper)
   * Only applies when no custom icon/src/name is provided in avatar prop.
   */
  isRootOnly?: boolean
  /**
   * Visual style of the leading icon/avatar.
   * - `default`: rounded avatar holding the icon; root-only icon is 'account'
   * - `plain` (opt-in): bare icon with no avatar circle; root-only icon is 'globe';
   *   `src`/`name` render a square avatar
   */
  variant?: 'default' | 'plain'
  /** Avatar props to customize the avatar appearance (src, icon, name, etc.) */
  avatar?: Omit<AvatarProps, 'size' | 'rounded'>
}

const BreadcrumbRootInteractive = forwardRef<HTMLButtonElement, BreadcrumbRootInteractiveProps>(
  ({ className, size = 'sm', isRootOnly = false, variant = 'default', avatar, children, ...props }, ref) => {
    const avatarSize: AvatarSize = size === 'sm' ? 'lg' : 'sm'
    const isPlain = variant === 'plain'
    // Default icon: the root icon only when root is the only visible item, otherwise 'organizations'
    const defaultIcon: IconV2NamesType = isRootOnly ? (isPlain ? 'globe' : 'account') : 'organizations'
    const hasAvatarImage = !!(avatar?.src || avatar?.name)

    return (
      <button ref={ref} type="button" className={cn('cn-breadcrumb-dropdown', className)} {...props}>
        {isPlain ? (
          hasAvatarImage ? (
            <Avatar size={avatarSize} {...avatar} />
          ) : (
            <IconV2 name={avatar?.icon ?? defaultIcon} size="sm" className="cn-breadcrumb-dropdown-icon" />
          )
        ) : (
          <Avatar
            size={avatarSize}
            rounded
            icon={!avatar?.src && !avatar?.name ? (avatar?.icon ?? defaultIcon) : avatar?.icon}
            {...avatar}
          />
        )}
        <span className="cn-breadcrumb-dropdown-text">{children}</span>
        <IconV2 name="up-down" size="sm" className="cn-breadcrumb-dropdown-chevron" />
      </button>
    )
  }
)
BreadcrumbRootInteractive.displayName = 'BreadcrumbRootInteractive'

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
  RootInteractive: BreadcrumbRootInteractive
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
