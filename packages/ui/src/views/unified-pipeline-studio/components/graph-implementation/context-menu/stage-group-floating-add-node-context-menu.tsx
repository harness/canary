import { DropdownMenu } from '@components/dropdown-menu'
import { Icon, Text } from '@components/index'

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
        <DropdownMenu.Item
          key={`add-${YamlEntityType.SerialStageGroup}-before`}
          className="flex items-center gap-1.5"
          onSelect={() => {
            onAddIntention(contextMenuData.nodeData, outsidePosition, YamlEntityType.SerialStageGroup)
          }}
        >
          <Icon name="plus" size={12} className="text-cn-foreground-3" />
          <Text wrap="nowrap">Add Serial Stages Group</Text>
        </DropdownMenu.Item>

        <DropdownMenu.Separator />
        <DropdownMenu.Item
          key={`add-${YamlEntityType.ParallelStageGroup}-before`}
          className="flex items-center gap-1.5"
          onSelect={() => {
            onAddIntention(contextMenuData.nodeData, outsidePosition, YamlEntityType.ParallelStageGroup)
          }}
        >
          <Icon name="plus" size={12} className="text-cn-foreground-3" />
          <Text wrap="nowrap">Add Parallel Stages Group</Text>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
