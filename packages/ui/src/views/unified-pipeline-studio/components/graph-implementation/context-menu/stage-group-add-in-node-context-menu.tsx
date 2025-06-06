import { DropdownMenu } from '@components/dropdown-menu'
import { IconV2, Text } from '@components/index'

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
        <DropdownMenu.Item
          key={`add-${YamlEntityType.Stage}`}
          className="flex items-center gap-1.5"
          onSelect={() => {
            onAddIntention(contextMenuData.nodeData, 'in', YamlEntityType.Stage)
          }}
        >
          <IconV2 name="plus" size={12} className="text-cn-foreground-3" />
          <Text wrap="nowrap">Add Stage</Text>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item
          key={`add-${YamlEntityType.SerialStageGroup}`}
          className="flex items-center gap-1.5"
          onSelect={() => {
            onAddIntention(contextMenuData.nodeData, 'in', YamlEntityType.SerialStageGroup)
          }}
        >
          <IconV2 name="plus" size={12} className="text-cn-foreground-3" />
          <Text wrap="nowrap">Add Serial group</Text>
        </DropdownMenu.Item>
        <DropdownMenu.Item
          key={`add-${YamlEntityType.ParallelStageGroup}`}
          className="flex items-center gap-1.5"
          onSelect={() => {
            onAddIntention(contextMenuData.nodeData, 'in', YamlEntityType.ParallelStageGroup)
          }}
        >
          <IconV2 name="plus" size={12} className="text-cn-foreground-3" />
          <Text wrap="nowrap">Add Parallel group</Text>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
