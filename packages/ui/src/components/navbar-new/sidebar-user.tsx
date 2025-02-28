import { Link } from 'react-router-dom'

import { TypesUser } from '@/types'
import { Avatar } from '@components/avatar'
import { DropdownMenu } from '@components/dropdown-menu'
import { Icon } from '@components/icon'
import { Sidebar } from '@components/sidebar/sidebar'
import { getInitials } from '@utils/stringUtils'
import { TFunction } from 'i18next'

interface UserProps {
  user?: TypesUser
  openThemeDialog: () => void
  openLanguageDialog: () => void
  handleLogOut: () => void
  t: TFunction
}

export function User({ user, openThemeDialog, openLanguageDialog, handleLogOut, t }: UserProps) {
  const userName = user?.display_name || user?.uid || ''
  return (
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Sidebar.MenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground focus:ring-0"
            >
              <Avatar.Root className="h-8 w-8 rounded-lg">
                <Avatar.Image src={user?.url} alt="user" />
                <Avatar.Fallback className="rounded-lg">{getInitials(userName)}</Avatar.Fallback>
              </Avatar.Root>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{userName}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <Icon name="chevron-up-down" size={24} className="ml-auto" />
            </Sidebar.MenuButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side="right"
            align="end"
            sideOffset={4}
          >
            <DropdownMenu.Label className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar.Root className="h-8 w-8 rounded-lg">
                  <Avatar.Image src={user?.url} alt={userName} />
                  <Avatar.Fallback className="rounded-lg">{getInitials(userName)}</Avatar.Fallback>
                </Avatar.Root>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{userName}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenu.Label>
            <DropdownMenu.Separator />
            <DropdownMenu.Group>
              <DropdownMenu.Item asChild>
                <Link to="/profile-settings">
                  <Icon name="settings-1" size={14} />
                  &nbsp;&nbsp;{t('component:navbar.settings', 'Settings')}
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={openThemeDialog}>
                <Icon name="paint" size={14} />
                &nbsp;&nbsp;{t('component:navbar.appearence', 'Appearance')}
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={openLanguageDialog}>
                <Icon name="language" size={14} />
                &nbsp;&nbsp;{t('component:navbar.language', 'Language')}
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item onClick={handleLogOut}>
                <Icon name="logOut" size={14} />
                &nbsp;&nbsp;{t('component:navbar.logout', 'Logout')}
              </DropdownMenu.Item>
            </DropdownMenu.Group>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  )
}
