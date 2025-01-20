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
} from '@/components'

export const LabelToolTip = ({
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
        <Button variant="ghost" size="icon">
          <Icon name="vertical-ellipsis" size={12} className="cursor-pointer text-tertiary-background" />
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
            Edit label
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-destructive"
            onClick={e => {
              e.stopPropagation()
              onDelete(identifier)
            }}
          >
            <DropdownMenuShortcut className="ml-0">
              <Icon name="trash" className="mr-2 text-destructive" />
            </DropdownMenuShortcut>
            Delete label
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
