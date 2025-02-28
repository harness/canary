import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import { Button, Icon, IThemeStore, NavbarProjectChooser, NavbarSkeleton, ScrollArea, Spacer } from '@/components'
import { useRouterContext } from '@/context'
import { TypesUser } from '@/types'
import { TranslationStore } from '@/views'
import { isEmpty } from 'lodash-es'

import { getAdminMenuItem } from './data'
import { NavbarItem } from './navbar-item'
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
  handleChangePinnedMenuItem: (item: NavbarItemType, pin: boolean) => void
  handleRemoveRecentMenuItem: (item: NavbarItemType) => void
  useThemeStore: () => IThemeStore
  useTranslationStore: () => TranslationStore
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
  handleRemoveRecentMenuItem,
  useThemeStore,
  useTranslationStore
}: NavbarProps) => {
  const { Link } = useRouterContext()
  const location = useLocation()
  const { navigate } = useRouterContext()
  const { t } = useTranslationStore()
  const adminMenuItem = getAdminMenuItem(t)

  const showNavbar = useMemo(() => {
    return !hideNavbarPaths.includes(location.pathname)
  }, [location.pathname])

  if (!showNavbar) return null

  return (
    <NavbarSkeleton.Root className="inset-y-0 size-full overflow-hidden max-md:hidden">
      <NavbarSkeleton.Header>
        <NavbarProjectChooser.Root
          logo={
            <Link className="flex items-center gap-1.5" to="/">
              <Icon name="harness" size={18} className="text-foreground-accent" />
              <Icon name="harness-logo-text" width={65} height={15} className="mb-0.5 text-foreground-1" />
            </Link>
          }
        />
      </NavbarSkeleton.Header>

      <NavbarSkeleton.Content className="overflow-hidden">
        <ScrollArea className="mb-[1.375rem]">
          <Spacer size={1.5} />
          <NavbarSkeleton.Group>
            {pinnedMenuItems.map(item => (
              <NavbarItem
                key={item.id}
                item={item}
                handleChangePinnedMenuItem={handleChangePinnedMenuItem}
                handleRemoveRecentMenuItem={handleRemoveRecentMenuItem}
                handleCustomNav={handleCustomNav}
                t={t}
              />
            ))}
            <button onClick={handleMoreMenu}>
              <NavbarSkeleton.Item text="More" icon={<Icon name="ellipsis" size={14} />} active={showMoreMenu} />
            </button>
          </NavbarSkeleton.Group>

          {!!recentMenuItems.length && (
            <NavbarSkeleton.Group title="Recent" topBorder>
              {recentMenuItems.map(item => (
                <NavbarItem
                  isRecent
                  key={item.id}
                  item={item}
                  handleChangePinnedMenuItem={handleChangePinnedMenuItem}
                  handleRemoveRecentMenuItem={handleRemoveRecentMenuItem}
                  handleCustomNav={handleCustomNav}
                  t={t}
                />
              ))}
            </NavbarSkeleton.Group>
          )}

          <NavbarSkeleton.Group topBorder>
            {!!currentUser?.admin && (
              <Link to="/admin/default-settings">
                <NavbarSkeleton.Item text="User Management" icon={<Icon name="account" size={14} />} />
              </Link>
            )}

            <button onClick={handleSettingsMenu}>
              <NavbarSkeleton.Item
                text={adminMenuItem.title}
                icon={adminMenuItem.iconName && <Icon name={adminMenuItem.iconName} size={14} />}
                active={showSettingMenu}
              />
            </button>
          </NavbarSkeleton.Group>
        </ScrollArea>

        {/*<NavbarAi />*/}
      </NavbarSkeleton.Content>

      <NavbarSkeleton.Footer>
        {!isEmpty(currentUser) ? (
          <NavbarUser
            currentUser={currentUser}
            handleCustomNav={handleCustomNav}
            handleLogOut={handleLogOut}
            useTranslationStore={useTranslationStore}
            useThemeStore={useThemeStore}
          />
        ) : (
          <Button onClick={() => navigate('/signin')}>Sign In</Button>
        )}
      </NavbarSkeleton.Footer>
    </NavbarSkeleton.Root>
  )
}
