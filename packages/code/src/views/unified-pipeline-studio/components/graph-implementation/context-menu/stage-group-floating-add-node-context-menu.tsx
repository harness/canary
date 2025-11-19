import { DropdownMenu } from '@harnessio/ui/components'

import { usePipelineStudioNodeContext } from '../context/UnifiedPipelineStudioNodeContext'
import { YamlEntityType } from '../types/yaml-entity-type'

export const StageGroupFloatingAddNodeContextMenu = ({ outsidePosition }: { outsidePosition: 'before' | 'after' }) => {
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
          title="Add Serial Stages Group"
          key={`add-${YamlEntityType.SerialStageGroup}-before`}
          onSelect={() => {
            onAddIntention(contextMenuData.nodeData, outsidePosition, YamlEntityType.SerialStageGroup)
          }}
        />
        <DropdownMenu.Separator />
        <DropdownMenu.IconItem
          icon="plus"
          title="Add Parallel Stages Group"
          key={`add-${YamlEntityType.ParallelStageGroup}-before`}
          onSelect={() => {
            onAddIntention(contextMenuData.nodeData, outsidePosition, YamlEntityType.ParallelStageGroup)
          }}
        />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
