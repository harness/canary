import { Fragment } from 'react'

import { getInitials } from '@/utils/StringUtils'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '..'

interface UserItem {
  element: React.ReactNode
  key: string
  isSeparated?: boolean
}

interface UserBlockProps {
  username: string
  role?: string
  url?: string
  isButton?: boolean
  className?: string
}

const UserBlock = ({ username, role, url, isButton = false, className }: UserBlockProps) => {
  const Tag = isButton ? 'button' : 'div'

  return (
    <Tag
      className={cn(
        'relative grid w-full grid-cols-[auto_1fr] grid-rows-2 items-center justify-start gap-x-2.5 text-left',
        className
      )}
    >
      {isButton && (
        <div className="group-hover:bg-background-4 group-data-[state=open]:bg-background-4 absolute -inset-2 rounded duration-100 ease-in-out" />
      )}
      <div className="col-start-1 row-span-2">
        <Avatar className="overflow-hidden rounded-md" size="8">
          {url && <AvatarImage src={url} alt="user" />}
          <AvatarFallback>{getInitials(username)}</AvatarFallback>
        </Avatar>
      </div>
      <p className="text-13 text-foreground-1 col-start-2 row-start-1 font-medium leading-none">{username}</p>
      {!!role && (
        <p className="text-13 text-foreground-4 col-start-2 row-start-2 mt-0.5 font-normal leading-none">{role}</p>
      )}
    </Tag>
  )
}

const Root: React.FC<{
  username: string
  role?: string
  url?: string
  menuItems?: UserItem[]
}> = ({ username, role, url, menuItems }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <UserBlock username={username} role={role} url={url} isButton />
        </div>
      </DropdownMenuTrigger>
      {menuItems && (
        <DropdownMenuContent
          className="bg-background-1 ml-3 w-[230px]"
          align="start"
          sideOffset={-40}
          alignOffset={187}
        >
          <UserBlock className="p-2" username={username} role={role} url={url} />
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

export { Root }
