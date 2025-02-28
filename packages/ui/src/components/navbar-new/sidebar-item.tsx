import { NavLink } from 'react-router-dom'

import { Button } from '@components/button'
import { DropdownMenu } from '@components/dropdown-menu'
import { Icon, IconProps } from '@components/icon'
import { Sidebar } from '@components/sidebar/sidebar'
import { Text } from '@components/text'
import { cn } from '@utils/cn'
import { TFunction } from 'i18next'

interface NavbarItemType {
  id: number | string
  title: string
  iconName?: IconProps['name']
  description?: string
  to: string
  permanentlyPinned?: boolean
}

interface NavbarItemProps {
  item: NavbarItemType
  isRecent?: boolean
  handleChangePinnedMenuItem: (item: NavbarItemType, pin: boolean) => void
  handleRemoveRecentMenuItem: (item: NavbarItemType) => void
  handleCustomNav: () => void
  t: TFunction
}

export const SidebarItem = ({
  item,
  isRecent = false,
  handleChangePinnedMenuItem,
  handleRemoveRecentMenuItem,
  handleCustomNav,
  t
}: //   t,
NavbarItemProps) => {
  const iconName = item.iconName && (item.iconName.replace('-gradient', '') as IconProps['name'])

  const handlePin = () => {
    handleChangePinnedMenuItem(item, isRecent)
  }

  const handleRemoveRecent = () => {
    handleRemoveRecentMenuItem(item)
  }

  const dropdownItems = isRecent ? (
    <>
      <DropdownMenu.Item onSelect={handlePin} className="gap-2">
        <Icon name="pin" size={12} />
        <Text size={2} truncate>
          {t('component:navbar.pin')}
        </Text>
      </DropdownMenu.Item>
      <DropdownMenu.Item onSelect={handleRemoveRecent} className="gap-2">
        <Icon name="trash" size={12} />
        <Text size={2} truncate>
          {t('component:navbar.remove')}
        </Text>
      </DropdownMenu.Item>
    </>
  ) : (
    <>
      <DropdownMenu.Item onSelect={handleCustomNav} className="gap-2">
        <Icon name="list" size={12} />
        <Text size={2} truncate>
          {t('component:navbar.reorder')}
        </Text>
      </DropdownMenu.Item>

      {!item.permanentlyPinned ? (
        <DropdownMenu.Item onSelect={handlePin} className="gap-2">
          <Icon name="unpin" size={12} />
          <Text size={2} truncate>
            {t('component:navbar.unpin')}
          </Text>
        </DropdownMenu.Item>
      ) : null}
    </>
  )

  return (
    <div className="group/menu-item relative">
      <NavLink className="block" to={item.to || ''} end>
        {({ isActive }) => (
          <Sidebar.MenuItem
            className={cn('hover:bg-background-4 rounded text-foreground-3  transition-colors hover:text-primary', {
              'bg-background-4': isActive
            })}
          >
            <Sidebar.MenuButton asChild isActive={isActive}>
              <div className="gap-2.5">
                <Icon
                  name={iconName!}
                  size={10}
                  className={cn('!w-[12px] !h-[auto]', {
                    'text-primary': isActive
                  })}
                />
                <span
                  className={cn('font-medium', {
                    'text-primary': isActive
                  })}
                >
                  {item.title}
                </span>
              </div>
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
        )}
      </NavLink>
      <DropdownMenu.Root>
        <Sidebar.MenuAction>
          <DropdownMenu.Trigger asChild>
            <Button
              className="absolute right-[-0.8125rem] -top-1 text-icons-4 opacity-0 hover:text-icons-2 focus:opacity-100 focus-visible:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 focus:outline-none focus:ring-0"
              size="sm_icon"
              variant="custom"
            >
              <Icon name="menu-dots" size={12} />
            </Button>
          </DropdownMenu.Trigger>
        </Sidebar.MenuAction>
        <DropdownMenu.Content className="w-[128px]" align="end" sideOffset={-1} alignOffset={8}>
          {dropdownItems}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  )
}
