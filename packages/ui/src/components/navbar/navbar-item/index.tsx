import { NavLink } from 'react-router-dom'

import { Button, DropdownMenu, Icon, IconProps, Text } from '@/components'
import { NavbarSkeleton } from '@components/navbar-skeleton'
import { TFunction } from 'i18next'

import { NavbarItemType } from '../types'

interface NavbarItemProps {
  item: NavbarItemType
  isRecent?: boolean
  handleChangePinnedMenuItem: (item: NavbarItemType, pin: boolean) => void
  handleRemoveRecentMenuItem: (item: NavbarItemType) => void
  handleCustomNav: () => void
  t: TFunction
}

export const NavbarItem = ({
  item,
  isRecent = false,
  handleChangePinnedMenuItem,
  handleRemoveRecentMenuItem,
  handleCustomNav,
  t
}: NavbarItemProps) => {
  const iconName = item.iconName && (item.iconName.replace('-gradient', '') as IconProps['name'])

  const handlePin = () => {
    handleChangePinnedMenuItem(item, isRecent)
  }

  const handleRemoveRecent = () => {
    handleRemoveRecentMenuItem(item)
  }

  const dropdownItems = isRecent ? (
    <>
      <DropdownMenu.Item onSelect={handlePin}>
        <Text size={2} truncate>
          {t('component:navbar.pin')}
        </Text>
      </DropdownMenu.Item>
      <DropdownMenu.Item onSelect={handleRemoveRecent}>
        <Text size={2} truncate>
          {t('component:navbar.remove')}
        </Text>
      </DropdownMenu.Item>
    </>
  ) : (
    <>
      <DropdownMenu.Item onSelect={handleCustomNav}>
        <Text size={2} truncate>
          {t('component:navbar.reorder')}
        </Text>
      </DropdownMenu.Item>

      {!item.permanentlyPinned ? (
        <DropdownMenu.Item onSelect={handlePin}>
          <Text size={2} truncate>
            {t('component:navbar.unpin')}
          </Text>
        </DropdownMenu.Item>
      ) : null}
    </>
  )

  return (
    <div className="group relative">
      <NavLink className="block pr-6" to={item.to || ''}>
        {({ isActive }) => (
          <NavbarSkeleton.Item
            text={item.title}
            icon={iconName && <Icon name={iconName} size={12} />}
            active={isActive}
          />
        )}
      </NavLink>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button
            className="absolute right-[-0.8125rem] top-0 text-icons-4 opacity-0 hover:text-icons-2 focus:opacity-100 focus-visible:opacity-100 group-hover:opacity-100 data-[state=open]:opacity-100"
            size="sm_icon"
            variant="custom"
          >
            <Icon name="menu-dots" size={12} />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="w-[128px]" align="end" sideOffset={-1} alignOffset={8}>
          {dropdownItems}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  )
}
