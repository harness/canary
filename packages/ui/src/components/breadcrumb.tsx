import {
  Children,
  cloneElement,
  ComponentProps,
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  forwardRef,
  Fragment,
  isValidElement,
  ReactElement,
  ReactNode
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

/** Max characters shown for a breadcrumb label before it's truncated with an ellipsis. */
const MAX_LABEL_LENGTH = 30
/** Max characters shown in the reveal-on-hover tooltip (native `title`) for a truncated label. */
const MAX_TOOLTIP_LENGTH = 80

/**
 * Applies the breadcrumb truncation rules to a label:
 * - string labels longer than `MAX_LABEL_LENGTH` are cut to 30 chars + an ellipsis
 * - the full name is surfaced via a native `title` tooltip, capped at `MAX_TOOLTIP_LENGTH` chars
 *
 * Non-string children (custom nodes) are left untouched, and short labels get no `title`.
 */
function truncateLabel(children: ReactNode): { content: ReactNode; title?: string } {
  if (typeof children !== 'string' || children.length <= MAX_LABEL_LENGTH) {
    return { content: children }
  }

  const content = `${children.slice(0, MAX_LABEL_LENGTH)}…`
  const title =
    children.length > MAX_TOOLTIP_LENGTH ? `${children.slice(0, MAX_TOOLTIP_LENGTH - 1)}…` : children

  return { content, title }
}

/** Number of steps a trail can show before it collapses from the left (root side). */
const MAX_VISIBLE_STEPS = 5
/** How many trailing steps (current page + its nearest ancestors) stay visible once a trail collapses. */
const STEPS_AFTER_COLLAPSE = 2

/** Pulls the plain-text label out of a step's children, ignoring icons and other non-text nodes. */
function extractStepText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractStepText).join('')
  if (isValidElement(node)) return extractStepText((node.props as { children?: ReactNode }).children)
  return ''
}

/** Finds the first navigable target (anchor `href` or router `to`) nested inside a step. */
function extractStepHref(node: ReactNode): string | undefined {
  let href: string | undefined
  const visit = (current: ReactNode): void => {
    if (href !== undefined || !isValidElement(current)) return
    const props = current.props as { href?: string; to?: string; children?: ReactNode }
    if (typeof props.href === 'string') {
      href = props.href
      return
    }
    if (typeof props.to === 'string') {
      href = props.to
      return
    }
    Children.forEach(props.children, visit)
  }
  visit(node)
  return href
}

/** Flattens Fragment wrappers so interleaved steps and separators can be counted and sliced as one sequence. */
function flattenBreadcrumbChildren(children: ReactNode): ReactElement[] {
  const result: ReactElement[] = []
  Children.forEach(children, child => {
    if (!isValidElement(child)) return
    if (child.type === Fragment) {
      result.push(...flattenBreadcrumbChildren((child.props as { children?: ReactNode }).children))
    } else {
      result.push(child)
    }
  })
  return result
}

/**
 * Enforces the trail-length rule: once a breadcrumb has more than `MAX_VISIBLE_STEPS` steps, the leading
 * steps (starting at the root, on the left) collapse into a single Ellipsis dropdown, leaving the last
 * `STEPS_AFTER_COLLAPSE` steps visible. Shorter trails are returned exactly as authored.
 */
function collapseLeadingSteps(children: ReactNode): ReactNode {
  const flat = flattenBreadcrumbChildren(children)
  const isStep = (el: ReactElement) => el.type === BreadcrumbItem || el.type === BreadcrumbPage
  const steps = flat.filter(isStep)

  if (steps.length <= MAX_VISIBLE_STEPS) return children

  const hiddenSteps = steps.slice(0, steps.length - STEPS_AFTER_COLLAPSE)
  const firstVisibleStep = steps[steps.length - STEPS_AFTER_COLLAPSE]
  const tail = flat.slice(flat.indexOf(firstVisibleStep))

  const hiddenItems: BreadcrumbEllipsisItem[] = hiddenSteps.map(step => ({
    label: extractStepText((step.props as { children?: ReactNode }).children) || '…',
    href: extractStepHref(step) ?? '#'
  }))

  return (
    <>
      <BreadcrumbEllipsis items={hiddenItems} aria-label="Show hidden breadcrumbs" />
      <BreadcrumbSeparator />
      {tail.map((el, index) => cloneElement(el, { key: el.key ?? `cn-breadcrumb-step-${index}` }))}
    </>
  )
}

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

const BreadcrumbList = forwardRef<HTMLOListElement, BreadcrumbListProps>(({ className, children, ...props }, ref) => (
  <ol ref={ref} className={cn('cn-breadcrumb-list', className)} {...props}>
    {collapseLeadingSteps(children)}
  </ol>
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
  ({ asChild, className, prefixIcon, children, title, ...props }, ref) => {
    const Comp = asChild ? Slot : 'a'

    const { content: label, title: truncatedTitle } = truncateLabel(children)

    const content = prefixIcon ? (
      <>
        <IconV2 name={prefixIcon} size="sm" className="cn-breadcrumb-prefix-icon" />
        {label}
      </>
    ) : (
      label
    )

    const linkClassName = cn('cn-breadcrumb-link', prefixIcon && 'cn-breadcrumb-link-with-icon', className)

    // When asChild is true and prefixIcon is provided, we need to wrap content
    // because Slot expects a single child element
    if (asChild && prefixIcon) {
      return (
        <Comp ref={ref} className={linkClassName} title={title ?? truncatedTitle} {...props}>
          <span className="cn-breadcrumb-link-content">{content}</span>
        </Comp>
      )
    }

    return (
      <Comp ref={ref} className={linkClassName} title={title ?? truncatedTitle} {...props}>
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
  ({ className, isLast, prefixIcon, children, title, ...props }, ref) => {
    const { content: label, title: truncatedTitle } = truncateLabel(children)

    const content = prefixIcon ? (
      <>
        <IconV2 color="inherit" name={prefixIcon} size="sm" className="cn-breadcrumb-prefix-icon" />
        {label}
      </>
    ) : (
      label
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
      <Link
        variant="secondary"
        noHoverUnderline
        ref={ref}
        className={linkClassName}
        title={title ?? truncatedTitle}
        {...props}
      >
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
  ({ className, prefixIcon, children, title, ...props }, ref) => {
    const { content: label, title: truncatedTitle } = truncateLabel(children)

    return (
      <span
        ref={ref}
        role="link"
        aria-disabled="true"
        aria-current="page"
        title={title ?? truncatedTitle}
        className={cn('cn-breadcrumb-page', prefixIcon && 'cn-breadcrumb-page-with-icon', className)}
        {...props}
      >
        {prefixIcon && <IconV2 name={prefixIcon} size="sm" className="cn-breadcrumb-prefix-icon" />}
        {label}
      </span>
    )
  }
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
  ({ className, size = 'sm', isRootOnly = false, avatar, children, title, ...props }, ref) => {
    const avatarSize: AvatarSize = size === 'sm' ? 'lg' : 'sm'
    // Default icon: 'account' only when root is the only visible item, otherwise 'organizations'
    const defaultIcon: IconV2NamesType = isRootOnly ? 'account' : 'organizations'
    const { content: label, title: truncatedTitle } = truncateLabel(children)

    return (
      <button
        ref={ref}
        type="button"
        title={title ?? truncatedTitle}
        className={cn('cn-breadcrumb-dropdown', className)}
        {...props}
      >
        <Avatar
          size={avatarSize}
          rounded
          icon={!avatar?.src && !avatar?.name ? (avatar?.icon ?? defaultIcon) : avatar?.icon}
          {...avatar}
        />
        <span className="cn-breadcrumb-dropdown-text">{label}</span>
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
