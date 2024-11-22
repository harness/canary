import { NavLink } from 'react-router-dom'

import { Icon, Navbar, ScrollArea, Sheet, SheetContent, SheetTitle, Spacer } from '@harnessio/canary'

import { MenuGroupType } from './navbar/types'

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
        <Navbar.Root className="w-[364px]" isSubMenu>
          <Navbar.Content className="overflow-hidden">
            <ScrollArea>
              <Spacer size={9} />
              {items.map((group, group_idx) => (
                <Navbar.Group key={group.groupId} topBorder={group_idx > 0} title={group.title} titleClassName="mb-1.5">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-[0.6875rem]">
                    {group.items.map(item => (
                      <NavLink key={item.id} to={item.to || ''}>
                        {({ isActive }) => (
                          <Navbar.Item
                            text={item.title || ''}
                            icon={<Icon name={item.iconName} size={12} />}
                            active={isActive}
                          />
                        )}
                      </NavLink>
                    ))}
                  </div>
                </Navbar.Group>
              ))}
            </ScrollArea>
          </Navbar.Content>
        </Navbar.Root>
      </SheetContent>
    </Sheet>
  )
}
