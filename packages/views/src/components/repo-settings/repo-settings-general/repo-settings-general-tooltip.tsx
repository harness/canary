import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  Icon
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
            }}
          >
            <DropdownMenuShortcut className="ml-0">
              <Icon name="edit-pen" className="mr-2" />
            </DropdownMenuShortcut>
            Edit rule
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive cursor-pointer"
            onClick={e => {
              e.stopPropagation()
              onDelete(identifier)
            }}
          >
            <DropdownMenuShortcut className="ml-0">
              <Icon name="trash" className="text-destructive mr-2" />
            </DropdownMenuShortcut>
            Delete rule
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
