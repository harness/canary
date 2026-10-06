import {
  ComponentPropsWithoutRef,
  forwardRef,
  ReactNode,
  Ref,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'

import {
  Avatar,
  AvatarProps,
  Button,
  DropdownMenu,
  DropdownMenuItemProps,
  IconPropsV2,
  IconV2,
  IconV2NamesType,
  Layout,
  LogoPropsV2,
  LogoV2,
  StatusBadge,
  StatusBadgeProps,
  Text,
  Tooltip,
  type ButtonProps
} from '@/components'
import { NavLinkProps, useRouterContext } from '@/context'
import { filterChildrenByDisplayNames } from '@/utils'
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'
import { cn } from '@utils/cn'
import omit from 'lodash-es/omit'
import uniqueId from 'lodash-es/uniqueId'

import { useSidebar } from './sidebar-context'

const SUBMENU_ITEM_DISPLAY_NAME = 'SidebarMenuSubItem'

/**
 * True if any submenu item is active, at any nesting depth.
 */
function hasActiveSubmenuChild(children: ReactNode): boolean {
  return filterChildrenByDisplayNames(children, [SUBMENU_ITEM_DISPLAY_NAME]).some(el => {
    const { active, children: nested } = el.props as { active?: boolean; children?: ReactNode }
    return !!active || (!!nested && hasActiveSubmenuChild(nested))
  })
}

interface SidebarSubmenuGroupProps {
  open: boolean
  children: ReactNode
  /**
   * Group nested inside another submenu item. Uses the (smaller) nested indentation.
   */
  nested?: boolean
  id?: string
}

/**
 * Animated, collapsible container for submenu items. Shared by `SidebarItem` (level 2) and
 * `SidebarMenuSubItem` groups (level 3).
 */
const SidebarSubmenuGroup = ({ open, children, nested, id }: SidebarSubmenuGroupProps) => (
  <div
    id={id}
    className="cn-sidebar-submenu-group"
    role="group"
    data-state={open ? 'open' : 'closed'}
    aria-hidden={!open}
    style={{
      gridTemplateRows: open ? '1fr' : '0fr',
      // `inherit` (not `visible`) so a closed ancestor still hides an open nested group from focus/a11y
      visibility: open ? 'inherit' : 'hidden',
      // Keep links visible while collapsing, then hide once fully closed.
      transition: open
        ? 'grid-template-rows 0.2s ease-out, visibility 0s'
        : 'grid-template-rows 0.2s ease-out, visibility 0s linear 0.2s'
    }}
  >
    <div style={{ overflow: 'hidden', minHeight: 0 }}>
      <Layout.Grid
        columns="1fr"
        className={nested ? 'cn-sidebar-submenu-group-nested' : undefined}
        style={
          nested
            ? undefined
            : {
                paddingLeft: 'var(--cn-layout-xl)',
                paddingTop: 'var(--cn-sidebar-group-py)',
                paddingBottom: 'var(--cn-sidebar-group-py)',
                gap: 'var(--cn-spacing-2)'
              }
        }
      >
        {children}
      </Layout.Grid>
    </div>
  </div>
)

interface SidebarBadgeProps extends Omit<StatusBadgeProps, 'children' | 'size' | 'content'> {
  content?: ReactNode
}

type SidebarItemActionButtonPropsType = ButtonProps & {
  title?: string
  iconName?: IconV2NamesType
  iconProps?: Omit<IconPropsV2, 'ref' | 'name' | 'fallback'>
  onClick: React.MouseEventHandler<HTMLButtonElement>
}

interface SidebarItemCommonProps extends ComponentPropsWithoutRef<'button'> {
  title: string
  description?: string
  active?: boolean
  actionButtons?: SidebarItemActionButtonPropsType[]
  draggable?: boolean
  dragAttributes?: React.HTMLAttributes<HTMLElement>
  dragListeners?: SyntheticListenerMap
  subMenuOpen?: boolean
  onSubmenuChange?: (open: boolean) => void
}

interface SidebarItemWithChildrenProps extends SidebarItemCommonProps {
  children: ReactNode
  defaultSubmenuOpen?: boolean
  badge?: never
  actionMenuItems?: never
  dropdownMenuContent?: never
  withRightIndicator?: never
}

interface SidebarItemWithDropdownProps extends SidebarItemCommonProps {
  dropdownMenuContent: ReactNode
  children?: never
  defaultSubmenuOpen?: never
  badge?: never
  actionMenuItems?: never
  withRightIndicator?: never
}

interface SidebarItemWithIndicatorProps extends SidebarItemCommonProps {
  withRightIndicator: true
  children?: never
  defaultSubmenuOpen?: never
  badge?: never
  actionMenuItems?: never
  dropdownMenuContent?: never
}

interface SidebarItemWithBadgeProps extends SidebarItemCommonProps {
  badge?: string | SidebarBadgeProps
  actionMenuItems?: never
  defaultSubmenuOpen?: never
  children?: never
  dropdownMenuContent?: never
  withRightIndicator?: never
}
interface SidebarItemWithAndActionsProps extends SidebarItemCommonProps {
  badge?: never
  actionMenuItems?: DropdownMenuItemProps[]
  defaultSubmenuOpen?: boolean
  children?: never
  dropdownMenuContent?: never
  withRightIndicator?: never
}

type SidebarItemBaseProps =
  | SidebarItemWithChildrenProps
  | SidebarItemWithDropdownProps
  | SidebarItemWithIndicatorProps
  | SidebarItemWithBadgeProps
  | SidebarItemWithAndActionsProps

type SidebarItemIconProps = SidebarItemBaseProps & {
  icon?: IconPropsV2['name']
  logo?: never
  avatar?: never
}

type SidebarItemLogoProps = SidebarItemBaseProps & {
  logo?: LogoPropsV2['name']
  icon?: never
  avatar?: never
}

type SidebarItemAvatarProps = SidebarItemBaseProps & {
  avatarFallback?: AvatarProps['name']
  src?: AvatarProps['src']
  logo?: never
  icon?: never
}

type SidebarItemExtendedProps = (SidebarItemIconProps | SidebarItemLogoProps | SidebarItemAvatarProps) &
  SidebarItemHoverProps

type SidebarItemHoverProps = {
  onHoverIn?: (e: React.MouseEvent<HTMLElement>) => void
  onHoverOut?: (e: React.MouseEvent<HTMLElement>) => void
}

type SidebarItemButtonProps = SidebarItemExtendedProps &
  Omit<ComponentPropsWithoutRef<'button'>, keyof SidebarItemExtendedProps>

type SidebarItemLinkProps = SidebarItemExtendedProps & NavLinkProps

type SidebarItemDivProps = SidebarItemExtendedProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof SidebarItemExtendedProps> & {
    clickable?: boolean
  }

export type SidebarItemProps = SidebarItemButtonProps | SidebarItemLinkProps | SidebarItemDivProps

export interface SidebarItemComponent {
  (props: SidebarItemButtonProps): JSX.Element
  (props: SidebarItemLinkProps): JSX.Element
  (props: SidebarItemDivProps): JSX.Element
  displayName?: string
}

const itemIsIcon = (item: SidebarItemProps): item is SidebarItemIconProps => !!(item as SidebarItemIconProps).icon
const itemIsLogo = (item: SidebarItemProps): item is SidebarItemLogoProps => !!(item as SidebarItemLogoProps).logo
const itemIsAvatar = (item: SidebarItemProps): item is SidebarItemAvatarProps =>
  !!(item as SidebarItemAvatarProps).src || !!(item as SidebarItemAvatarProps).avatarFallback
const isSidebarItemLink = (item: SidebarItemProps): item is SidebarItemLinkProps =>
  'to' in item && (item as SidebarItemLinkProps).to !== undefined
const isBadgeProps = (props?: string | SidebarBadgeProps): props is SidebarBadgeProps =>
  typeof props === 'object' && props !== null && 'content' in props

type SidebarItemTriggerProps = SidebarItemProps & {
  submenuOpen?: boolean
  toggleSubmenu?: () => void
  /**
   * If false, the item will be rendered as a non-clickable div
   */
  clickable?: boolean
}

const SidebarItemTrigger = forwardRef<HTMLButtonElement | HTMLAnchorElement, SidebarItemTriggerProps>(
  ({ children, ...props }, ref) => {
    const { state } = useSidebar()
    const { NavLink } = useRouterContext()
    const withLogo = itemIsLogo(props)
    const withAvatar = itemIsAvatar(props)
    const isLink = isSidebarItemLink(props)

    const {
      title,
      description,
      actionMenuItems,
      dropdownMenuContent,
      badge,
      className,
      submenuOpen,
      toggleSubmenu,
      withRightIndicator,
      active,
      actionButtons,
      clickable = true,
      draggable,
      dragAttributes,
      dragListeners,
      ...restProps
    } = props

    const withIcon = itemIsIcon(props)
    const withSubmenu = !!children
    const withDescription = !!description
    const withActionMenu = state === 'expanded' && !!actionMenuItems && actionMenuItems.length > 0
    const withDropdownMenu = !!dropdownMenuContent
    // Pin/action buttons must not render while collapsed — they overlay the icon grid area
    // (see collapsedSidebarStyles) and would intercept clicks meant to navigate or expand.
    const withActionButtons = state === 'expanded' && !!actionButtons && actionButtons.length > 0
    const withRightElement = withActionMenu || withDropdownMenu || !!badge || withSubmenu || withRightIndicator
    const withDragHandle = !!draggable

    const badgeCommonProps: Pick<StatusBadgeProps, 'size' | 'theme' | 'className'> = {
      size: 'sm',
      theme: 'info',
      className: cn(
        'cn-sidebar-item-content-badge',
        { 'cn-sidebar-item-content-badge-secondary': withActionMenu },
        isBadgeProps(badge) && badge?.className
      )
    }

    const { onClick: originalOnClick } = restProps
    const itemProps = omit(restProps, ['icon', 'logo', 'avatarFallback', 'src', 'badgeProps', 'onClick'])
    const sidebarItemClassName = cn('cn-sidebar-item', className)
    const buttonRef = ref as Ref<HTMLButtonElement>
    const divRef = ref as Ref<HTMLDivElement>

    const actionButtonsContent = useMemo(() => {
      if (!withActionButtons) return null

      return (
        <Layout.Horizontal gap="none" className="cn-sidebar-item-content-action-buttons">
          {actionButtons?.map((buttonProps, index) => {
            const { title, iconOnly = true, iconName, iconProps, onClick: actionButtonOnClick, ...rest } = buttonProps
            return (
              <Button
                key={index}
                size="2xs"
                variant="ghost"
                iconOnly={iconOnly}
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  actionButtonOnClick(e)
                }}
                {...rest}
              >
                {iconName && <IconV2 name={iconName} {...iconProps} />}
                {title}
              </Button>
            )
          })}
        </Layout.Horizontal>
      )
    }, [actionButtons, withActionButtons])

    const renderContent = () => (
      <Layout.Grid
        className={cn('cn-sidebar-item-content', {
          'cn-sidebar-item-content-w-description': withDescription && !withRightElement,
          'cn-sidebar-item-content-w-r-element': withRightElement && !withDescription,
          'cn-sidebar-item-content-complete': withDescription && withRightElement,
          'cn-sidebar-item-content-only-action-buttons': withActionButtons && !withDescription && !withRightElement
        })}
      >
        {withIcon &&
          (withDescription ? (
            <div className="cn-sidebar-item-content-icon cn-sidebar-item-content-icon-w-border">
              <IconV2 name={props.icon} size="sm" fallback="stop" />
            </div>
          ) : (
            <IconV2 name={props.icon} size="sm" fallback="stop" className="cn-sidebar-item-content-icon" />
          ))}
        {withLogo && props.logo && (
          <LogoV2 name={props.logo} size={withDescription ? 'sm' : 'xs'} className="cn-sidebar-item-content-icon" />
        )}
        {withAvatar && (
          <Avatar
            src={props.src}
            name={props.avatarFallback}
            size={withDescription ? 'lg' : 'sm'}
            className="cn-sidebar-item-content-icon"
          />
        )}
        <Text
          variant="body-single-line-normal"
          color={withDescription ? 'foreground-1' : 'foreground-2'}
          className="cn-sidebar-item-content-title"
          truncate
        >
          {title}
        </Text>
        {withDescription && (
          <Text
            variant="caption-single-line-normal"
            color="foreground-3"
            className="cn-sidebar-item-content-description"
            truncate
          >
            {description}
          </Text>
        )}
        {withDropdownMenu && <IconV2 name="up-down" size="xs" className="cn-sidebar-item-content-right-element" />}
        {badge && !isBadgeProps(badge) && (
          <StatusBadge variant="outline" {...badgeCommonProps}>
            {badge}
          </StatusBadge>
        )}
        {badge && isBadgeProps(badge) && badge.variant === 'status' && (
          <StatusBadge
            variant="status"
            {...badgeCommonProps}
            {...omit(badge, ['content', 'variant', 'icon', 'className'])}
          >
            {badge.content}
          </StatusBadge>
        )}
        {badge && isBadgeProps(badge) && badge.variant !== 'status' && (
          <StatusBadge
            variant={badge.variant || 'outline'}
            {...badgeCommonProps}
            {...omit(badge, ['content', 'variant', 'pulse', 'className'])}
          >
            {badge.content}
          </StatusBadge>
        )}
        {/* Action buttons */}
        {actionButtonsContent}
        {withRightIndicator && (
          <IconV2 name="nav-arrow-right" className="cn-sidebar-item-content-right-element" size="xs" />
        )}
        {withSubmenu && (
          <IconV2
            name="nav-arrow-right"
            className="cn-sidebar-item-content-right-element"
            style={{
              transform: submenuOpen ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease-out'
            }}
            size="2xs"
          />
        )}
        {((withActionMenu && !badge) || withSubmenu || withRightIndicator) && (
          <div className="cn-sidebar-item-content-action-item-placeholder" />
        )}
      </Layout.Grid>
    )

    const handleMainItemClick = useCallback(
      (e: React.MouseEvent<HTMLElement>) => {
        if (withSubmenu && toggleSubmenu) {
          e.preventDefault()
          toggleSubmenu()
        }
        originalOnClick?.(e as React.MouseEvent<HTMLButtonElement>)
      },
      [withSubmenu, toggleSubmenu, originalOnClick]
    )

    return (
      <div
        className="cn-sidebar-item-wrapper"
        data-disabled={itemProps.disabled}
        data-active={active}
        data-clickable={clickable}
        data-draggable={withDragHandle}
      >
        {isLink && (
          <>
            {!itemProps.disabled && (
              <NavLink
                ref={ref as Ref<HTMLAnchorElement>}
                className={({ isActive }) => cn(sidebarItemClassName, { 'cn-sidebar-item-active': isActive })}
                {...(itemProps as SidebarItemLinkProps)}
                role="menuitem"
                onClick={handleMainItemClick as React.MouseEventHandler<HTMLAnchorElement>}
              >
                {withDragHandle && (
                  <div className="cn-sidebar-item-grip-handle" {...dragAttributes} {...dragListeners}>
                    <IconV2 name="grip-dots" size="2xs" className="cn-sidebar-item-grip-icon" />
                  </div>
                )}
                {renderContent()}
              </NavLink>
            )}
            {itemProps.disabled && (
              <div className={sidebarItemClassName} role="menuitem" aria-disabled={itemProps.disabled}>
                {withDragHandle && (
                  <div className="cn-sidebar-item-grip-handle" {...dragAttributes} {...dragListeners}>
                    <IconV2 name="grip-dots" size="2xs" className="cn-sidebar-item-grip-icon" />
                  </div>
                )}
                {renderContent()}
              </div>
            )}
          </>
        )}

        {withDropdownMenu && (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger
              ref={buttonRef}
              className={sidebarItemClassName}
              {...itemProps}
              role="menuitem"
              onClick={handleMainItemClick as React.MouseEventHandler<HTMLButtonElement>}
            >
              {withDragHandle && (
                <div className="cn-sidebar-item-grip-handle left-cn-1xs" {...dragAttributes} {...dragListeners}>
                  <IconV2 name="grip-dots" size="2xs" className="cn-sidebar-item-grip-icon" />
                </div>
              )}
              {renderContent()}
            </DropdownMenu.Trigger>
            <DropdownMenu.Content side="right" align="end" sideOffset={3}>
              {dropdownMenuContent}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        )}

        {!isLink &&
          !withDropdownMenu &&
          (clickable ? (
            <button
              ref={buttonRef}
              className={sidebarItemClassName}
              {...itemProps}
              role="menuitem"
              onClick={handleMainItemClick as React.MouseEventHandler<HTMLButtonElement>}
            >
              {withDragHandle && (
                <div className="cn-sidebar-item-grip-handle left-cn-1xs" {...dragAttributes} {...dragListeners}>
                  <IconV2 name="grip-dots" size="2xs" className="cn-sidebar-item-grip-icon" />
                </div>
              )}
              {renderContent()}
            </button>
          ) : (
            <div
              ref={divRef}
              className={cn(
                sidebarItemClassName,
                active ? 'cn-sidebar-item-trigger-active' : 'cn-sidebar-item-trigger'
              )}
              onMouseEnter={props.onHoverIn}
              onMouseLeave={props.onHoverIn}
              onClick={withSubmenu ? (handleMainItemClick as React.MouseEventHandler<HTMLDivElement>) : undefined}
              role={withSubmenu ? 'button' : undefined}
              tabIndex={withSubmenu ? 0 : undefined}
              onKeyDown={
                withSubmenu
                  ? (e: React.KeyboardEvent<HTMLDivElement>) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleMainItemClick(e as unknown as React.MouseEvent<HTMLDivElement>)
                      }
                    }
                  : undefined
              }
            >
              {withDragHandle && (
                <div className="cn-sidebar-item-grip-handle left-cn-1xs" {...dragAttributes} {...dragListeners}>
                  <IconV2 name="grip-dots" size="2xs" className="cn-sidebar-item-grip-icon" />
                </div>
              )}
              {renderContent()}
            </div>
          ))}

        {withActionMenu && (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger className="cn-sidebar-item-action-menu cn-sidebar-item-action-button">
              <IconV2 name="more-vert" size="xs" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content side="bottom" align="end" sideOffset={4}>
              {actionMenuItems?.map((item, index) => <DropdownMenu.Item key={index} {...item} />)}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        )}

        {active && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[12px] w-[2px] cn-sidebar-item-active-indicator" />
        )}
      </div>
    )
  }
)
SidebarItemTrigger.displayName = 'SidebarItemTrigger'

export const SidebarItem = forwardRef<HTMLButtonElement | HTMLAnchorElement, SidebarItemProps>(
  ({ subMenuOpen, defaultSubmenuOpen, onSubmenuChange, ...props }, ref) => {
    const { state, setOpen: setSidebarOpen } = useSidebar()

    const collapsedSubmenuActive = state === 'collapsed' && !!props.children && hasActiveSubmenuChild(props.children)

    const itemProps = { ...props, active: props.active || collapsedSubmenuActive }

    // Is the component externally controlled?
    const isControlled = subMenuOpen !== undefined

    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultSubmenuOpen ?? false)

    const effectiveOpen = isControlled ? subMenuOpen! : uncontrolledOpen

    const setOpen = useCallback(
      (next: boolean) => {
        if (isControlled) {
          onSubmenuChange?.(next)
        } else {
          setUncontrolledOpen(next)
        }
      },
      [isControlled, onSubmenuChange]
    )

    // When clicked while collapsed, expand first; open submenu after sidebar state flips to expanded.
    const pendingSubmenuOpenRef = useRef(false)

    const toggleSubmenu = useCallback(() => {
      if (state === 'collapsed') {
        pendingSubmenuOpenRef.current = true
        setSidebarOpen(true)
        return
      }
      setOpen(!effectiveOpen)
    }, [state, setSidebarOpen, setOpen, effectiveOpen])

    // Close automatically if sidebar collapses; apply pending open after expand.
    useEffect(() => {
      if (state === 'collapsed') {
        if (effectiveOpen) {
          setOpen(false)
        }
        return
      }

      if (pendingSubmenuOpenRef.current) {
        pendingSubmenuOpenRef.current = false
        setOpen(true)
      }
    }, [state, effectiveOpen, setOpen])

    // Wrap trigger with tooltip logic
    const WrappedItemTrigger = () => {
      const trigger = (
        <SidebarItemTrigger ref={ref} {...itemProps} toggleSubmenu={toggleSubmenu} submenuOpen={effectiveOpen} />
      )

      // Show title tooltip when collapsed
      if (state === 'collapsed') {
        return (
          <Tooltip side="right" align="center" content={itemProps.title}>
            {trigger}
          </Tooltip>
        )
      }

      return trigger
    }

    const withSubmenu = !!itemProps.children

    if (withSubmenu) {
      const filteredChildren = filterChildrenByDisplayNames(itemProps.children, [SUBMENU_ITEM_DISPLAY_NAME])

      return (
        <div className="contents">
          <WrappedItemTrigger />
          <SidebarSubmenuGroup open={effectiveOpen}>{filteredChildren}</SidebarSubmenuGroup>
        </div>
      )
    }

    return <WrappedItemTrigger />
  }
) as SidebarItemComponent
SidebarItem.displayName = 'SidebarItem'

interface SidebarMenuSubItemBaseProps {
  title: string
  active?: boolean
  className?: string
}

interface SidebarMenuSubItemLinkProps
  extends SidebarMenuSubItemBaseProps,
    Omit<NavLinkProps, 'title' | 'className' | 'children'> {
  children?: never
  defaultOpen?: never
  open?: never
  onOpenChange?: never
}

/**
 * Renders as a collapsible group (no link) that contains further `Sidebar.MenuSubItem`s.
 * Nesting is supported up to a third level: Item > MenuSubItem > MenuSubItem.
 * Remaining props (`id`, `data-*`, `aria-*`, ...) are applied to the group's trigger button.
 */
interface SidebarMenuSubItemGroupProps
  extends SidebarMenuSubItemBaseProps,
    Omit<ComponentPropsWithoutRef<'button'>, keyof SidebarMenuSubItemBaseProps | 'children' | 'type' | 'role'> {
  children: ReactNode
  /**
   * Initial state when uncontrolled. Defaults to open if a descendant is active.
   */
  defaultOpen?: boolean
  /**
   * Controlled open state. When set, the parent owns the state and must update it in `onOpenChange`.
   */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  to?: never
}

export type SidebarMenuSubItemProps = SidebarMenuSubItemLinkProps | SidebarMenuSubItemGroupProps

const getSubItems = (children: ReactNode) => filterChildrenByDisplayNames(children, [SUBMENU_ITEM_DISPLAY_NAME])

// Only a real group if it has at least one nested sub-item (e.g. not `[]` after visibility filtering)
const isSubItemGroup = (props: SidebarMenuSubItemProps): props is SidebarMenuSubItemGroupProps =>
  getSubItems(props.children).length > 0

const SidebarMenuSubItemGroup = forwardRef<HTMLButtonElement, SidebarMenuSubItemGroupProps>(
  (
    { title, className, active, children, defaultOpen, open: controlledOpen, onOpenChange, onClick, ...buttonProps },
    ref
  ) => {
    const nestedItems = getSubItems(children)
    const hasActiveDescendant = hasActiveSubmenuChild(nestedItems)
    const isControlled = controlledOpen !== undefined
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? hasActiveDescendant)
    const open = isControlled ? controlledOpen : uncontrolledOpen
    const [panelId] = useState(() => uniqueId('cn-sidebar-submenu-group-'))

    const setOpen = useCallback(
      (next: boolean) => {
        if (!isControlled) setUncontrolledOpen(next)
        onOpenChange?.(next)
      },
      [isControlled, onOpenChange]
    )

    // Reveal the active descendant when it becomes active after mount (e.g. route change).
    // Only reacts to the false -> true transition, so a user can still close a group containing the active item.
    const wasActiveRef = useRef(hasActiveDescendant)
    useEffect(() => {
      if (hasActiveDescendant && !wasActiveRef.current) setOpen(true)
      wasActiveRef.current = hasActiveDescendant
    }, [hasActiveDescendant, setOpen])

    const showActiveIndicator = (active || hasActiveDescendant) && !open

    return (
      <div className="contents">
        <Layout.Flex>
          {showActiveIndicator && (
            <div className="relative left-cn-4xs top-[10px] h-3 w-0.5 cn-sidebar-submenu-item-active-indicator" />
          )}
          <button
            {...buttonProps}
            ref={ref}
            type="button"
            className={cn('w-full cn-sidebar-submenu-item cn-sidebar-submenu-item-group-trigger', className)}
            role="menuitem"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={e => {
              onClick?.(e)
              setOpen(!open)
            }}
          >
            <Text
              className="cn-sidebar-submenu-item-content"
              variant="body-single-line-normal"
              color="foreground-2"
              truncate
            >
              {title}
            </Text>
            <IconV2
              name="nav-arrow-right"
              size="2xs"
              className="cn-sidebar-submenu-item-group-chevron"
              style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
            />
          </button>
        </Layout.Flex>
        <SidebarSubmenuGroup id={panelId} open={open} nested>
          {nestedItems}
        </SidebarSubmenuGroup>
      </div>
    )
  }
)
SidebarMenuSubItemGroup.displayName = 'SidebarMenuSubItemGroup'

export const SidebarMenuSubItem = forwardRef<HTMLAnchorElement | HTMLButtonElement, SidebarMenuSubItemProps>(
  (props, ref) => {
    const { NavLink } = useRouterContext()

    if (isSubItemGroup(props)) {
      return <SidebarMenuSubItemGroup {...props} ref={ref as Ref<HTMLButtonElement>} />
    }

    const { title, className, active = false, ...rest } = props
    // A group whose children were all filtered out: drop the group-only props and, with no `to`, render nothing.
    const linkProps = omit(rest, ['children', 'defaultOpen', 'open', 'onOpenChange']) as Omit<typeof rest, 'children'>
    if (!linkProps.to) return null

    return (
      <Layout.Flex>
        {active && (
          <div className="relative left-cn-4xs top-[10px] h-3 w-0.5 cn-sidebar-submenu-item-active-indicator" />
        )}
        <NavLink
          className={cn('w-full cn-sidebar-submenu-item', className)}
          role="menuitem"
          {...linkProps}
          ref={ref as Ref<HTMLAnchorElement>}
        >
          <Text
            className="cn-sidebar-submenu-item-content"
            variant="body-single-line-normal"
            color="foreground-2"
            truncate
          >
            {title}
          </Text>
        </NavLink>
      </Layout.Flex>
    )
  }
)
SidebarMenuSubItem.displayName = SUBMENU_ITEM_DISPLAY_NAME
