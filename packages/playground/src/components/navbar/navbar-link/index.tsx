import { NavLink } from 'react-router-dom'

import { Icon, IconProps, Navbar as NavbarComp } from '@harnessio/canary'

import { NavbarItem, NavbarItemStatic } from '../types'

export const NavBarLink = (item: NavbarItem | NavbarItemStatic) => {
  const iconName = item.iconName.replace('-gradient', '') as IconProps['name']

  return (
    <NavLink to={item.to || ''}>
      {({ isActive }) => (
        <NavbarComp.Item text={item.title} icon={<Icon name={iconName} size={12} />} active={isActive} />
      )}
    </NavLink>
  )
}
