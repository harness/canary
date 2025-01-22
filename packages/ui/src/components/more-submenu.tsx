import { NavLink } from 'react-router-dom'

import { Icon, NavbarSkeleton, ScrollArea, Sheet, Spacer } from '@/components'
import { MenuGroupType } from '@components/navbar/types'

interface MoreSubmenuProps {
  showMoreMenu: boolean
  handleMoreMenu: () => void
  items: MenuGroupType[]
}

export function MoreSubmenu({ showMoreMenu, handleMoreMenu, items }: MoreSubmenuProps) {
  return (
    <Sheet.Root modal={false} open={showMoreMenu}>
      <Sheet.Content
        className="inset-y-0 left-[220px] z-40 h-screen w-[328px] bg-transparent p-0"
        side="left"
        onClick={handleMoreMenu}
        modal={false}
      >
        <Sheet.Title className="sr-only">More Menu</Sheet.Title>
        <NavbarSkeleton.Root className="w-[328px]" isSubMenu>
          <NavbarSkeleton.Content className="overflow-hidden">
            <ScrollArea>
              <Spacer size={9} />
              {items.map((group, group_idx) => (
                <NavbarSkeleton.Group key={group.groupId} topBorder={group_idx > 0} title={group.title} isSubMenu>
                  {group.items.map(item => (
                    <NavLink key={item.id} to={item.to || ''}>
                      {({ isActive }) => (
                        <NavbarSkeleton.Item
                          text={item.title || ''}
                          description={item.description || ''}
                          submenuItem
                          icon={item.iconName && <Icon name={item.iconName} size={18} />}
                          active={isActive}
                        />
                      )}
                    </NavLink>
                  ))}
                </NavbarSkeleton.Group>
              ))}
              <Spacer size={11} />
            </ScrollArea>
          </NavbarSkeleton.Content>
        </NavbarSkeleton.Root>
      </Sheet.Content>
    </Sheet.Root>
  )
}
