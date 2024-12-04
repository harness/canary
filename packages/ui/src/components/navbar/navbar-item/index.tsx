import { NavLink } from 'react-router-dom'

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icon,
  IconProps,
  Text
} from '@/components'
import { TFunction } from 'i18next'

import NavbarSkeleton from '../navbar-skeleton'
import { NavbarItemType } from '../types'

interface NavbarItemProps {
  item: NavbarItemType
  isRecent?: boolean
  handleChangePinnedMenuItem: (item: NavbarItemType) => void
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
  const iconName = item.iconName.replace('-gradient', '') as IconProps['name']

  const handlePin = () => {
    handleChangePinnedMenuItem(item)
  }

  const handleRemoveRecent = () => {
    handleRemoveRecentMenuItem(item)
  }

  const dropdownItems = isRecent ? (
    <>
      <DropdownMenuItem onSelect={handlePin}>
        <Text size={2} truncate>
          {t('component:navbar.pin')}
        </Text>
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={handleRemoveRecent}>
        <Text size={2} truncate>
          {t('component:navbar.remove')}
        </Text>
      </DropdownMenuItem>
    </>
  ) : (
    <>
      <DropdownMenuItem onSelect={handleCustomNav}>
        <Text size={2} truncate>
          {t('component:navbar.reorder')}
        </Text>
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={handlePin}>
        <Text size={2} truncate>
          {t('component:navbar.unpin')}
        </Text>
      </DropdownMenuItem>
    </>
  )

  return (
    <div className="group relative">
      <NavLink className="block pr-6" to={item.to || ''}>
        {({ isActive }) => (
          <NavbarSkeleton.Item text={item.title} icon={<Icon name={iconName} size={12} />} active={isActive} />
        )}
      </NavLink>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="absolute -right-[0.8125rem] top-0 text-icons-4 opacity-0 hover:text-icons-2 focus:opacity-100 focus-visible:opacity-100 group-hover:opacity-100 data-[state=open]:opacity-100"
            size="sm_icon"
            variant="custom"
          >
            <Icon name="menu-dots" size={12} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[128px]" align="end" sideOffset={-1} alignOffset={8}>
          {dropdownItems}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
