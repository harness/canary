import { Fragment, useMemo } from 'react'
import { Link } from 'react-router-dom'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Icon,
  Text
} from '@/components'
import { cn } from '@utils/cn'
import { getInitials } from '@utils/stringUtils'
import { TypesUser } from '@views/layouts/types'

import { userMenuItems } from '../data'
import { UserMenuKeys } from '../types'

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
        'relative group grid w-full grid-cols-[auto_1fr] grid-rows-2 items-center justify-start gap-x-2.5 text-left',
        className
      )}
    >
      {isButton && (
        <div className="group-hover:bg-background-4 group-data-[state=open]:bg-background-4 absolute -inset-2 rounded duration-100 ease-in-out" />
      )}
      <div className="col-start-1 row-span-2">
        <Avatar className="overflow-hidden rounded-md" size="8">
          {!!url && <AvatarImage src={url} alt="user" />}
          <AvatarFallback>{getInitials(username)}</AvatarFallback>
        </Avatar>
      </div>
      <p className="text-13 text-foreground-1 col-start-2 row-start-1 font-medium leading-none truncate">{username}</p>
      {!!email && (
        <p className="text-13 text-foreground-4 col-start-2 row-start-2 mt-0.5 font-normal leading-none truncate">
          {email}
        </p>
      )}
    </Tag>
  )
}

interface NavbarUserProps {
  currentUser: TypesUser | undefined
  handleCustomNav: () => void
  handleLogOut: () => void
}

export const NavbarUser = ({ currentUser, handleCustomNav, handleLogOut }: NavbarUserProps) => {
  const username = currentUser?.display_name || currentUser?.uid || ''

  const menuItems = useMemo(() => {
    return userMenuItems.map(({ key, iconName, title, to, isSeparated }) => {
      const className = 'relative grid grid-cols-[auto_1fr] items-center gap-2.5'

      const handleClick = () => {
        switch (key) {
          case UserMenuKeys.CUSTOM_NAV:
            return handleCustomNav()
          case UserMenuKeys.LOG_OUT:
            return handleLogOut()
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <UserBlock username={username} email={currentUser?.email} url={currentUser?.url} isButton />
        </div>
      </DropdownMenuTrigger>

      {menuItems && (
        <DropdownMenuContent
          className="bg-background-1 ml-3 w-[230px]"
          align="start"
          sideOffset={-40}
          alignOffset={187}
        >
          <UserBlock className="p-2" username={username} email={currentUser?.email} url={currentUser?.url} />
          <DropdownMenuSeparator />
          {menuItems.map(itm => {
            return (
              <Fragment key={itm.key}>
                {!!itm?.isSeparated && <DropdownMenuSeparator />}
                <DropdownMenuItem className="[&_svg]:data-[highlighted]:text-icons-2" asChild>
                  {itm.element}
                </DropdownMenuItem>
              </Fragment>
            )
          })}
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  )
}
