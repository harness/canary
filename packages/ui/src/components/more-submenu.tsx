import { IconV2, NavbarSkeleton, ScrollArea, Sheet, Spacer } from '@/components'
import { useRouterContext } from '@/context'
import { MenuGroupType } from '@components/app-sidebar/types'

interface MoreSubmenuProps {
  showMoreMenu: boolean
  handleMoreMenu: (state?: boolean) => void
  items: MenuGroupType[]
}

export function MoreSubmenu({ showMoreMenu, handleMoreMenu, items }: MoreSubmenuProps) {
  const { NavLink } = useRouterContext()

  return (
    <Sheet.Root modal={false} open={showMoreMenu}>
      <Sheet.Content
        className="inset-y-0 z-30 h-screen w-[328px] translate-x-[--cn-sidebar-width] border-l p-0 shadow-none"
        closeClassName="text-sidebar-icon-3 hover:text-sidebar-icon-1"
        overlayClassName="!z-20 left-[--cn-sidebar-width]"
        modal={false}
        onClick={() => handleMoreMenu(false)}
        side="left"
      >
        <Sheet.Title className="sr-only">More Menu</Sheet.Title>
        <NavbarSkeleton.Root className="w-[328px]" isSubMenu>
          <NavbarSkeleton.Content className="overflow-hidden">
            <ScrollArea classNameContent="w-full">
              <Spacer size={10} />
              {items.map((group, group_idx) => (
                <NavbarSkeleton.Group
                  key={group.groupId}
                  topBorder={group_idx > 0}
                  title={group.title}
                  isSubMenu
                  isMainNav
                >
                  {group.items.map(item => (
                    <NavLink key={item.id} to={item.to || ''}>
                      {({ isActive }) => (
                        <NavbarSkeleton.Item
                          text={item.title || ''}
                          description={item.description || ''}
                          icon={item.iconName && <IconV2 name={item.iconName} size="md" />}
                          active={isActive}
                          submenuItem
                          isMainNav
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
