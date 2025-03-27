import { Icon, NavbarSkeleton, ScrollArea, Sheet, Spacer } from '@/components'
import { useRouterContext, useTheme } from '@/context'
import { MenuGroupType } from '@components/app-sidebar/types'
import { cn } from '@utils/cn'

interface MoreSubmenuProps {
  showMoreMenu: boolean
  handleMoreMenu: () => void
  items: MenuGroupType[]
}

export function MoreSubmenu({ showMoreMenu, handleMoreMenu, items }: MoreSubmenuProps) {
  const { NavLink } = useRouterContext()
  const { isInset } = useTheme()

  return (
    <Sheet.Root modal={false} open={showMoreMenu}>
      <Sheet.Content
        className={cn(
          'inset-y-0 z-40 h-screen w-[328px] bg-transparent p-0',
          isInset ? 'border-l left-[228px]' : 'left-[220px]'
        )}
        closeClassName="text-sidebar-icon-3 hover:text-sidebar-icon-1"
        side="left"
        onClick={handleMoreMenu}
        modal={false}
      >
        <Sheet.Title className="sr-only">More Menu</Sheet.Title>
        <NavbarSkeleton.Root className="w-[328px]" isSubMenu>
          <NavbarSkeleton.Content className="overflow-hidden">
            <ScrollArea scrollThumbClassName="bg-sidebar-background-8">
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
                          icon={item.iconName && <Icon name={item.iconName} size={18} />}
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
