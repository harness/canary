import { useState } from 'react'

import { cn, Icon, IconProps, Navbar, Sheet, SheetContent, Spacer, Text } from '@harnessio/canary'

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
        'bg-background border-primary/10 text-primary/80 relative flex h-8 w-8 place-content-center place-items-center rounded-md border',
        { 'text-success': iconName === 'pin' },
        { 'text-destructive': iconName === 'unpin' }
      )}
    >
      <Icon name={iconName} size={16} />
    </div>
  )
}

export function MoreSubmenu({ showMore, handleMore, onPinItem, pinnedItems }: MoreSubmenuProps) {
  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null)

  return (
    <Sheet modal={false} open={showMore} onOpenChange={handleMore}>
      <SheetContent side="left" className="inset-y-0 left-[220px] z-40 h-screen w-[328px] p-0">
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
                      role="button"
                      tabIndex={0}
                      key={`${group.groupId}-${item.id}`}
                      onMouseEnter={() => setHoveredItemId(item.id)}
                      onMouseLeave={() => setHoveredItemId(null)}
                      onClick={() => onPinItem(item)}
                      className={cn(
                        'cursor-pointer',
                        { 'text-primary opacity-40': isPinned },
                        { 'text-primary opacity-100': isHovered }
                      )}
                    >
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
