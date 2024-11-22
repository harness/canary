import { NavLink } from 'react-router-dom'

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icon,
  IconProps,
  Navbar as NavbarComp,
  Text
} from '@harnessio/canary'

import { NavbarItemType } from '../types'

interface NavbarItemProps {
  item: NavbarItemType
  isRecent?: boolean
  handleChangePinnedMenuItem: (item: NavbarItemType) => void
  handleRemoveRecentMenuItem: (item: NavbarItemType) => void
  handleCustomNav: () => void
}

export const NavbarItem = ({
  item,
  isRecent = false,
  handleChangePinnedMenuItem,
  handleRemoveRecentMenuItem,
  handleCustomNav
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
          Pin
        </Text>
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={handleRemoveRecent}>
        <Text size={2} truncate>
          Remove
        </Text>
      </DropdownMenuItem>
    </>
  ) : (
    <>
      <DropdownMenuItem onSelect={handleCustomNav}>
        <Text size={2} truncate>
          Reorder
        </Text>
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={handlePin}>
        <Text size={2} truncate>
          Unpin
        </Text>
      </DropdownMenuItem>
    </>
  )

  return (
    <div className="group relative">
      <NavLink className="block pr-6" to={item.to || ''}>
        {({ isActive }) => (
          <NavbarComp.Item text={item.title} icon={<Icon name={iconName} size={12} />} active={isActive} />
        )}
      </NavLink>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="absolute -right-[0.8125rem] top-0 text-icons-4 opacity-0 hover:text-icons-2 group-hover:opacity-100 data-[state=open]:opacity-100"
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
