import { Avatar } from '@components/avatar'
import { DropdownMenu } from '@components/dropdown-menu'
import { Icon } from '@components/icon'
import { Sidebar } from '@components/sidebar/sidebar'
import { getInitials } from '@utils/stringUtils'
import { TFunction } from 'i18next'

interface UserProps {
  user: {
    display_name?: string
    uid?: string
    url: string
    email: string
    // avatar: string
  }
  openThemeDialog: () => void
  openLanguageDialog: () => void
  t: TFunction
}

export function User({ user, openThemeDialog, openLanguageDialog, t }: UserProps) {
  const userName = user?.display_name || user?.uid || ''
  return (
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Sidebar.MenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar.Root className="h-8 w-8 rounded-lg">
                <Avatar.Image src={user.url} alt="user" />
                <Avatar.Fallback className="rounded-lg">{getInitials(userName)}</Avatar.Fallback>
              </Avatar.Root>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{userName}</span>
                <span className="truncate text-xs">{user.email}</span>
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
                  <Avatar.Image src={user.url} alt={userName} />
                  <Avatar.Fallback className="rounded-lg">SM</Avatar.Fallback>
                </Avatar.Root>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{userName}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenu.Label>
            <DropdownMenu.Separator />
            <DropdownMenu.Group>
              <DropdownMenu.Item onClick={openThemeDialog}>
                <Icon name="settings-1" size={14} />
                &nbsp;&nbsp;{t('component:navbar.settings', 'Settings')}
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={openThemeDialog}>
                <Icon name="paint" size={14} />
                &nbsp;&nbsp;{t('component:navbar.appearence', 'Appearance')}
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={openLanguageDialog}>
                <LanguageIcon />
                &nbsp;&nbsp;{t('component:navbar.language', 'Language')}
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item>
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

const LanguageIcon = () => (
  <svg x="0px" y="0px" width="18px" height="18px" viewBox="0 0 18 18" style={{ width: '18px', height: '18px' }}>
    <line
      x1="2.25"
      y1="4.25"
      x2="10.25"
      y2="4.25"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    ></line>
    <line
      x1="6.25"
      y1="2.25"
      x2="6.25"
      y2="4.25"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    ></line>
    <path
      d="M4.25,4.25c.091,2.676,1.916,4.981,4.5,5.684"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    ></path>
    <path
      d="M8.25,4.25c-.4,5.625-6,6-6,6"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    ></path>
    <polyline
      points="9.25 15.75 12.25 7.75 12.75 7.75 15.75 15.75"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    ></polyline>
    <line
      x1="10.188"
      y1="13.25"
      x2="14.813"
      y2="13.25"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    ></line>
  </svg>
)
