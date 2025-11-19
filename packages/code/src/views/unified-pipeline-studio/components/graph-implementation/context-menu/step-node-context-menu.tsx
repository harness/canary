import { DropdownMenu } from '@harnessio/ui/components'

import { usePipelineStudioNodeContext } from '../context/UnifiedPipelineStudioNodeContext'

export const StepNodeContextMenu = (): (() => React.ReactNode)[] | null | any => {
  const { contextMenuData, onAddIntention, hideContextMenu, onEditIntention, onDeleteIntention } =
    usePipelineStudioNodeContext()

  if (!contextMenuData) return null

  return (
    <DropdownMenu.Root
      open={!!contextMenuData}
      onOpenChange={open => {
        if (open === false) {
          hideContextMenu()
        }
      }}
    >
      <DropdownMenu.Content
        align="end"
        className="absolute"
        style={{ left: `${contextMenuData?.position.x}px`, top: `${contextMenuData?.position.y}px` }}
      >
        <DropdownMenu.IconItem
          icon="edit-pencil"
          title="Edit"
          key="edit"
          onSelect={() => {
            onEditIntention(contextMenuData.nodeData)
          }}
        />
        <DropdownMenu.Separator />
        <DropdownMenu.IconItem
          icon="plus"
          title="Add before"
          key="add-before"
          onSelect={() => {
            onAddIntention(contextMenuData.nodeData, 'before')
          }}
        />
        <DropdownMenu.IconItem
          icon="plus"
          title="Add after"
          key="add-after"
          onSelect={() => {
            onAddIntention(contextMenuData.nodeData, 'after') // TODO what to add
          }}
        />
        <DropdownMenu.Separator />
        <DropdownMenu.IconItem
          icon="trash"
          title="Delete"
          key="delete"
          onSelect={() => {
            onDeleteIntention(contextMenuData.nodeData)
          }}
        />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
