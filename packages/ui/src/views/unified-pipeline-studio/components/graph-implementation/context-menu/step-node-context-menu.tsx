import { DropdownMenu } from '@components/dropdown-menu'
import { Icon, Text } from '@components/index'

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
        <DropdownMenu.Item
          key="edit"
          className="flex items-center gap-1.5"
          onSelect={() => {
            onEditIntention(contextMenuData.nodeData)
          }}
        >
          <Icon name="edit-pen" size={12} className="text-tertiary-background" />
          <Text wrap="nowrap">Edit</Text>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item
          key="add-before"
          className="flex items-center gap-1.5"
          onSelect={() => {
            onAddIntention(contextMenuData.nodeData, 'before')
          }}
        >
          <Icon name="plus" size={12} className="text-tertiary-background" />
          <Text wrap="nowrap">Add before</Text>
        </DropdownMenu.Item>
        <DropdownMenu.Item
          key="add-after"
          className="flex items-center gap-1.5"
          onSelect={() => {
            onAddIntention(contextMenuData.nodeData, 'after') // TODO what to add
          }}
        >
          <Icon name="plus" size={12} className="text-tertiary-background" />
          <Text wrap="nowrap">Add after</Text>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        {/* <RevealDropdownMenuItem /> */}
        {/* <DropdownMenu.Separator /> */}
        <DropdownMenu.Item
          key="delete"
          className="flex items-center gap-1.5"
          onSelect={() => {
            onDeleteIntention(contextMenuData.nodeData)
          }}
        >
          <Icon name="trash" size={12} className="text-cn-foreground-1" />
          <Text wrap="nowrap">Delete</Text>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
