import { NavLink } from 'react-router-dom'

import { Icon, NavbarSkeleton, ScrollArea, Sheet, SheetContent, SheetTitle, Spacer } from '@/components'
import { MenuGroupType } from '@components/navbar/types'

interface SystemAdminMenuProps {
  showSettingMenu: boolean
  handleSettingsMenu: () => void
  items: MenuGroupType[]
}

export const SettingsMenu = ({ showSettingMenu, handleSettingsMenu, items }: SystemAdminMenuProps) => {
  return (
    <Sheet modal={false} open={showSettingMenu}>
      <SheetContent
        className="inset-y-0 left-[220px] z-40 h-screen w-[364px] bg-transparent p-0"
        side="left"
        onClick={handleSettingsMenu}
        modal={false}
      >
        <SheetTitle className="sr-only">System Administration menu</SheetTitle>
        <NavbarSkeleton.Root className="w-[364px]" isSubMenu>
          <NavbarSkeleton.Content className="overflow-hidden">
            <ScrollArea>
              <Spacer size={9} />
              {items.map((group, group_idx) => (
                <NavbarSkeleton.Group
                  key={group.groupId}
                  topBorder={group_idx > 0}
                  title={group.title}
                  titleClassName="mb-1.5"
                >
                  <div className="grid grid-cols-2 gap-x-6 gap-y-[0.6875rem]">
                    {group.items.map(item => (
                      <NavLink key={item.id} to={item.to || ''}>
                        {({ isActive }) => (
                          <NavbarSkeleton.Item
                            text={item.title || ''}
                            icon={item.iconName && <Icon name={item.iconName} size={12} />}
                            active={isActive}
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
      </SheetContent>
    </Sheet>
  )
}
