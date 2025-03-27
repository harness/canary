import { Icon, NavbarSkeleton, ScrollArea, Sheet, Spacer } from '@/components'
import { useRouterContext, useTheme } from '@/context'
import { MenuGroupType } from '@components/app-sidebar/types'
import { cn } from '@utils/cn'

interface SystemAdminMenuProps {
  showSettingMenu: boolean
  handleSettingsMenu: () => void
  items: MenuGroupType[]
}

export const SettingsMenu = ({ showSettingMenu, handleSettingsMenu, items }: SystemAdminMenuProps) => {
  const { NavLink } = useRouterContext()
  const { isInset } = useTheme()

  return (
    <Sheet.Root modal={false} open={showSettingMenu}>
      <Sheet.Content
        className={cn(
          'inset-y-0 z-40 h-screen w-[364px] bg-transparent p-0',
          isInset ? 'border-l left-[228px]' : 'left-[220px]'
        )}
        closeClassName="text-sidebar-icon-3 hover:text-sidebar-icon-1"
        side="left"
        onClick={handleSettingsMenu}
        modal={false}
      >
        <Sheet.Title className="sr-only">System Administration menu</Sheet.Title>
        <NavbarSkeleton.Root className="w-[364px]" isSubMenu>
          <NavbarSkeleton.Content className="overflow-hidden">
            <ScrollArea scrollThumbClassName="bg-sidebar-background-8">
              <Spacer size={10} />
              {items.map((group, group_idx) => (
                <NavbarSkeleton.Group
                  key={group.groupId}
                  topBorder={group_idx > 0}
                  title={group.title}
                  titleClassName="mb-1.5"
                  isMainNav
                >
                  <div className="grid grid-cols-2 gap-x-4 gap-y-[0.6875rem]">
                    {group.items.map(item => (
                      <NavLink key={item.id} to={item.to || ''}>
                        {({ isActive }) => (
                          <NavbarSkeleton.Item
                            text={item.title || ''}
                            icon={item.iconName && <Icon name={item.iconName} size={14} />}
                            active={isActive}
                            isMainNav
                          />
                        )}
                      </NavLink>
                    ))}
                  </div>
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
