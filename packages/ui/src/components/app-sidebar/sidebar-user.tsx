import { useRouterContext, useTranslation } from '@/context'
import { TypesUser } from '@/types'
import { Avatar } from '@components/avatar'
import { DropdownMenu } from '@components/dropdown-menu'
import { Sidebar } from '@components/sidebar/sidebar'

const UserAvatar = ({ user }: Pick<UserProps, 'user'>) => {
  const userName = user?.display_name || user?.uid || ''

  return (
    <div className="flex items-center gap-2">
      <Avatar name={userName} src={user?.url} rounded className="mr-2" />
      <div className="grid flex-1 text-left text-2 leading-tight">
        <span className="truncate font-medium text-sidebar-foreground-1">{userName}</span>
        <span className="truncate text-sidebar-foreground-4">{user?.email}</span>
      </div>
    </div>
  )
}

interface UserProps {
  user?: TypesUser
  openThemeDialog: () => void
  openLanguageDialog: () => void
  handleLogOut: () => void
}

export function User({ user, openThemeDialog, openLanguageDialog, handleLogOut }: UserProps) {
  const { Link } = useRouterContext()
  const { t } = useTranslation()

  return (
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Sidebar.MenuButton
              size="lg"
              className="px-[9px] transition-[padding] duration-150 ease-linear data-[state=open]:bg-sidebar-background-2 group-data-[state=collapsed]:px-[7px]"
            >
              <UserAvatar user={user} />
            </Sidebar.MenuButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content side="right" align="end" sideOffset={4}>
            <DropdownMenu.Header>
              <UserAvatar user={user} />
            </DropdownMenu.Header>
            <DropdownMenu.Group>
              <Link to="/profile-settings">
                <DropdownMenu.IconItem icon="settings" title={t('component:navbar.settings', 'Settings')} />
              </Link>

              <DropdownMenu.IconItem
                icon="theme"
                onClick={openThemeDialog}
                title={t('component:navbar.appearence', 'Appearance')}
              />
              <DropdownMenu.IconItem
                icon="chat-bubble-translate"
                onClick={openLanguageDialog}
                title={t('component:navbar.language', 'Language')}
              />
            </DropdownMenu.Group>
            <DropdownMenu.Separator className="bg-sidebar-border-1" />
            <DropdownMenu.IconItem
              icon="logout"
              onClick={handleLogOut}
              title={t('component:navbar.logout', 'Logout')}
            />
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  )
}
