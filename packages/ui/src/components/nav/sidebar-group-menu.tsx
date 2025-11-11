import { Drawer, GridProps, Layout, Sidebar } from '@/components'

import { ScopedMenuGroupType, ScopedNavbarItemType } from './types'

export default function SidebarGroupMenu({
  menuItems,
  columns
}: {
  menuItems: ScopedMenuGroupType[]
  columns: GridProps['columns']
}) {
  const renderMenuItems = (items: ScopedNavbarItemType[]) => (
    <Layout.Grid columns={columns}>
      {items.map(item => (
        <Drawer.Close key={item.id} asChild>
          <Sidebar.Item to={item.to} title={item.title} icon={item.iconName} />
        </Drawer.Close>
      ))}
    </Layout.Grid>
  )

  return (
    <Layout.Grid>
      {menuItems.map((group, index) => (
        <Sidebar.Group label={(group.title ?? '').toUpperCase()} key={group.groupId}>
          {renderMenuItems(group.items)}
          {index !== menuItems.length - 1 && <Sidebar.Separator />}
        </Sidebar.Group>
      ))}
    </Layout.Grid>
  )
}
