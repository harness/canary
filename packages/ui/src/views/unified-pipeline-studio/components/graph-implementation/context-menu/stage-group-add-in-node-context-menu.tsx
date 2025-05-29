import { DropdownMenu } from '@components/dropdown-menu'

import { usePipelineStudioNodeContext } from '../context/UnifiedPipelineStudioNodeContext'
import { YamlEntityType } from '../types/yaml-entity-type'

export const StageGroupAddInNodeContextMenu = () => {
  const { contextMenuData, onAddIntention, hideContextMenu } = usePipelineStudioNodeContext()

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
          icon="plus"
          title="Add Stage"
          key={`add-${YamlEntityType.Stage}`}
          className="flex items-center gap-1.5"
          onSelect={() => {
            onAddIntention(contextMenuData.nodeData, 'in', YamlEntityType.Stage)
          }}
        />
        <DropdownMenu.Separator />
        <DropdownMenu.IconItem
          icon="plus"
          title="Add Serial group"
          key={`add-${YamlEntityType.SerialStageGroup}`}
          className="flex items-center gap-1.5"
          onSelect={() => {
            onAddIntention(contextMenuData.nodeData, 'in', YamlEntityType.SerialStageGroup)
          }}
        />
        <DropdownMenu.IconItem
          icon="plus"
          title="Add Parallel group"
          key={`add-${YamlEntityType.ParallelStageGroup}`}
          className="flex items-center gap-1.5"
          onSelect={() => {
            onAddIntention(contextMenuData.nodeData, 'in', YamlEntityType.ParallelStageGroup)
          }}
        />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
