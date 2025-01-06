import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Icon,
  Text
} from '@harnessio/ui/components'

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
    const menu: React.ReactNode[][] = []

    if (!contextMenuData?.isIn) {
      menu.push([
        <DropdownMenuItem
          key="edit"
          disabled={!enableEdit}
          className="flex items-center gap-1.5"
          onSelect={() => {
            contextMenuData && editStep(contextMenuData.nodeData)
          }}
        >
          <Icon name="edit-pen" size={12} className="text-tertiary-background" />
          <Text>Edit</Text>
        </DropdownMenuItem>
      ])
    }

    if (showAddStepBeforeAfter) {
      menu.push([
        <DropdownMenuItem
          key="add-step-before"
          className="flex items-center gap-1.5"
          onSelect={() => {
            contextMenuData && addStep(contextMenuData.nodeData, 'before')
          }}
        >
          <Icon name="plus" size={12} className="text-tertiary-background" />
          <Text wrap="nowrap">Add step/group before</Text>
        </DropdownMenuItem>,
        <DropdownMenuItem
          key="add-step-after"
          className="flex items-center gap-1.5"
          onSelect={() => {
            contextMenuData && addStep(contextMenuData.nodeData, 'after')
          }}
        >
          <Icon name="plus" size={12} className="text-tertiary-background" />
          <Text wrap="nowrap">Add step/group after</Text>
        </DropdownMenuItem>
      ])
    }

    if (showAddStageBeforeAfter) {
      menu.push([
        <DropdownMenuItem
          key="add-stage-before"
          className="flex items-center gap-1.5"
          onSelect={() => {
            contextMenuData && addStage(contextMenuData.nodeData, 'before')
          }}
        >
          <Icon name="plus" size={12} className="text-tertiary-background" />
          <Text wrap="nowrap">Add stage before</Text>
        </DropdownMenuItem>,
        <DropdownMenuItem
          key="add-stage-after"
          className="flex items-center gap-1.5"
          onSelect={() => {
            contextMenuData && addStage(contextMenuData.nodeData, 'after')
          }}
        >
          <Icon name="plus" size={12} className="text-tertiary-background" />
          <Text wrap="nowrap">Add stage after</Text>
        </DropdownMenuItem>
      ])
    }

    if (showAddSerialParallelGroupBeforeAfter) {
      menu.push([
        <DropdownMenuItem
          key="add-serial-group-before"
          className="flex items-center gap-1.5"
          onSelect={() => {
            contextMenuData && addSerialGroup(contextMenuData.nodeData, 'before')
          }}
        >
          <Icon name="plus" size={12} className="text-tertiary-background" />
          <Text wrap="nowrap">Add serial group before</Text>
        </DropdownMenuItem>,
        <DropdownMenuItem
          key="add-serial-group-after"
          className="flex items-center gap-1.5"
          onSelect={() => {
            contextMenuData && addSerialGroup(contextMenuData.nodeData, 'after')
          }}
        >
          <Icon name="plus" size={12} className="text-tertiary-background" />
          <Text wrap="nowrap">Add serial group after</Text>
        </DropdownMenuItem>
      ])

      menu.push([
        <DropdownMenuItem
          key="add-parallel-group-before"
          className="flex items-center gap-1.5"
          onSelect={() => {
            contextMenuData && addParallelGroup(contextMenuData.nodeData, 'before')
          }}
        >
          <Icon name="plus" size={12} className="text-tertiary-background" />
          <Text wrap="nowrap">Add parallel group before</Text>
        </DropdownMenuItem>,
        <DropdownMenuItem
          key="add-parallel-group-after"
          className="flex items-center gap-1.5"
          onSelect={() => {
            contextMenuData && addParallelGroup(contextMenuData.nodeData, 'after')
          }}
        >
          <Icon name="plus" size={12} className="text-tertiary-background" />
          <Text wrap="nowrap">Add parallel group after</Text>
        </DropdownMenuItem>
      ])
    }

    if (showAddStageIn) {
      menu.push([
        <DropdownMenuItem
          key="add-stage"
          className="flex items-center gap-1.5"
          onSelect={() => {
            contextMenuData && addStage(contextMenuData.nodeData, 'in')
          }}
        >
          <Icon name="plus" size={12} className="text-tertiary-background" />
          <Text wrap="nowrap">Add stage</Text>
        </DropdownMenuItem>
      ])
    }

    if (showAddSerialParallelGroupIn) {
      menu.push([
        <DropdownMenuItem
          key="add-serial-group"
          className="flex items-center gap-1.5"
          onSelect={() => {
            contextMenuData && addSerialGroup(contextMenuData.nodeData, 'in')
          }}
        >
          <Icon name="plus" size={12} className="text-tertiary-background" />
          <Text wrap="nowrap">Add serial group</Text>
        </DropdownMenuItem>
      ])

      menu.push([
        <DropdownMenuItem
          key="add-parallel-group"
          className="flex items-center gap-1.5"
          onSelect={() => {
            contextMenuData && addParallelGroup(contextMenuData.nodeData, 'in')
          }}
        >
          <Icon name="plus" size={12} className="text-tertiary-background" />
          <Text wrap="nowrap">Add parallel group</Text>
        </DropdownMenuItem>
      ])
    }

    if (showRevealInYaml) {
      menu.push([
        <DropdownMenuItem
          key="edit"
          disabled={!enableEdit}
          className="flex items-center gap-1.5"
          onSelect={() => {
            contextMenuData && revealInYaml(contextMenuData.nodeData.yamlPath)
          }}
        >
          <Icon name="circle" size={12} className="text-tertiary-background" />
          <Text>Reveal in Yaml</Text>
        </DropdownMenuItem>
      ])
    }

    if (!contextMenuData?.isIn) {
      menu.push([
        <DropdownMenuItem
          key="delete"
          disabled={!enableDelete}
          className="flex items-center gap-1.5"
          onSelect={() => {
            contextMenuData && deleteStep(contextMenuData.nodeData)
          }}
        >
          <Icon name="trash" size={12} className="text-primary" />
          <Text>Delete</Text>
        </DropdownMenuItem>
      ])
    }

    return menu
  }

  return (
    <DropdownMenu
      open={!!contextMenuData}
      onOpenChange={open => {
        if (open === false) {
          hideContextMenu()
        }
      }}
    >
      <DropdownMenuContent
        align="end"
        className="absolute"
        style={{ left: `${contextMenuData?.position.x}px`, top: `${contextMenuData?.position.y}px` }}
      >
        {getMenu().map((menuItem, idx) => {
          return idx !== 0 ? (
            <>
              <DropdownMenuSeparator />
              {menuItem}
            </>
          ) : (
            menuItem
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
