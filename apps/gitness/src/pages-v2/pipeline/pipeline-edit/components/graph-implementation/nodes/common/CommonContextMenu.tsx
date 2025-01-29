import { ReactNode } from 'react'

import { DropdownMenu, Icon, Text } from '@harnessio/ui/components'

import { useNodeContext } from '../../../../context/NodeContextMenuProvider'
import { YamlEntityType } from '../../types/nodes'

export const CommonNodeContextMenu = () => {
  const {
    contextMenuData,
    hideContextMenu,
    deleteStep,
    addStep,
    addStage,
    editStep,
    addSerialGroup,
    addParallelGroup,
    revealInYaml
  } = useNodeContext()

  const showAddStepBeforeAfter =
    (contextMenuData?.nodeData.yamlEntityType === YamlEntityType.Step ||
      contextMenuData?.nodeData.yamlEntityType === YamlEntityType.StepParallelGroup ||
      contextMenuData?.nodeData.yamlEntityType === YamlEntityType.StepSerialGroup) &&
    !contextMenuData.isIn

  const showAddStageBeforeAfter =
    (contextMenuData?.nodeData.yamlEntityType === YamlEntityType.Stage ||
      contextMenuData?.nodeData.yamlEntityType === YamlEntityType.ParallelGroup ||
      contextMenuData?.nodeData.yamlEntityType === YamlEntityType.SerialGroup) &&
    !contextMenuData.isIn

  const showAddSerialParallelGroupBeforeAfter = showAddStageBeforeAfter

  const enableEdit =
    contextMenuData?.nodeData.yamlEntityType === YamlEntityType.Step ||
    contextMenuData?.nodeData.yamlEntityType === YamlEntityType.StepParallelGroup ||
    contextMenuData?.nodeData.yamlEntityType === YamlEntityType.StepSerialGroup

  const enableDelete = true

  const showAddStageIn =
    (contextMenuData?.nodeData.yamlEntityType === YamlEntityType.ParallelGroup ||
      contextMenuData?.nodeData.yamlEntityType === YamlEntityType.SerialGroup) &&
    contextMenuData.isIn

  const showAddSerialParallelGroupIn =
    (contextMenuData?.nodeData.yamlEntityType === YamlEntityType.ParallelGroup ||
      contextMenuData?.nodeData.yamlEntityType === YamlEntityType.SerialGroup) &&
    contextMenuData.isIn

  const showRevealInYaml = contextMenuData?.nodeData.yamlEntityType === YamlEntityType.Step

  const getMenu = () => {
    const menu: ReactNode[][] = []

    if (!contextMenuData?.isIn) {
      menu.push([
        <DropdownMenu.Item
          key="edit"
          disabled={!enableEdit}
          className="flex items-center gap-1.5"
          onSelect={() => {
            contextMenuData && editStep(contextMenuData.nodeData)
          }}
        >
          <Icon name="edit-pen" size={12} className="text-tertiary-background" />
          <Text>Edit</Text>
        </DropdownMenu.Item>
      ])
    }

    if (showAddStepBeforeAfter) {
      menu.push([
        <DropdownMenu.Item
          key="add-step-before"
          className="flex items-center gap-1.5"
          onSelect={() => {
            contextMenuData && addStep(contextMenuData.nodeData, 'before')
          }}
        >
          <Icon name="plus" size={12} className="text-tertiary-background" />
          <Text wrap="nowrap">Add step/group before</Text>
        </DropdownMenu.Item>,
        <DropdownMenu.Item
          key="add-step-after"
          className="flex items-center gap-1.5"
          onSelect={() => {
            contextMenuData && addStep(contextMenuData.nodeData, 'after')
          }}
        >
          <Icon name="plus" size={12} className="text-tertiary-background" />
          <Text wrap="nowrap">Add step/group after</Text>
        </DropdownMenu.Item>
      ])
    }

    if (showAddStageBeforeAfter) {
      menu.push([
        <DropdownMenu.Item
          key="add-stage-before"
          className="flex items-center gap-1.5"
          onSelect={() => {
            contextMenuData && addStage(contextMenuData.nodeData, 'before')
          }}
        >
          <Icon name="plus" size={12} className="text-tertiary-background" />
          <Text wrap="nowrap">Add stage before</Text>
        </DropdownMenu.Item>,
        <DropdownMenu.Item
          key="add-stage-after"
          className="flex items-center gap-1.5"
          onSelect={() => {
            contextMenuData && addStage(contextMenuData.nodeData, 'after')
          }}
        >
          <Icon name="plus" size={12} className="text-tertiary-background" />
          <Text wrap="nowrap">Add stage after</Text>
        </DropdownMenu.Item>
      ])
    }

    if (showAddSerialParallelGroupBeforeAfter) {
      menu.push([
        <DropdownMenu.Item
          key="add-serial-group-before"
          className="flex items-center gap-1.5"
          onSelect={() => {
            contextMenuData && addSerialGroup(contextMenuData.nodeData, 'before')
          }}
        >
          <Icon name="plus" size={12} className="text-tertiary-background" />
          <Text wrap="nowrap">Add serial group before</Text>
        </DropdownMenu.Item>,
        <DropdownMenu.Item
          key="add-serial-group-after"
          className="flex items-center gap-1.5"
          onSelect={() => {
            contextMenuData && addSerialGroup(contextMenuData.nodeData, 'after')
          }}
        >
          <Icon name="plus" size={12} className="text-tertiary-background" />
          <Text wrap="nowrap">Add serial group after</Text>
        </DropdownMenu.Item>
      ])

      menu.push([
        <DropdownMenu.Item
          key="add-parallel-group-before"
          className="flex items-center gap-1.5"
          onSelect={() => {
            contextMenuData && addParallelGroup(contextMenuData.nodeData, 'before')
          }}
        >
          <Icon name="plus" size={12} className="text-tertiary-background" />
          <Text wrap="nowrap">Add parallel group before</Text>
        </DropdownMenu.Item>,
        <DropdownMenu.Item
          key="add-parallel-group-after"
          className="flex items-center gap-1.5"
          onSelect={() => {
            contextMenuData && addParallelGroup(contextMenuData.nodeData, 'after')
          }}
        >
          <Icon name="plus" size={12} className="text-tertiary-background" />
          <Text wrap="nowrap">Add parallel group after</Text>
        </DropdownMenu.Item>
      ])
    }

    if (showAddStageIn) {
      menu.push([
        <DropdownMenu.Item
          key="add-stage"
          className="flex items-center gap-1.5"
          onSelect={() => {
            contextMenuData && addStage(contextMenuData.nodeData, 'in')
          }}
        >
          <Icon name="plus" size={12} className="text-tertiary-background" />
          <Text wrap="nowrap">Add stage</Text>
        </DropdownMenu.Item>
      ])
    }

    if (showAddSerialParallelGroupIn) {
      menu.push([
        <DropdownMenu.Item
          key="add-serial-group"
          className="flex items-center gap-1.5"
          onSelect={() => {
            contextMenuData && addSerialGroup(contextMenuData.nodeData, 'in')
          }}
        >
          <Icon name="plus" size={12} className="text-tertiary-background" />
          <Text wrap="nowrap">Add serial group</Text>
        </DropdownMenu.Item>
      ])

      menu.push([
        <DropdownMenu.Item
          key="add-parallel-group"
          className="flex items-center gap-1.5"
          onSelect={() => {
            contextMenuData && addParallelGroup(contextMenuData.nodeData, 'in')
          }}
        >
          <Icon name="plus" size={12} className="text-tertiary-background" />
          <Text wrap="nowrap">Add parallel group</Text>
        </DropdownMenu.Item>
      ])
    }

    if (showRevealInYaml) {
      menu.push([
        <DropdownMenu.Item
          key="edit"
          disabled={!enableEdit}
          className="flex items-center gap-1.5"
          onSelect={() => {
            contextMenuData && revealInYaml(contextMenuData.nodeData.yamlPath)
          }}
        >
          <Icon name="circle" size={12} className="text-tertiary-background" />
          <Text>Reveal in Yaml</Text>
        </DropdownMenu.Item>
      ])
    }

    if (!contextMenuData?.isIn) {
      menu.push([
        <DropdownMenu.Item
          key="delete"
          disabled={!enableDelete}
          className="flex items-center gap-1.5"
          onSelect={() => {
            contextMenuData && deleteStep(contextMenuData.nodeData)
          }}
        >
          <Icon name="trash" size={12} className="text-primary" />
          <Text>Delete</Text>
        </DropdownMenu.Item>
      ])
    }

    return menu
  }

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
        {getMenu().map((menuItem, idx) => {
          return idx !== 0 ? (
            <>
              <DropdownMenu.Separator />
              {menuItem}
            </>
          ) : (
            menuItem
          )
        })}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
