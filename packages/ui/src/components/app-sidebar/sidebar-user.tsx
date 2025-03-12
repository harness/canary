import { useRouterContext } from '@/context'
import { TypesUser } from '@/types'
import { Avatar } from '@components/avatar'
import { DropdownMenu } from '@components/dropdown-menu'
import { Icon } from '@components/icon'
import { Sidebar } from '@components/sidebar/sidebar'
import { getInitials } from '@utils/stringUtils'
import { TFunction } from 'i18next'

const UserAvatar = ({ user }: Pick<UserProps, 'user'>) => {
  const userName = user?.display_name || user?.uid || ''

  return (
    <>
      <Avatar.Root className="size-8 rounded-lg">
        {!!user?.url && <Avatar.Image src={user.url} alt="user" />}
        <Avatar.Fallback className="bg-sidebar-background-5 text-sidebar-foreground-1 rounded-lg">
          {getInitials(userName)}
        </Avatar.Fallback>
      </Avatar.Root>
      <div className="text-13 grid flex-1 text-left leading-tight">
        <span className="text-sidebar-foreground-1 truncate font-medium">{userName}</span>
        <span className="text-sidebar-foreground-4 truncate">{user?.email}</span>
      </div>
    </>
  )
}

interface UserProps {
  user?: TypesUser
  openThemeDialog: () => void
  openLanguageDialog: () => void
  handleLogOut: () => void
  t: TFunction
}

export function User({ user, openThemeDialog, openLanguageDialog, handleLogOut, t }: UserProps) {
  const { Link } = useRouterContext()

  return (
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Sidebar.MenuButton size="lg" className="data-[state=open]:bg-sidebar-background-2">
              <UserAvatar user={user} />
            </Sidebar.MenuButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content
            className="border-sidebar-border-3 bg-sidebar-background-4 w-[--radix-dropdown-menu-trigger-width] min-w-56 !rounded-lg"
            side="right"
            align="end"
            sideOffset={4}
          >
            <DropdownMenu.Label className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5">
                <UserAvatar user={user} />
              </div>
            </DropdownMenu.Label>
            <DropdownMenu.Separator className="bg-sidebar-border-1" />
            <DropdownMenu.Group>
              <DropdownMenu.Item className="data-[highlighted]:bg-sidebar-background-2" asChild>
                <Link
                  to="/profile-settings"
                  className="text-sidebar-foreground-6 data-[highlighted]:text-sidebar-foreground-1 group gap-2.5"
                >
                  <Icon
                    className="text-sidebar-icon-3 group-hover:text-sidebar-icon-1 transition-colors"
                    name="settings-1"
                    size={12}
                  />
                  <span>{t('component:navbar.settings', 'Settings')}</span>
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="text-sidebar-foreground-6 data-[highlighted]:bg-sidebar-background-2 data-[highlighted]:text-sidebar-foreground-1 group gap-2.5"
                onClick={openThemeDialog}
              >
                <Icon
                  className="text-sidebar-icon-3 group-hover:text-sidebar-icon-1 transition-colors"
                  name="paint"
                  size={12}
                />
                <span>{t('component:navbar.appearence', 'Appearance')}</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="text-sidebar-foreground-6 data-[highlighted]:bg-sidebar-background-2 data-[highlighted]:text-sidebar-foreground-1 group gap-2.5"
                onClick={openLanguageDialog}
              >
                <Icon
                  className="text-sidebar-icon-3 group-hover:text-sidebar-icon-1 transition-colors"
                  name="language"
                  size={12}
                />
                <span>{t('component:navbar.language', 'Language')}</span>
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="bg-sidebar-border-1" />
              <DropdownMenu.Item
                className="text-sidebar-foreground-6 data-[highlighted]:bg-sidebar-background-2 data-[highlighted]:text-sidebar-foreground-1 group gap-2.5"
                onClick={handleLogOut}
              >
                <Icon
                  className="text-sidebar-icon-3 group-hover:text-sidebar-icon-1 transition-colors"
                  name="logOut"
                  size={12}
                />
                <span>{t('component:navbar.logout', 'Logout')}</span>
              </DropdownMenu.Item>
            </DropdownMenu.Group>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  )
}
