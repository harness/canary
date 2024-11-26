import { useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { Button, Icon, NavbarProjectChooser, ScrollArea, Spacer } from '@/components'
import { TypesUser } from '@/types'
import { isEmpty } from 'lodash-es'

import { adminMenuItem } from './data'
import { NavbarItem } from './navbar-item'
import NavbarSkeleton from './navbar-skeleton'
import { NavbarUser } from './navbar-user'
import { NavbarItemType } from './types'

const hideNavbarPaths = ['/signin', '/signup']

interface NavbarProps {
  recentMenuItems: NavbarItemType[]
  pinnedMenuItems: NavbarItemType[]
  showMoreMenu: boolean
  showSettingMenu: boolean
  handleMoreMenu: () => void
  handleSettingsMenu: () => void
  currentUser: TypesUser | undefined
  handleCustomNav: () => void
  handleLogOut: () => void
  handleChangePinnedMenuItem: (item: NavbarItemType) => void
  handleRemoveRecentMenuItem: (item: NavbarItemType) => void
}

export const Navbar = ({
  recentMenuItems,
  pinnedMenuItems,
  showMoreMenu,
  showSettingMenu,
  handleMoreMenu,
  handleSettingsMenu,
  currentUser,
  handleCustomNav,
  handleLogOut,
  handleChangePinnedMenuItem,
  handleRemoveRecentMenuItem
}: NavbarProps) => {
  const location = useLocation()
  const navigate = useNavigate()

  const showNavbar = useMemo(() => {
    return !hideNavbarPaths.includes(location.pathname)
  }, [location.pathname])

  if (!showNavbar) return null

  return (
    <NavbarSkeleton.Root className="fixed inset-y-0 left-0 z-50 overflow-hidden max-md:hidden">
      <NavbarSkeleton.Header>
        <NavbarProjectChooser.Root
          logo={
            <Link className="flex items-center gap-1.5" to="/">
              <Icon name="harness" size={18} className="text-foreground-1" />
              <Icon name="harness-logo-text" width={65} height={15} className="mb-0.5 text-foreground-1" />
            </Link>
          }
        />
      </NavbarSkeleton.Header>

      <NavbarSkeleton.Content className="overflow-hidden">
        <ScrollArea className="mb-[1.375rem]">
          <Spacer size={1.5} />
          <NavbarSkeleton.Group>
            {pinnedMenuItems.map((item, idx) => (
              <NavbarItem
                key={idx}
                item={item}
                handleChangePinnedMenuItem={handleChangePinnedMenuItem}
                handleRemoveRecentMenuItem={handleRemoveRecentMenuItem}
                handleCustomNav={handleCustomNav}
              />
            ))}
            <button onClick={handleMoreMenu}>
              <NavbarSkeleton.Item text="More" icon={<Icon name="ellipsis" size={12} />} active={showMoreMenu} />
            </button>
          </NavbarSkeleton.Group>

          {!!recentMenuItems.length && (
            <NavbarSkeleton.Group title="Recent" topBorder>
              {recentMenuItems.map(item => (
                <NavbarItem
                  key={item.id}
                  item={item}
                  isRecent
                  handleChangePinnedMenuItem={handleChangePinnedMenuItem}
                  handleRemoveRecentMenuItem={handleRemoveRecentMenuItem}
                  handleCustomNav={handleCustomNav}
                />
              ))}
            </NavbarSkeleton.Group>
          )}

          <NavbarSkeleton.Group topBorder>
            <button onClick={handleSettingsMenu}>
              <NavbarSkeleton.Item
                text={adminMenuItem.title}
                icon={<Icon name={adminMenuItem.iconName} size={12} />}
                active={showSettingMenu}
              />
            </button>
          </NavbarSkeleton.Group>
        </ScrollArea>

        {/*<NavbarAi />*/}
      </NavbarSkeleton.Content>

      <NavbarSkeleton.Footer>
        {!isEmpty(currentUser) ? (
          <NavbarUser currentUser={currentUser} handleCustomNav={handleCustomNav} handleLogOut={handleLogOut} />
        ) : (
          <Button onClick={() => navigate('/signin')}>Sign In</Button>
        )}
      </NavbarSkeleton.Footer>
    </NavbarSkeleton.Root>
  )
}
