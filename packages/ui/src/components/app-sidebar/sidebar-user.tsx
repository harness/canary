import { useRouterContext, useTranslation } from '@/context'
import { TypesUser } from '@/types'
import { Avatar } from '@components/avatar'
import { DropdownMenu } from '@components/dropdown-menu'
import { Layout } from '@components/layout'
import { Sidebar } from '@components/sidebar'
import { Text } from '@components/text'

interface AppSidebarUserProps {
  user?: TypesUser
  openThemeDialog: () => void
  openLanguageDialog: () => void
  handleLogOut: () => void
}

export const AppSidebarUser = ({ user, openThemeDialog, openLanguageDialog, handleLogOut }: AppSidebarUserProps) => {
  const { Link } = useRouterContext()
  const { t } = useTranslation()

  const userName = user?.display_name || user?.uid || ''

  return (
    <Sidebar.Item
      title={userName}
      description={user?.email}
      avatarFallback={userName}
      src={user?.url}
      dropdownMenuContent={
        <>
          <DropdownMenu.Header className="flex items-center gap-x-2">
            <Avatar name={userName} src={user?.url} size="lg" />
            <Layout.Grid className="gap-1">
              <Text variant="body-single-line-strong" color="foreground-1" truncate>
                {userName}
              </Text>
              <Text variant="caption-single-line-soft" color="foreground-3" truncate>
                {user?.email}
              </Text>
            </Layout.Grid>
          </DropdownMenu.Header>
          <DropdownMenu.Group>
            <Link to="/profile-settings">
              <DropdownMenu.IconItem icon="settings" title={t('component:navbar.settings', 'Settings')} />
            </Link>

            <DropdownMenu.IconItem
              icon="theme"
              onClick={openThemeDialog}
              title={t('component:navbar.appearance', 'Appearance')}
            />
            <DropdownMenu.IconItem
              icon="chat-bubble-translate"
              onClick={openLanguageDialog}
              title={t('component:navbar.language', 'Language')}
            />
          </DropdownMenu.Group>
          <DropdownMenu.Separator />
          <DropdownMenu.IconItem icon="logout" onClick={handleLogOut} title={t('component:navbar.logout', 'Logout')} />
        </>
      }
    />
  )
}
