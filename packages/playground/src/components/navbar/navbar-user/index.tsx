import { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { cn, Icon, NavbarUser as NavbarUserComp, Text } from '@harnessio/canary'

import { TypesUser } from '../../../layouts/types'
import { userMenuItems } from '../data'
import { UserMenuKeys } from '../types'

interface NavbarUserProps {
  currentUser: TypesUser | undefined
  handleCustomNav: () => void
  handleLogOut: () => void
}

export const NavbarUser = ({ currentUser, handleCustomNav, handleLogOut }: NavbarUserProps) => {
  const menuItems = useMemo(() => {
    return userMenuItems.map(({ key, iconName, title, to, isSeparated }) => {
      const className = 'relative grid grid-cols-[auto_1fr] items-center gap-2.5'

      const handleClick = () => {
        switch (key) {
          case UserMenuKeys.CUSTOM_NAV:
            return handleCustomNav()
          case UserMenuKeys.LOG_OUT:
            return handleLogOut
          default:
            return
        }
      }

      const elementChild = (
        <>
          <Icon className={cn('text-icons-4 ml-[3px] transition-colors')} size={12} name={iconName} />
          <Text size={2} truncate>
            {title}
          </Text>
        </>
      )

      const element = to ? (
        <Link className={className} to={to}>
          {elementChild}
        </Link>
      ) : (
        <button className={cn(className, 'w-full text-left')} onClick={handleClick}>
          {elementChild}
        </button>
      )

      return {
        key,
        element,
        isSeparated
      }
    })
  }, [handleCustomNav, handleLogOut])

  return (
    <NavbarUserComp.Root
      username={currentUser?.display_name || currentUser?.uid || ''}
      role={currentUser?.role}
      url={currentUser?.url}
      menuItems={menuItems}
    />
  )
}
