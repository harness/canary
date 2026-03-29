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

import { useSidebar } from './sidebar-context'

// ─── Types ───────────────────────────────────────────────────────────────────

const SUBMENU_ITEM_V2_DISPLAY_NAME = 'SidebarMenuSubItemV2'

interface SidebarBadgeV2Props extends Omit<StatusBadgeProps, 'children' | 'size' | 'content'> {
  content?: ReactNode
}

type ActionButtonProps = ButtonProps & {
  title?: string
  iconName?: IconV2NamesType
  iconProps?: Omit<IconPropsV2, 'ref' | 'name' | 'fallback'>
  onClick: React.MouseEventHandler<HTMLButtonElement>
}

export interface SidebarItemV2Props {
  title: string
  description?: string
  tooltip?: ReactNode
  active?: boolean
  disabled?: boolean
  className?: string

  icon?: IconPropsV2['name']
  logo?: LogoPropsV2['name']
  avatarFallback?: AvatarProps['name']
  src?: AvatarProps['src']

  badge?: string | SidebarBadgeV2Props
  withRightIndicator?: boolean

  actionButtons?: ActionButtonProps[]
  actionMenuItems?: DropdownMenuItemProps[]

  children?: ReactNode
  defaultSubmenuOpen?: boolean
  subMenuOpen?: boolean
  onSubmenuChange?: (open: boolean) => void

  dropdownMenuContent?: ReactNode

  draggable?: boolean
  dragAttributes?: React.HTMLAttributes<HTMLElement>
  dragListeners?: SyntheticListenerMap

  clickable?: boolean
  onHoverIn?: (e: React.MouseEvent<HTMLElement>) => void
  onHoverOut?: (e: React.MouseEvent<HTMLElement>) => void

  to?: string
  end?: boolean
  onClick?: React.MouseEventHandler<HTMLElement>
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const isBadgeObject = (b?: string | SidebarBadgeV2Props): b is SidebarBadgeV2Props =>
  typeof b === 'object' && b !== null && 'content' in b

// ─── Content ─────────────────────────────────────────────────────────────────

interface ContentProps {
  title: string
  description?: string
  icon?: IconPropsV2['name']
  logo?: LogoPropsV2['name']
  avatarFallback?: AvatarProps['name']
  src?: AvatarProps['src']
  badge?: string | SidebarBadgeV2Props
  withRightIndicator?: boolean
  withSubmenu?: boolean
  submenuOpen?: boolean
  withDropdown?: boolean
  actionButtons?: ActionButtonProps[]
}

function SidebarItemContentV2({
  title,
  description,
  icon,
  logo,
  avatarFallback,
  src,
  badge,
  withRightIndicator,
  withSubmenu,
  submenuOpen,
  withDropdown,
  actionButtons
}: ContentProps) {
  const hasDesc = !!description
  const hasAvatar = !!src || !!avatarFallback

  const actionButtonsEl = useMemo(() => {
    if (!actionButtons?.length) return null
    return (
      <div className="cn-sidebar-item-v2-actions">
        {actionButtons.map(({ title: btnTitle, iconOnly = true, iconName, iconProps, onClick, ...rest }, i) => (
          <Button
            key={i}
            size="2xs"
            variant="ghost"
            iconOnly={iconOnly}
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              onClick(e)
            }}
            {...rest}
          >
            {iconName && <IconV2 name={iconName} {...iconProps} />}
            {btnTitle}
          </Button>
        ))}
      </div>
    )
  }, [actionButtons])

  return (
    <div className={cn('cn-sidebar-item-v2-content', { 'cn-sidebar-item-v2-content-w-desc': hasDesc })}>
      {icon &&
        (hasDesc ? (
          <div className="cn-sidebar-item-v2-leading cn-sidebar-item-v2-leading-bordered">
            <IconV2 name={icon} size="sm" fallback="stop" />
          </div>
        ) : (
          <IconV2 name={icon} size="sm" fallback="stop" className="cn-sidebar-item-v2-leading" />
        ))}

      {logo && <LogoV2 name={logo} size={hasDesc ? 'sm' : 'xs'} className="cn-sidebar-item-v2-leading" />}

      {hasAvatar && (
        <Avatar src={src} name={avatarFallback} size={hasDesc ? 'lg' : 'sm'} className="cn-sidebar-item-v2-leading" />
      )}

      <div className="cn-sidebar-item-v2-center">
        <Text
          variant="body-single-line-normal"
          color={hasDesc ? 'foreground-1' : 'foreground-2'}
          className="cn-sidebar-item-v2-title"
          truncate
        >
          {title}
        </Text>
        {hasDesc && (
          <Text variant="caption-single-line-light" color="foreground-3" className="cn-sidebar-item-v2-desc" truncate>
            {description}
          </Text>
        )}
      </div>

      {withDropdown && <IconV2 name="up-down" size="xs" className="cn-sidebar-item-v2-trailing" />}

      {badge && !isBadgeObject(badge) && (
        <StatusBadge variant="outline" size="sm" theme="info" className="cn-sidebar-item-v2-badge">
          {badge}
        </StatusBadge>
      )}
      {badge && isBadgeObject(badge) && (
        <StatusBadge
          variant={badge.variant || 'outline'}
          size="sm"
          theme="info"
          className={cn('cn-sidebar-item-v2-badge', badge.className)}
        >
          {badge.content}
        </StatusBadge>
      )}

      {actionButtonsEl}

      {withRightIndicator && <IconV2 name="nav-arrow-right" size="xs" className="cn-sidebar-item-v2-trailing" />}

      {withSubmenu && (
        <IconV2
          name={submenuOpen ? 'nav-arrow-down' : 'nav-arrow-right'}
          size="2xs"
          className="cn-sidebar-item-v2-trailing"
        />
      )}
    </div>
  )
}

// ─── SidebarItemV2 ───────────────────────────────────────────────────────────

export const SidebarItemV2 = forwardRef<HTMLElement, SidebarItemV2Props>(
  (
    {
      title,
      description,
      tooltip,
      active = false,
      disabled = false,
      className,
      icon,
      logo,
      avatarFallback,
      src,
      badge,
      withRightIndicator,
      actionButtons,
      actionMenuItems,
      children,
      defaultSubmenuOpen,
      subMenuOpen,
      onSubmenuChange,
      dropdownMenuContent,
      draggable,
      dragAttributes,
      dragListeners,
      clickable = true,
      onHoverIn,
      onHoverOut,
      to,
      end,
      onClick
    },
    ref
  ) => {
    const { state } = useSidebar()
    const { NavLink } = useRouterContext()

    // ── Submenu state ──
    const isControlled = subMenuOpen !== undefined
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultSubmenuOpen ?? false)
    const effectiveOpen = isControlled ? subMenuOpen! : uncontrolledOpen

    const setOpen = useCallback(
      (next: boolean) => {
        if (isControlled) onSubmenuChange?.(next)
        else setUncontrolledOpen(next)
      },
      [isControlled, onSubmenuChange]
    )

    const toggleSubmenu = useCallback(() => setOpen(!effectiveOpen), [setOpen, effectiveOpen])

    useEffect(() => {
      if (state === 'collapsed' && effectiveOpen) setOpen(false)
    }, [state, effectiveOpen, setOpen])

    // ── Computed ──
    const withSubmenu = !!children
    const withActionMenu = state === 'expanded' && !!actionMenuItems?.length
    const isLink = !!to
    const isDropdown = !!dropdownMenuContent

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLElement>) => {
        if (withSubmenu) {
          e.preventDefault()
          toggleSubmenu()
        }
        onClick?.(e)
      },
      [withSubmenu, toggleSubmenu, onClick]
    )

    // ── Shared pieces ──

    const content = (
      <SidebarItemContentV2
        title={title}
        description={description}
        icon={icon}
        logo={logo}
        avatarFallback={avatarFallback}
        src={src}
        badge={badge}
        withRightIndicator={withRightIndicator}
        withSubmenu={withSubmenu}
        submenuOpen={effectiveOpen}
        withDropdown={isDropdown}
        actionButtons={actionButtons}
      />
    )

    const grip = draggable ? (
      <div className="cn-sidebar-item-v2-grip" {...dragAttributes} {...dragListeners}>
        <IconV2 name="grip-dots" size="2xs" className="cn-sidebar-item-v2-grip-icon" />
      </div>
    ) : null

    const actionMenu = withActionMenu ? (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className="cn-sidebar-item-v2-action-menu">
          <IconV2 name="more-vert" size="xs" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content side="bottom" align="end" sideOffset={4}>
          {actionMenuItems?.map((item, i) => <DropdownMenu.Item key={i} {...item} />)}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    ) : null

    const itemClass = cn('cn-sidebar-item-v2', className)

    // ── Trigger element ──

    let trigger: ReactNode

    if (isLink && !disabled) {
      trigger = (
        <NavLink
          ref={ref as Ref<HTMLAnchorElement>}
          className={({ isActive }: { isActive: boolean }) =>
            cn(itemClass, isActive && 'cn-sidebar-item-v2-route-active')
          }
          to={to!}
          end={end}
          role="menuitem"
          onClick={handleClick as React.MouseEventHandler<HTMLAnchorElement>}
        >
          {grip}
          {content}
        </NavLink>
      )
    } else if (isDropdown) {
      trigger = (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger
            ref={ref as Ref<HTMLButtonElement>}
            className={itemClass}
            role="menuitem"
            onClick={handleClick as React.MouseEventHandler<HTMLButtonElement>}
          >
            {grip}
            {content}
          </DropdownMenu.Trigger>
          <DropdownMenu.Content side="right" align="end" sideOffset={3}>
            {dropdownMenuContent}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )
    } else if (clickable) {
      trigger = (
        <button
          ref={ref as Ref<HTMLButtonElement>}
          className={itemClass}
          role="menuitem"
          disabled={disabled}
          onClick={handleClick as React.MouseEventHandler<HTMLButtonElement>}
        >
          {grip}
          {content}
        </button>
      )
    } else {
      trigger = (
        <div
          ref={ref as Ref<HTMLDivElement>}
          className={itemClass}
          onMouseEnter={onHoverIn}
          onMouseLeave={onHoverOut}
          onClick={withSubmenu ? (handleClick as React.MouseEventHandler<HTMLDivElement>) : undefined}
          role={withSubmenu ? 'button' : undefined}
          tabIndex={withSubmenu ? 0 : undefined}
          onKeyDown={
            withSubmenu
              ? (e: React.KeyboardEvent) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleClick(e as unknown as React.MouseEvent<HTMLElement>)
                  }
                }
              : undefined
          }
        >
          {grip}
          {content}
        </div>
      )
    }

    // ── Wrapper ──

    const wrapper = (
      <div
        className="cn-sidebar-item-v2-wrapper"
        data-active={active}
        data-disabled={disabled}
        data-draggable={!!draggable}
      >
        {trigger}
        {actionMenu}
      </div>
    )

    // ── Tooltip ──

    let result: ReactNode

    if (tooltip) {
      result = (
        <Tooltip side="right" align="center" content={tooltip}>
          {wrapper}
        </Tooltip>
      )
    } else if (state === 'collapsed') {
      result = (
        <Tooltip side="right" align="center" content={title}>
          {wrapper}
        </Tooltip>
      )
    } else {
      result = wrapper
    }

    // ── Submenu ──

    if (withSubmenu) {
      const filteredChildren = effectiveOpen
        ? filterChildrenByDisplayNames(children, [SUBMENU_ITEM_V2_DISPLAY_NAME])
        : []
      const rowsCount = filteredChildren.length + 1

      return (
        <div className="contents">
          {result}
          <div
            className="cn-sidebar-submenu-group"
            role="group"
            data-state={effectiveOpen ? 'open' : 'closed'}
            style={effectiveOpen ? { maxHeight: `${rowsCount * 40}px` } : { maxHeight: '0px', padding: '0' }}
          >
            {filteredChildren}
          </div>
        </div>
      )
    }

    return <>{result}</>
  }
)
SidebarItemV2.displayName = 'SidebarItemV2'

// ─── SidebarMenuSubItemV2 ───────────────────────────────────────────────────

export const SidebarMenuSubItemV2 = forwardRef<
  HTMLAnchorElement,
  ComponentPropsWithoutRef<'a'> & NavLinkProps & { title: string; active?: boolean }
>(({ title, className, active = false, ...props }, ref) => {
  const { NavLink } = useRouterContext()

  return (
    <div className="cn-sidebar-item-v2-submenu-row">
      {active && <div className="cn-sidebar-item-v2-submenu-indicator" />}
      <NavLink className={cn('cn-sidebar-submenu-item', className)} role="menuitem" {...props} ref={ref}>
        <Text className="cn-sidebar-submenu-item-content" variant="body-single-line-normal" color="foreground-2" truncate>
          {title}
        </Text>
      </NavLink>
    </div>
  )
})
SidebarMenuSubItemV2.displayName = SUBMENU_ITEM_V2_DISPLAY_NAME
