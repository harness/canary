import { DropdownMenu } from '@components/dropdown-menu'
import { Icon } from '@components/icon'
import { Text } from '@components/text'

import { usePipelineStudioNodeContext } from '../context/PipelineStudioNodeContext'
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
          key="add"
          className="flex items-center gap-1.5"
          onSelect={() => {
            onAddIntention(contextMenuData.nodeData, 'in', YamlEntityType.Stage)
          }}
        >
          <Icon name="plus" size={12} className="text-tertiary-background" />
          <Text wrap="nowrap">Add Stage</Text>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item
          key="add"
          className="flex items-center gap-1.5"
          onSelect={() => {
            onAddIntention(contextMenuData.nodeData, 'in', YamlEntityType.SerialStageGroup)
          }}
        >
          <Icon name="plus" size={12} className="text-tertiary-background" />
          <Text wrap="nowrap">Add Serial group</Text>
        </DropdownMenu.Item>
        <DropdownMenu.Item
          key="add"
          className="flex items-center gap-1.5"
          onSelect={() => {
            onAddIntention(contextMenuData.nodeData, 'in', YamlEntityType.ParallelStageGroup)
          }}
        >
          <Icon name="plus" size={12} className="text-tertiary-background" />
          <Text wrap="nowrap">Add Parallel group</Text>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
