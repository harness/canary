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
    <Layout.Grid columns={columns} gap="4xs">
      {items.map(item => (
        <Drawer.Close key={item.id} asChild>
          <Sidebar.Item to={item.to} title={item.title} icon={item.iconName} />
        </Drawer.Close>
      ))}
    </Layout.Grid>
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
