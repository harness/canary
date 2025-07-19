import { ComponentPropsWithoutRef, forwardRef, ReactNode, Ref, useCallback, useEffect, useState } from 'react'

import {
  Avatar,
  AvatarProps,
  DropdownMenu,
  DropdownMenuItemProps,
  IconNameMapV2,
  IconPropsV2,
  IconV2,
  Layout,
  LogoPropsV2,
  LogoV2,
  Separator,
  StatusBadge,
  StatusBadgeProps,
  Text,
  Tooltip
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

interface SidebarItemCommonProps extends ComponentPropsWithoutRef<'button'> {
  title: string
  description?: string
  tooltip?: ReactNode
  active?: boolean
}

interface SidebarItemWithChildrenProps extends SidebarItemCommonProps {
  children: ReactNode
  badge?: never
  actionMenuItems?: never
  dropdownMenuContent?: never
  withRightIndicator?: never
}

interface SidebarItemWithDropdownProps extends SidebarItemCommonProps {
  dropdownMenuContent: ReactNode
  children?: never
  badge?: never
  actionMenuItems?: never
  withRightIndicator?: never
}

interface SidebarItemWithIndicatorProps extends SidebarItemCommonProps {
  withRightIndicator: true
  children?: never
  badge?: never
  actionMenuItems?: never
  dropdownMenuContent?: never
}

interface SidebarItemWithBadgeProps extends SidebarItemCommonProps {
  badge?: string | SidebarBadgeProps
  actionMenuItems?: never
  children?: never
  dropdownMenuContent?: never
  withRightIndicator?: never
}
interface SidebarItemWithAndActionsProps extends SidebarItemCommonProps {
  badge?: never
  actionMenuItems?: DropdownMenuItemProps[]
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

type SidebarItemExtendedProps = SidebarItemIconProps | SidebarItemLogoProps | SidebarItemAvatarProps

type SidebarItemButtonProps = SidebarItemExtendedProps &
  Omit<ComponentPropsWithoutRef<'button'>, keyof SidebarItemExtendedProps>

type SidebarItemLinkProps = SidebarItemExtendedProps & NavLinkProps

export type SidebarItemProps = SidebarItemButtonProps | SidebarItemLinkProps

export interface SidebarItemComponent {
  (props: SidebarItemButtonProps): JSX.Element
  (props: SidebarItemLinkProps): JSX.Element
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
}

const SidebarItemTrigger = forwardRef<HTMLButtonElement | HTMLAnchorElement, SidebarItemTriggerProps>(
  ({ children, ...props }, ref) => {
    const { state } = useSidebar()
    const { NavLink } = useRouterContext()
    const withIcon = itemIsIcon(props)
    const withLogo = itemIsLogo(props)
    const withAvatar = itemIsAvatar(props)
    const withFallback = !withIcon && !withLogo && !withAvatar
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
      ...restProps
    } = props

    const withSubmenu = !!children
    const withDescription = !!description
    const withActionMenu = state === 'expanded' && !!actionMenuItems && actionMenuItems.length > 0
    const withDropdownMenu = !!dropdownMenuContent
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
    const sidebarItemClassName = cn('cn-sidebar-item', { 'cn-sidebar-item-big': withDescription }, className)
    const buttonRef = ref as Ref<HTMLButtonElement>
    const iconName: IconPropsV2['name'] =
      withIcon && IconNameMapV2[props.icon ?? 'stop'] ? (props.icon as IconPropsV2['name']) : 'stop'

    const renderContent = () => (
      <Layout.Grid
        className={cn('cn-sidebar-item-content', {
          'cn-sidebar-item-content-w-description': withDescription,
          'cn-sidebar-item-content-w-r-element': withRightElement,
          'cn-sidebar-item-content-complete': withDescription && withRightElement
        })}
      >
        {(withIcon || withFallback) && (
          <>
            {withDescription && (
              <div className="cn-sidebar-item-content-icon cn-sidebar-item-content-icon-w-border">
                {withIcon && <IconV2 name={iconName} size="md" />}
                {withFallback && <IconV2 name="stop" size="md" />}
              </div>
            )}
            {!withDescription && (
              <>
                {withIcon && <IconV2 name={iconName} size="sm" className="cn-sidebar-item-content-icon" />}
                {withFallback && <IconV2 name="stop" size="sm" className="cn-sidebar-item-content-icon" />}
              </>
            )}
          </>
        )}
        {withLogo && props.logo && (
          <LogoV2 name={props.logo} size={withDescription ? 'md' : 'sm'} className="cn-sidebar-item-content-icon" />
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
          variant="body-single-line-strong"
          color={withDescription ? 'foreground-1' : 'foreground-2'}
          className="cn-sidebar-item-content-title"
          truncate
        >
          {title}
        </Text>

        {withDescription && (
          <Text
            variant="caption-single-line-soft"
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

        {withRightIndicator && <IconV2 name="nav-arrow-right" className="cn-sidebar-item-content-right-element" />}

        {((withActionMenu && !badge) || withSubmenu) && (
          <div className="cn-sidebar-item-content-action-item-placeholder" />
        )}
      </Layout.Grid>
    )

    return (
      <div className="cn-sidebar-item-wrapper" data-disabled={itemProps.disabled} data-active={active}>
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

        {!isLink && !withDropdownMenu && (
          <button ref={buttonRef} className={sidebarItemClassName} {...itemProps} role="menuitem">
            {renderContent()}
          </button>
        )}

        {withActionMenu && (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger className="cn-sidebar-item-action-button cn-sidebar-item-action-menu">
              <IconV2 name="more-vert" size="xs" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content side="bottom" align="end" sideOffset={4}>
              {actionMenuItems?.map((item, index) => <DropdownMenu.Item key={index} {...item} />)}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        )}

        {withSubmenu && (
          <button className="cn-sidebar-item-action-button" onClick={toggleSubmenu}>
            <IconV2 name={submenuOpen ? 'minus' : 'plus'} size="xs" />
          </button>
        )}
      </div>
    )
  }
)
SidebarItemTrigger.displayName = 'SidebarItemTrigger'

export const SidebarItem = forwardRef<HTMLButtonElement | HTMLAnchorElement, SidebarItemProps>(({ ...props }, ref) => {
  const { state } = useSidebar()
  const [submenuOpen, setSubmenuOpen] = useState(false)

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

export const SidebarMenuSubItem = ({ title, className, ...props }: NavLinkProps & { title: string }) => {
  const { NavLink } = useRouterContext()

  return (
    <NavLink
      className={({ isActive }) =>
        cn('cn-sidebar-submenu-item', { 'cn-sidebar-submenu-item-active': isActive }, className)
      }
      role="menuitem"
      {...props}
    >
      <Text className="cn-sidebar-submenu-item-content" variant="body-single-line-normal" color="foreground-2" truncate>
        {title}
      </Text>
    </NavLink>
  )
}
SidebarMenuSubItem.displayName = SUBMENU_ITEM_DISPLAY_NAME
