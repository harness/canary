import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icon
} from '@harnessio/canary'

import { MembersProps } from './interfaces'

interface moreActionsProps {
  member: MembersProps
  onDelete: (member: MembersProps) => void
}

export const moreActionsDropdown = ({ member, onDelete }: moreActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="xs">
          <Icon name="vertical-ellipsis" size={14} className="text-tertiary-background cursor-pointer" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="bg-primary-background w-[180px] rounded-[10px] border border-gray-800 py-2 shadow-sm"
        onCloseAutoFocus={event => event.preventDefault()} // Prevent focus on hidden content
      >
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer px-3 text-red-400 hover:text-red-400 focus:text-red-400"
            onSelect={() => onDelete(member)}
          >
            Remove member
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
