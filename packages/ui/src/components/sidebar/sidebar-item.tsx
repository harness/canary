import { ComponentPropsWithoutRef, forwardRef, ReactNode, Ref, useCallback, useEffect, useMemo, useState } from 'react'

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
  Separator,
  StatusBadge,
  StatusBadgeProps,
  Text,
  Tooltip,
  type ButtonProps
} from '@/components'
import { NavLinkProps, useRouterContext } from '@/context'
import { filterChildrenByDisplayNames } from '@/utils'
import { cn } from '@utils/cn'
import omit from 'lodash-es/omit'

import { useSidebar } from './sidebar-context'

const SUBMENU_ITEM_DISPLAY_NAME = 'SidebarMenuSubItem'

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
  tooltip?: ReactNode
  active?: boolean
  actionButtons?: SidebarItemActionButtonPropsType[]
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
      ...restProps
    } = props

    const withIcon = itemIsIcon(props)
    const withSubmenu = !!children
    const withDescription = !!description
    const withActionMenu = state === 'expanded' && !!actionMenuItems && actionMenuItems.length > 0
    const withDropdownMenu = !!dropdownMenuContent
    const withActionButtons = !!actionButtons
    const withRightElement = withActionMenu || withDropdownMenu || !!badge || withSubmenu || withRightIndicator

    const badgeCommonProps: Pick<StatusBadgeProps, 'size' | 'theme' | 'className'> = {
      size: 'sm',
      theme: 'info',
      className: cn(
        'cn-sidebar-item-content-badge',
        { 'cn-sidebar-item-content-badge-secondary': withActionMenu },
        isBadgeProps(badge) && badge?.className
      )
    }

    const itemProps = omit(restProps, ['icon', 'logo', 'avatarFallback', 'src', 'badgeProps'])
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
                size="xs"
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
    }, [actionButtons])

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
              <IconV2 name={props.icon} size="md" fallback="stop" />
            </div>
          ) : (
            <IconV2 name={props.icon} size="md" fallback="stop" className="cn-sidebar-item-content-icon" />
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
          wrap="wrap"
        >
          {title}
        </Text>
        {withDescription && (
          <Text
            variant="caption-single-line-light"
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
        {((withActionMenu && !badge) || withSubmenu) && (
          <div className="cn-sidebar-item-content-action-item-placeholder" />
        )}
      </Layout.Grid>
    )

    return (
      <div
        className="cn-sidebar-item-wrapper"
        data-disabled={itemProps.disabled}
        data-active={active}
        data-clickable={clickable}
      >
        {isLink && (
          <>
            {!itemProps.disabled && (
              <NavLink
                ref={ref as Ref<HTMLAnchorElement>}
                className={({ isActive }) => cn(sidebarItemClassName, { 'cn-sidebar-item-active': isActive })}
                {...(itemProps as SidebarItemLinkProps)}
                role="menuitem"
              >
                {renderContent()}
              </NavLink>
            )}
            {itemProps.disabled && (
              <div className={sidebarItemClassName} role="menuitem" aria-disabled={itemProps.disabled}>
                {renderContent()}
              </div>
            )}
          </>
        )}

        {withDropdownMenu && (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger ref={buttonRef} className={sidebarItemClassName} {...itemProps} role="menuitem">
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
            <button ref={buttonRef} className={sidebarItemClassName} {...itemProps} role="menuitem">
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
            >
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

        {withSubmenu && (
          <button className="cn-sidebar-item-action-button" onClick={toggleSubmenu}>
            <IconV2 name={submenuOpen ? 'nav-arrow-down' : 'nav-arrow-right'} size="xs" />
          </button>
        )}

        <div className="absolute top-cn-sm h-3 w-0.5 cn-sidebar-item-active-indicator" />
      </div>
    )
  }
)
SidebarItemTrigger.displayName = 'SidebarItemTrigger'

export const SidebarItem = forwardRef<HTMLButtonElement | HTMLAnchorElement, SidebarItemProps>(({ ...props }, ref) => {
  const { state } = useSidebar()
  const [submenuOpen, setSubmenuOpen] = useState(props.defaultSubmenuOpen || false)

  const { title, tooltip } = props

  const withSubmenu = !!props.children

  const toggleSubmenu = useCallback(() => setSubmenuOpen(prev => !prev), [])

  useEffect(() => {
    if (state === 'collapsed' && submenuOpen) {
      setSubmenuOpen(false)
    }
  }, [state, submenuOpen])

  const WrappedItemTrigger = () => {
    if (tooltip) {
      return (
        <Tooltip side="right" align="center" content={tooltip}>
          <SidebarItemTrigger ref={ref} {...props} toggleSubmenu={toggleSubmenu} submenuOpen={submenuOpen} />
        </Tooltip>
      )
    }

    if (state === 'collapsed') {
      return (
        <Tooltip side="right" align="center" content={title}>
          <SidebarItemTrigger ref={ref} {...props} toggleSubmenu={toggleSubmenu} submenuOpen={submenuOpen} />
        </Tooltip>
      )
    }

    return <SidebarItemTrigger ref={ref} {...props} toggleSubmenu={toggleSubmenu} submenuOpen={submenuOpen} />
  }

  if (withSubmenu) {
    const filteredChildren = submenuOpen
      ? filterChildrenByDisplayNames(props.children, [SUBMENU_ITEM_DISPLAY_NAME])
      : []
    const rowsCount = filteredChildren.length + 1

    return (
      <div className="contents">
        <WrappedItemTrigger />
        <Layout.Grid
          className="cn-sidebar-submenu-group"
          role="group"
          columns="auto 1fr"
          data-state={submenuOpen ? 'open' : 'closed'}
          style={{ ...(submenuOpen ? { maxHeight: `${rowsCount * 40}px` } : { maxHeight: '0px', padding: 0 }) }}
        >
          <Separator orientation="vertical" style={{ gridRow: `1 / ${rowsCount}` }} />
          {filteredChildren}
        </Layout.Grid>
      </div>
    )
  }

  return <WrappedItemTrigger />
}) as SidebarItemComponent
SidebarItem.displayName = 'SidebarItem'

export const SidebarMenuSubItem = forwardRef<
  HTMLAnchorElement,
  Pick<NavLinkProps, 'to' | 'className'> & { title: string; active?: boolean }
>(({ title, className, active = false, ...props }, ref) => {
  const { NavLink } = useRouterContext()

  return (
    <Layout.Flex>
      {active && <div className="relative left-cn-4xs top-[10px] h-3 w-0.5 cn-sidebar-submenu-item-active-indicator" />}
      <NavLink className={cn('w-full cn-sidebar-submenu-item', className)} role="menuitem" {...props} ref={ref}>
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
})
SidebarMenuSubItem.displayName = SUBMENU_ITEM_DISPLAY_NAME
