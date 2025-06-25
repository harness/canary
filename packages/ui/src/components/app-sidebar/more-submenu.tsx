import { Fragment } from 'react'

import { ScrollArea, Sheet, Sidebar } from '@/components'
import { MenuGroupType } from '@components/app-sidebar/types'

interface MoreSubmenuProps {
  showMoreMenu: boolean
  handleMoreMenu: (state?: boolean) => void
  items: MenuGroupType[]
}

export function MoreSubmenu({ showMoreMenu, handleMoreMenu, items }: MoreSubmenuProps) {
  return (
    <Sheet.Root modal={false} open={showMoreMenu}>
      <Sheet.Content
        className="bg-cn-background-2 inset-y-0 z-30 w-[388px] translate-x-[--cn-sidebar-width] rounded-e-lg border-l p-0 shadow-none"
        overlayClassName="!z-20 left-[--cn-sidebar-width]"
        modal={false}
        onClick={() => handleMoreMenu(false)}
        side="left"
      >
        <Sheet.Title className="sr-only">More Menu</Sheet.Title>
        <ScrollArea className="h-screen p-5">
          {items.map((group, index) => (
            <Fragment key={group.groupId}>
              {index > 0 && <Sidebar.Separator />}
              <Sidebar.Group key={group.groupId} label={group.title}>
                {group.items.map(item => (
                  <Sidebar.Item
                    key={item.id}
                    to={item.to}
                    title={item.title}
                    description={item.description}
                    icon={item.iconName}
                  />
                ))}
              </Sidebar.Group>
            </Fragment>
          ))}
        </ScrollArea>
      </Sheet.Content>
    </Sheet.Root>
  )
}
