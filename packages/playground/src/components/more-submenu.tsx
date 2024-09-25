import React, { useState } from 'react'
import { Navbar, Sheet, SheetContent, Icon, Text, Spacer, cn, IconProps } from '@harnessio/canary'
import { navbarSubmenuData } from '../data/mockNavbarSubmenuData'

interface NavbarItem {
  id: number
  title: string
  iconName: IconProps['name']
  description: string
  to?: string
}

interface MoreSubmenuProps {
  showMore: boolean
  handleMore: () => void
  onPinItem: (item: NavbarItem) => void
  pinnedItems: NavbarItem[]
}

function MoreIcon({ iconName }: { iconName: IconProps['name'] }) {
  return (
    <div
      className={cn(
        'relative flex place-content-center place-items-center h-8 w-8 bg-background rounded-md border border-primary/10 text-primary/80',
        { 'text-success': iconName === 'pin' },
        { 'text-destructive': iconName === 'unpin' }
      )}>
      <Icon name={iconName} size={16} />
    </div>
  )
}

export function MoreSubmenu({ showMore, handleMore, onPinItem, pinnedItems }: MoreSubmenuProps) {
  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null)

  return (
    <Sheet modal={false} open={showMore} onOpenChange={handleMore}>
      <SheetContent side="left" className="p-0 w-[328px] h-screen left-[220px] top-0 bottom-0 z-40">
        <Navbar.Root className="w-[328px]">
          <Navbar.Content>
            <Spacer size={8} />
            {navbarSubmenuData.map((group, group_idx) => (
              <Navbar.Group topBorder={group_idx > 0} key={group.groupId}>
                <Text size={1} color="tertiaryBackground" className="opacity-60">
                  {group.title}
                </Text>
                <Spacer size={1} />
                {group.items.map(item => {
                  const isPinned = pinnedItems?.some(pinned => pinned.id === item.id)
                  const isHovered = hoveredItemId === item.id
                  const iconName = isPinned ? (isHovered ? 'unpin' : item.iconName) : isHovered ? 'pin' : item.iconName

                  return (
                    <div
                      key={`${group.groupId}-${item.id}`}
                      onMouseEnter={() => setHoveredItemId(item.id)}
                      onMouseLeave={() => setHoveredItemId(null)}
                      onClick={() => onPinItem(item)}
                      className={cn(
                        'cursor-pointer',
                        { 'opacity-40 text-primary': isPinned },
                        { 'opacity-100 text-primary': isHovered }
                      )}>
                      <Navbar.Item
                        text={item.title || ''}
                        description={item.description || ''}
                        submenuItem
                        icon={<MoreIcon iconName={iconName} />}
                      />
                    </div>
                  )
                })}
              </Navbar.Group>
            ))}
          </Navbar.Content>
        </Navbar.Root>
      </SheetContent>
    </Sheet>
  )
}
