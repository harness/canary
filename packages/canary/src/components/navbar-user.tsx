import { getInitials } from '@/utils/StringUtils'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '..'

interface items {
  element: React.ReactNode
  key: number
}

const Root: React.FC<{
  username?: string
  isAdmin?: boolean
  url?: string
  menuItems?: items[]
}> = ({ username, isAdmin, url, menuItems }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="group relative grid cursor-pointer grid-cols-[auto_1fr] grid-rows-2 items-center justify-start gap-x-3">
          <div className="group-hover:bg-primary/5 absolute -inset-2 rounded-md duration-100 ease-in-out" />
          <div className="col-start-1 row-span-2">
            <Avatar className="overflow-hidden rounded-md">
              {url && <AvatarImage src={url} alt="user" />}
              {username && <AvatarFallback>{getInitials(username)}</AvatarFallback>}
            </Avatar>
          </div>
          <p className="text-primary col-start-2 row-start-1 text-xs font-medium">{username}</p>
          <p className="text-tertiary-background col-start-2 row-start-2 text-xs font-normal">
            {isAdmin ? 'Admin' : 'Account Member'}
          </p>
        </div>
      </DropdownMenuTrigger>
      {menuItems && (
        <DropdownMenuContent align="end" className="mb-2 w-[180px]">
          {menuItems.map(itm => {
            return (
              <DropdownMenuItem asChild key={itm.key}>
                {itm.element}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  )
}

export { Root }
