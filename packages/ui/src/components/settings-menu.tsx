import { IconV2, NavbarSkeleton, ScrollArea, Sheet, Spacer } from '@/components'
import { useRouterContext } from '@/context'
import { MenuGroupType } from '@components/app-sidebar/types'

interface SystemAdminMenuProps {
  showSettingMenu: boolean
  handleSettingsMenu: (state?: boolean) => void
  items: MenuGroupType[]
}

export const SettingsMenu = ({ showSettingMenu, handleSettingsMenu, items }: SystemAdminMenuProps) => {
  const { NavLink } = useRouterContext()

  return (
    <Sheet.Root modal={false} open={showSettingMenu}>
      <Sheet.Content
        className="inset-y-0 z-30 h-screen w-[364px] translate-x-[--cn-sidebar-width] border-l p-0 shadow-none"
        closeClassName="text-sidebar-icon-3 hover:text-sidebar-icon-1"
        overlayClassName="!z-20 left-[--cn-sidebar-width]"
        onClick={() => handleSettingsMenu(false)}
        modal={false}
        side="left"
      >
        <Sheet.Title className="sr-only">System Administration menu</Sheet.Title>
        <NavbarSkeleton.Root className="w-[364px]" isSubMenu>
          <NavbarSkeleton.Content className="overflow-hidden">
            <ScrollArea>
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
                            icon={item.iconName && <IconV2 name={item.iconName} size="xs" />}
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
