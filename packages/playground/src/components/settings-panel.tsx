import React, { useState } from 'react'
import { Navbar, Sheet, SheetContent, Icon, Text, Spacer, cn } from '@harnessio/canary'
import { navbarSettingsData } from '../data/mockNavbarSettingsData'
import { NavLink } from 'react-router-dom'

interface SettingsPanelProps {
  showSettings: boolean
  handleSettings: () => void
}

export function SettingsPanel({ showSettings, handleSettings }: SettingsPanelProps) {
  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null)

  return (
    <Sheet modal={false} open={showSettings} onOpenChange={handleSettings}>
      <SheetContent side="left" className="p-0 w-[364px] h-screen left-[220px] top-0 bottom-0 z-40">
        <Navbar.Root className="w-[364px]">
          <Navbar.Content>
            <Spacer size={8} />
            {navbarSettingsData.map((group, group_idx) => (
              <Navbar.Group topBorder={group_idx > 0} key={group.groupId}>
                <Text size={1} color="tertiaryBackground" className="opacity-60 mb-1.5">
                  {group.title}
                </Text>
                <div className="w-full grid grid-cols-[repeat(2,1fr)] grid-flow-row gap-x-8 gap-y-1.5">
                  {group.items.map(item => {
                    const isHovered = hoveredItemId === item.id
                    const iconName = item.iconName

                    return (
                      <div
                        key={`${group.groupId}-${item.id}`}
                        onMouseEnter={() => setHoveredItemId(item.id)}
                        onMouseLeave={() => setHoveredItemId(null)}
                        className={cn('cursor-pointer', { 'opacity-100 text-primary': isHovered })}>
                        <NavLink to={item.to} onClick={handleSettings}>
                          <Navbar.Item text={item.title || ''} icon={<Icon size={12} name={iconName} />} />
                        </NavLink>
                      </div>
                    )
                  })}
                </div>
              </Navbar.Group>
            ))}
          </Navbar.Content>
        </Navbar.Root>
      </SheetContent>
    </Sheet>
  )
}
