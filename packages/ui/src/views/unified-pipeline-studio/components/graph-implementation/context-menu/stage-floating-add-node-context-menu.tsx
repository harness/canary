import { DropdownMenu } from '@components/index'

import { usePipelineStudioNodeContext } from '../context/UnifiedPipelineStudioNodeContext'
import { YamlEntityType } from '../types/yaml-entity-type'

export const StageFloatingAddNodeContextMenu = ({
  outsidePosition
}: {
  outsidePosition: 'before' | 'after'
}): (() => React.ReactNode)[] | null | any => {
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
          title="Add stage"
          key="add-before"
          onSelect={() => {
            onAddIntention(contextMenuData.nodeData, outsidePosition, YamlEntityType.Stage)
          }}
        />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
