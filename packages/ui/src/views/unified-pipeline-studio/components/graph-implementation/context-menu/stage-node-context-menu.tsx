import { DropdownMenu } from '@components/dropdown-menu'

import { usePipelineStudioNodeContext } from '../context/UnifiedPipelineStudioNodeContext'
import { YamlEntityType } from '../types/yaml-entity-type'

export const StageNodeContextMenu = (): (() => React.ReactNode)[] | null | any => {
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
        className="absolute w-max"
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
          title="Add stage before"
          key="add-before"
          onSelect={() => {
            onAddIntention(contextMenuData.nodeData, 'before', YamlEntityType.Stage)
          }}
        />
        <DropdownMenu.IconItem
          icon="plus"
          title="Add stage after"
          key="add-after"
          onSelect={() => {
            onAddIntention(contextMenuData.nodeData, 'after', YamlEntityType.Stage)
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
