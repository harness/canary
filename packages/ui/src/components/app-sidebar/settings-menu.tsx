import { Fragment } from 'react'

import { Layout, ScrollArea, Sheet, Sidebar } from '@/components'
import { MenuGroupType } from '@components/app-sidebar/types'

interface SystemAdminMenuProps {
  showSettingMenu: boolean
  handleSettingsMenu: (state?: boolean) => void
  items: MenuGroupType[]
}

export const SettingsMenu = ({ showSettingMenu, handleSettingsMenu, items }: SystemAdminMenuProps) => {
  return (
    <Sheet.Root modal={false} open={showSettingMenu}>
      <Sheet.Content
        className="bg-cn-background-2 inset-y-0 z-30 w-[388px] translate-x-[--cn-sidebar-width] rounded-e-lg border-l p-0 shadow-none"
        overlayClassName="!z-20 left-[--cn-sidebar-width]"
        onClick={() => handleSettingsMenu(false)}
        modal={false}
        side="left"
      >
        <Sheet.Title className="sr-only">System Administration menu</Sheet.Title>
        <ScrollArea className="h-screen p-5">
          {items.map((group, index) => (
            <Fragment key={group.groupId}>
              {index > 0 && <Sidebar.Separator />}
              <Sidebar.Group key={group.groupId} label={group.title}>
                <Layout.Grid columns={2}>
                  {group.items.map(item => (
                    <Sidebar.Item
                      key={item.id}
                      to={item.to}
                      title={item.title}
                      description={item.description}
                      icon={item.iconName}
                    />
                  ))}
                </Layout.Grid>
              </Sidebar.Group>
            </Fragment>
          ))}
        </ScrollArea>
      </Sheet.Content>
    </Sheet.Root>
  )
}
