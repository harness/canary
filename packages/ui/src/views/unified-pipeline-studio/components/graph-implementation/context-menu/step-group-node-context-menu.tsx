import { DropdownMenu } from '@components/dropdown-menu'

import { usePipelineStudioNodeContext } from '../context/UnifiedPipelineStudioNodeContext'

export const StepGroupNodeContextMenu = () => {
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
          icon="edit-pen"
          title="Edit"
          key="edit"
          className="flex items-center gap-1.5"
          onSelect={() => {
            onEditIntention(contextMenuData.nodeData)
          }}
        />
        <DropdownMenu.Separator />
        <DropdownMenu.IconItem
          icon="plus"
          title="Add before"
          key="add-before"
          className="flex items-center gap-1.5"
          onSelect={() => {
            onAddIntention(contextMenuData.nodeData, 'before')
          }}
        />
        <DropdownMenu.IconItem
          icon="plus"
          title="Add after"
          key="add-after"
          className="flex items-center gap-1.5"
          onSelect={() => {
            onAddIntention(contextMenuData.nodeData, 'after')
          }}
        />
        <DropdownMenu.Separator />
        <DropdownMenu.IconItem
          icon="trash"
          title="Delete"
          key="delete"
          className="flex items-center gap-1.5"
          onSelect={() => {
            onDeleteIntention(contextMenuData.nodeData)
          }}
        />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
