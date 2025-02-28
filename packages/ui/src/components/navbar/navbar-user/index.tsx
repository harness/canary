import { useMemo } from 'react'

import {
  Avatar,
  ColorType,
  ContrastType,
  DropdownMenu,
  FullTheme,
  getModeColorContrastFromFullTheme,
  Icon,
  IThemeStore,
  ModeType,
  Text
} from '@/components'
import { useRouterContext } from '@/context'
import { TypesUser } from '@/types'
import { cn } from '@utils/cn'
import { getInitials } from '@utils/stringUtils'
import { TranslationStore } from '@views/repo'

interface UserBlockProps {
  username: string
  email?: string
  url?: string
  isButton?: boolean
  className?: string
}

const UserBlock = ({ username, email, url, isButton = false, className }: UserBlockProps) => {
  const Tag = isButton ? 'button' : 'div'

  return (
    <Tag
      className={cn(
        'relative grid w-full grid-cols-[auto_1fr] grid-rows-2 items-center justify-start gap-x-2.5 text-left',
        className
      )}
    >
      {isButton && (
        <div className="absolute -inset-2 rounded duration-100 ease-in-out group-hover:bg-background-4 group-data-[state=open]:bg-background-4" />
      )}
      <div className="col-start-1 row-span-2">
        <Avatar.Root className="rounded-md" size="8">
          {!!url && <Avatar.Image src={url} alt="user" />}
          <Avatar.Fallback>{getInitials(username)}</Avatar.Fallback>
        </Avatar.Root>
      </div>
      <p className="col-start-2 row-start-1 truncate text-13 font-medium leading-tight text-foreground-1">{username}</p>
      {!!email && (
        <p className="col-start-2 row-start-2 truncate text-13 font-normal leading-tight text-foreground-4">{email}</p>
      )}
    </Tag>
  )
}

interface NavbarUserProps {
  currentUser: TypesUser | undefined
  handleCustomNav: () => void
  handleLogOut: () => void
  useThemeStore: () => IThemeStore
  useTranslationStore: () => TranslationStore
}

export const NavbarUser = ({
  currentUser,
  handleCustomNav,
  handleLogOut,
  useThemeStore,
  useTranslationStore
}: NavbarUserProps) => {
  const { Link } = useRouterContext()
  const username = currentUser?.display_name || currentUser?.uid || ''
  const { theme, setTheme } = useThemeStore()
  const { t, i18n, changeLanguage } = useTranslationStore()
  const { mode, color, contrast } = useMemo(() => getModeColorContrastFromFullTheme(theme), [theme])

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <div>
          <UserBlock username={username} email={currentUser?.email} url={currentUser?.url} isButton />
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        className="ml-3 w-[230px] !rounded-lg bg-background-1"
        align="start"
        sideOffset={-40}
        alignOffset={187}
      >
        <UserBlock className="p-2" username={username} email={currentUser?.email} url={currentUser?.url} />
        <DropdownMenu.Separator />
        <DropdownMenu.Item asChild>
          <Link to="/profile-settings">
            <Icon size={12} name="user" className="mr-2" />
            <Text>{t('component:navbar.profile', 'Profile')}</Text>
          </Link>
        </DropdownMenu.Item>
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>
            <Icon size={12} name="paint" className="mr-2" />
            <Text>{t('component:navbar.theme', 'Theme')}</Text>
          </DropdownMenu.SubTrigger>
          <DropdownMenu.Portal>
            <DropdownMenu.SubContent>
              <DropdownMenu.Item disabled>Color Scheme</DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.RadioGroup
                value={mode}
                onValueChange={value => {
                  setTheme(`${value}-${color}-${contrast}` as FullTheme)
                }}
              >
                <DropdownMenu.RadioItem value={ModeType.System}>System</DropdownMenu.RadioItem>
                <DropdownMenu.RadioItem value={ModeType.Light}>Light</DropdownMenu.RadioItem>
                <DropdownMenu.RadioItem value={ModeType.Dark}>Dark</DropdownMenu.RadioItem>
              </DropdownMenu.RadioGroup>
              <DropdownMenu.Item disabled>Color Correction</DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.RadioGroup
                value={color}
                onValueChange={value => {
                  setTheme(`${mode}-${value}-${contrast}` as FullTheme)
                }}
              >
                <DropdownMenu.RadioItem value={ColorType.Standard}>None</DropdownMenu.RadioItem>
                <DropdownMenu.RadioItem value={ColorType.ProtanopiaAndDeuteranopia}>Red-Green</DropdownMenu.RadioItem>
                <DropdownMenu.RadioItem value={ColorType.Tritanopia}>Blue-Yellow</DropdownMenu.RadioItem>
              </DropdownMenu.RadioGroup>
              <DropdownMenu.Item disabled>Contrast</DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.RadioGroup
                value={contrast}
                onValueChange={value => {
                  setTheme(`${mode}-${color}-${value}` as FullTheme)
                }}
              >
                <DropdownMenu.RadioItem value={ContrastType.Standard}>Standard</DropdownMenu.RadioItem>
                <DropdownMenu.RadioItem value={ContrastType.Low}>Low</DropdownMenu.RadioItem>
                <DropdownMenu.RadioItem value={ContrastType.High}>High</DropdownMenu.RadioItem>
              </DropdownMenu.RadioGroup>
            </DropdownMenu.SubContent>
          </DropdownMenu.Portal>
        </DropdownMenu.Sub>
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>
            <Icon size={12} name="environment" className="mr-2" />
            <Text>Language</Text>
          </DropdownMenu.SubTrigger>
          <DropdownMenu.Portal>
            <DropdownMenu.SubContent>
              <DropdownMenu.RadioGroup
                value={i18n.language}
                onValueChange={value => {
                  changeLanguage(value)
                }}
              >
                <DropdownMenu.RadioItem value="en">English</DropdownMenu.RadioItem>
                <DropdownMenu.RadioItem value="fr">French</DropdownMenu.RadioItem>
                <DropdownMenu.RadioItem value="system">System</DropdownMenu.RadioItem>
              </DropdownMenu.RadioGroup>
            </DropdownMenu.SubContent>
          </DropdownMenu.Portal>
        </DropdownMenu.Sub>
        <DropdownMenu.Item onClick={handleCustomNav}>
          <Icon size={12} name="navigation" className="mr-2" />
          <Text>{t('component:navbar.customNav', 'Customize navigation')}</Text>
        </DropdownMenu.Item>

        <DropdownMenu.Separator />
        <DropdownMenu.Item onClick={handleLogOut}>
          <Icon size={12} name="logOut" className="mr-2" />
          <Text>{t('component:navbar.logout', 'Log out')}</Text>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
