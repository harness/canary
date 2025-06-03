import { DropdownMenu, IconV2, IconPropsV2, Sidebar, useSidebar } from '@/components'
import { useRouterContext, useTranslation } from '@/context'

interface NavbarItemType {
  id: number | string
  title: string
  iconName?: IconPropsV2['name']
  description?: string
  to: string
  permanentlyPinned?: boolean
}

interface NavbarItemProps {
  item: NavbarItemType
  isRecent?: boolean
  handleChangePinnedMenuItem: (item: NavbarItemType, pin: boolean) => void
  handleRemoveRecentMenuItem: (item: NavbarItemType) => void
  handleCustomNav: () => void
}

export const SidebarItem = ({
  item,
  isRecent = false,
  handleChangePinnedMenuItem,
  handleRemoveRecentMenuItem,
  handleCustomNav
}: NavbarItemProps) => {
  const { t } = useTranslation()
  const { NavLink } = useRouterContext()
  const { collapsed } = useSidebar()

  // TODO: Design System: Update it once gradient icons are available in IconV2
  const iconName = item.iconName && (item.iconName.replace('-gradient', '') as IconPropsV2['name'])

  const handlePin = () => {
    handleChangePinnedMenuItem(item, isRecent)
  }

  const handleRemoveRecent = () => {
    handleRemoveRecentMenuItem(item)
  }

  const dropdownItems = isRecent ? (
    <>
      <DropdownMenu.Item onSelect={handlePin} title={t('component:navbar.pin', 'Pin')} />
      <DropdownMenu.Item onSelect={handleRemoveRecent} title={t('component:navbar.remove', 'Remove')} />
    </>
  ) : (
    <>
      <DropdownMenu.Item onSelect={handleCustomNav} title={t('component:navbar.reorder', 'Reorder')} />
      {!item.permanentlyPinned && (
        <DropdownMenu.Item onSelect={handlePin} title={t('component:navbar.unpin', 'Unpin')} />
      )}
    </>
  )

  return (
    <Sidebar.MenuItem>
      <NavLink className="block" to={item.to || ''} end>
        {({ isActive }) => (
          <Sidebar.MenuButton asChild isActive={isActive}>
            <Sidebar.MenuItemText
              text={item.title}
              icon={iconName && <IconV2 name={iconName} size={14} />}
              active={isActive}
            />
          </Sidebar.MenuButton>
        )}
      </NavLink>

      {!collapsed && (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Sidebar.MenuAction className="right-[3px] text-sidebar-icon-3 hover:text-sidebar-icon-1" showOnHover>
              <IconV2 name="more-vert" size={12} />
            </Sidebar.MenuAction>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end" sideOffset={3} alignOffset={4}>
            {dropdownItems}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )}
    </Sidebar.MenuItem>
  )
}
