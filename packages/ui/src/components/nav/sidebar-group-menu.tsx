import { Drawer, Layout, Sidebar } from '@/components'
import { cn } from '@utils/cn'

import { ScopedMenuGroupType, ScopedNavbarItemType } from './types'

export default function SidebarGroupMenu({
  menuItems,
  columns = 2,
  variant = 'default'
}: {
  menuItems: ScopedMenuGroupType[]
  columns?: number
  variant?: 'default' | 'popover'
}) {
  const isPopover = variant === 'popover'

  const renderMenuItems = (items: ScopedNavbarItemType[]) => (
    <div
      className={cn('cn-sidebar-group-items', {
        'cn-sidebar-group-items-single-col': columns === 1
      })}
    >
      {items.map(item => (
        <Drawer.Close key={item.id} asChild>
          <Sidebar.Item
            to={item.to}
            title={item.title}
            icon={item.iconName}
            className={cn({ 'cn-sidebar-item-popover': isPopover })}
          />
        </Drawer.Close>
      ))}
    </div>
  )

  return (
    <Layout.Flex direction="column" gap="none">
      {menuItems.map((group, index) => (
        <>
          <Sidebar.Group label={(group.title ?? '').toUpperCase()} key={group.groupId}>
            {renderMenuItems(group.items)}
          </Sidebar.Group>
          {index !== menuItems.length - 1 && <Sidebar.Separator />}
        </>
      ))}
    </Layout.Flex>
  )
}
