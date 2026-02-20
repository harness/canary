import { DropdownMenu } from '@harnessio/ui/components'

import { usePipelineStudioNodeContext } from '../context/UnifiedPipelineStudioNodeContext'
import { YamlEntityType } from '../types/yaml-entity-type'

export const StageGroupNodeContextMenu = () => {
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
          title="Add Serial Stages Group before"
          key={`add-${YamlEntityType.SerialStageGroup}-before`}
          onSelect={() => {
            onAddIntention(contextMenuData.nodeData, 'before', YamlEntityType.SerialStageGroup)
          }}
        />
        <DropdownMenu.IconItem
          icon="plus"
          title="Add Serial Stages Group after"
          key={`add-${YamlEntityType.SerialStageGroup}-after`}
          onSelect={() => {
            onAddIntention(contextMenuData.nodeData, 'after', YamlEntityType.SerialStageGroup)
          }}
        />
        <DropdownMenu.Separator />
        <DropdownMenu.IconItem
          icon="plus"
          title="Add Parallel Stages Group before"
          key={`add-${YamlEntityType.ParallelStageGroup}-before`}
          onSelect={() => {
            onAddIntention(contextMenuData.nodeData, 'before', YamlEntityType.ParallelStageGroup)
          }}
        />
        <DropdownMenu.IconItem
          icon="plus"
          title="Add Parallel Stages Group after"
          key={`add-${YamlEntityType.ParallelStageGroup}-after`}
          onSelect={() => {
            onAddIntention(contextMenuData.nodeData, 'after', YamlEntityType.ParallelStageGroup)
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
