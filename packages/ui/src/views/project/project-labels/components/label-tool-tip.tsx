import { Button, DropdownMenu, Icon } from '@/components'

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
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="ghost" size="icon">
          <Icon name="vertical-ellipsis" size={12} className="cursor-pointer text-tertiary-background" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Group>
          <DropdownMenu.Item
            className="cursor-pointer"
            onClick={e => {
              e.stopPropagation()
              onEdit(identifier)
            }}
          >
            <DropdownMenu.Shortcut className="ml-0">
              <Icon name="edit-pen" className="mr-2" />
            </DropdownMenu.Shortcut>
            Edit label
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item
            className="cursor-pointer text-destructive"
            onClick={e => {
              e.stopPropagation()
              onDelete(identifier)
            }}
          >
            <DropdownMenu.Shortcut className="ml-0">
              <Icon name="trash" className="mr-2 text-destructive" />
            </DropdownMenu.Shortcut>
            Delete label
          </DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
