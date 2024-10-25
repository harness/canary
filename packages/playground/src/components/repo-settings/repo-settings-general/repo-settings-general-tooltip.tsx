import React from 'react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Icon,
  Button,
  DropdownMenuGroup
} from '@harnessio/canary'

export const RepoSettingsToolTip = ({
  onEdit,
  identifier,
  onDelete
}: {
  onEdit: (identifier: string) => void
  identifier: string
  onDelete: (identifier: string) => void
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="xs">
          <Icon name="vertical-ellipsis" size={14} className="text-tertiary-background cursor-pointer" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={e => {
              e.stopPropagation()
              onEdit(identifier)
            }}>
            <DropdownMenuShortcut className="ml-0">
              <Icon name="edit-pen" className="mr-2" />
            </DropdownMenuShortcut>
            Edit rule
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-destructive"
            onClick={e => {
              e.stopPropagation()
              onDelete(identifier)
            }}>
            <DropdownMenuShortcut className="ml-0">
              <Icon name="trash" className="mr-2 text-destructive" />
            </DropdownMenuShortcut>
            Delete rule
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
