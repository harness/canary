import { useCallback, useMemo } from 'react'

import { AppSidebarItem, IconV2NamesType, NavbarItemType, Sidebar } from '@/components'
import { useNav } from '@hooks/useNav'
import { noop } from 'lodash-es'

interface SidebarItemProps {
  item: NavbarItemType
  isPinned?: boolean
}

export default function SidebarItem({ item, isPinned }: SidebarItemProps) {
  const { setRecent, setPinned } = useNav()

  const handleChangePinnedMenuItem = useCallback(
    (item: NavbarItemType, pin: boolean) => setPinned(item, pin),
    [setPinned]
  )

  const handleRemoveRecentMenuItem = useCallback((item: NavbarItemType) => setRecent(item, true), [setRecent])

  const actionButtons = useMemo(() => {
    if (item.permanentlyPinned) {
      return []
    }

    return [
      {
        iconName: isPinned ? ('pin-slash-solid' as IconV2NamesType) : ('pin' as IconV2NamesType),
        onClick: () => handleChangePinnedMenuItem(item, isPinned ? false : true)
      }
    ]
  }, [item, isPinned, handleChangePinnedMenuItem])

  if (Array.isArray(item.subItems) && item.subItems.length > 0) {
    return (
      <Sidebar.Item
        defaultSubmenuOpen={!isPinned}
        key={item.id}
        actionButtons={actionButtons}
        to={item.to}
        icon={item.iconName}
        title={item.title}
      >
        {item.subItems.map(subItem => (
          <Sidebar.MenuSubItem key={subItem.id} title={subItem.title} to={subItem.to} />
        ))}
      </Sidebar.Item>
    )
  }

  return (
    <AppSidebarItem
      key={item.id}
      hideMenuItems
      item={item}
      handleChangePinnedMenuItem={handleChangePinnedMenuItem}
      handleRemoveRecentMenuItem={handleRemoveRecentMenuItem}
      handleCustomNav={noop}
      actionButtons={actionButtons}
    />
  )
}
