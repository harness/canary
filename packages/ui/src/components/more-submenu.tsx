import { NavLink } from 'react-router-dom'

import { Icon, ScrollArea, Sheet, SheetContent, SheetTitle, Spacer } from '@/components'
import NavbarSkeleton from '@/components/navbar/navbar-skeleton'
import { MenuGroupType } from '@components/navbar/types'

interface MoreSubmenuProps {
  showMoreMenu: boolean
  handleMoreMenu: () => void
  items: MenuGroupType[]
}

export function MoreSubmenu({ showMoreMenu, handleMoreMenu, items }: MoreSubmenuProps) {
  return (
    <Sheet modal={false} open={showMoreMenu}>
      <SheetContent
        className="inset-y-0 left-[220px] z-40 h-screen w-[328px] bg-transparent p-0"
        side="left"
        onClick={handleMoreMenu}
        modal={false}
      >
        <SheetTitle className="sr-only">More Menu</SheetTitle>
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
                          icon={<Icon name={item.iconName} size={18} />}
                          active={isActive}
                        />
                      )}
                    </NavLink>
                  ))}
                </NavbarSkeleton.Group>
              ))}
            </ScrollArea>
          </NavbarSkeleton.Content>
        </NavbarSkeleton.Root>
      </SheetContent>
    </Sheet>
  )
}
