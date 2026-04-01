import { useMemo } from 'react'

import { DropdownMenu, type SidebarItemProps } from '@harnessio/ui/components'
import { useRouterContext, useTheme, type FullTheme } from '@harnessio/ui/context'

const LIGHT_THEME = 'light-std-std' as FullTheme
const DARK_THEME = 'dark-std-std' as FullTheme

const footerUserMenuProfile = 'Profile'
const footerUserMenuDocumentation = 'Documentation'
const footerUserMenuTheme = 'Theme'
const footerUserMenuPrivacy = 'Privacy'
const footerUserMenuLogout = 'Logout'

const footerUserSidebarTitle = 'vardan.bansal@harness.io'
const footerUserAvatarName = 'Vardan Bansal'

const footerDocumentationUrl = 'https://developer.harness.io/'

/** Demo footer row as `Sidebar.Item` props (dropdown + theme toggle). */
export function useDemoAppNavFooterItem(): SidebarItemProps {
  const { Link } = useRouterContext()
  const { theme, setTheme } = useTheme()
  const isLight = theme === LIGHT_THEME

  return useMemo(
    () => ({
      title: footerUserSidebarTitle,
      avatarFallback: footerUserAvatarName,
      dropdownMenuContent: (
        <>
          <DropdownMenu.Group>
            <Link to="/profile">
              <DropdownMenu.IconItem icon="user" title={footerUserMenuProfile} />
            </Link>
          </DropdownMenu.Group>
          <DropdownMenu.Separator />
          <DropdownMenu.Group>
            <DropdownMenu.IconItem
              icon="empty-page"
              title={footerUserMenuDocumentation}
              onSelect={e => {
                e.preventDefault()
                window.open(footerDocumentationUrl, '_blank', 'noopener,noreferrer')
              }}
            />
            <DropdownMenu.IconItem
              icon="theme"
              title={footerUserMenuTheme}
              onSelect={e => {
                e.preventDefault()
                setTheme(isLight ? DARK_THEME : LIGHT_THEME)
              }}
            />
            <Link to="/privacy">
              <DropdownMenu.IconItem icon="shield" title={footerUserMenuPrivacy} />
            </Link>
          </DropdownMenu.Group>
          <DropdownMenu.Separator />
          <DropdownMenu.IconItem
            icon="logout"
            title={footerUserMenuLogout}
            onSelect={e => {
              e.preventDefault()
            }}
          />
        </>
      )
    }),
    [Link, isLight, setTheme]
  )
}
