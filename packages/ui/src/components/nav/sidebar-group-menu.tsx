import { Fragment } from 'react'

import { Drawer, Layout, Sidebar } from '@/components'
import { cn } from '@utils/cn'

import { ScopedMenuGroupType, ScopedNavbarItemType } from './types'

export default function SidebarGroupMenu({
  menuItems,
  className,
  variant = 'default'
}: {
  menuItems: ScopedMenuGroupType[]
  className?: string
  variant?: 'default' | 'popover'
}) {
  const isPopover = variant === 'popover'

  const renderMenuItems = (items: ScopedNavbarItemType[]) => (
    <div
      className={cn('cn-sidebar-group-items', isPopover && 'cn-sidebar-group-items-popover')}
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
    <Layout.Flex direction="column" gap="none" className={className}>
      {menuItems.map((group, index) => (
        <Fragment key={group.groupId}>
          <Sidebar.Group label={(group.title ?? '').toUpperCase()}>
            {renderMenuItems(group.items)}
          </Sidebar.Group>
          {index !== menuItems.length - 1 && <Sidebar.Separator />}
        </Fragment>
      ))}
    </Layout.Flex>
  )
}
