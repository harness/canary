import { createContext, useContext, useEffect, useState } from 'react'

import { useUnifiedPipelineStudioContext } from '@views/unified-pipeline-studio/context/unified-pipeline-studio-context'
import { RightDrawer } from '@views/unified-pipeline-studio/types/right-drawer-types'

import type { ParallelContainerConfigType, SerialContainerConfigType } from '@harnessio/pipeline-graph'

import { CommonNodeDataType } from '../types/common-node-data-type'
import { YamlEntityType } from '../types/yaml-entity-type'

export interface ContextMenuData {
  contextMenu: ({ outsidePosition }: { outsidePosition?: 'before' | 'after' }) => JSX.Element
  nodeData: CommonNodeDataType
  position: { x: number; y: number }
  isIn?: boolean
  isOutside?: boolean
  outsidePosition?: 'before' | 'after'
}

export interface PipelineStudioNodeContextProps<T> {
  // context menu
  showContextMenu: (props: {
    contextMenu: (() => React.ReactNode)[] | any
    nodeData: CommonNodeDataType
    initiator: HTMLElement
    isIn?: boolean
    isOutside?: boolean
    outsidePosition?: 'before' | 'after'
  }) => void
  hideContextMenu: () => void
  contextMenuData: ContextMenuData | undefined

  // selected entity path
  selectionPath?: string
  setSelectionPath: (path: string) => void
  onSelectIntention: (nodeData: CommonNodeDataType) => void
  // step manipulation
  onAddIntention: (
    nodeData: CommonNodeDataType,
    position: 'after' | 'before' | 'in',
    yamlEntityTypeToAdd?: YamlEntityType
  ) => void
  onEditIntention: (nodeData: CommonNodeDataType) => void
  onDeleteIntention: (nodeData: CommonNodeDataType) => void
  onRevealInYaml: (path: string | undefined) => void
  globalData?: T
  serialContainerConfig?: Partial<SerialContainerConfigType>
  parallelContainerConfig?: Partial<ParallelContainerConfigType>
}

export const PipelineStudioNodeContext = createContext<PipelineStudioNodeContextProps<any>>({
  showContextMenu: (_props: {
    contextMenu: () => React.ReactNode
    nodeData: CommonNodeDataType
    initiator: HTMLElement
    isIn?: boolean
    isOutside?: boolean
    outsidePosition?: 'before' | 'after'
  }) => undefined,
  hideContextMenu: () => undefined,
  contextMenuData: undefined,
  //
  selectionPath: undefined,
  setSelectionPath: (_path: string | null) => undefined,
  onSelectIntention: (_nodeData: CommonNodeDataType) => undefined,
  //
  onAddIntention: (
    _nodeData: CommonNodeDataType,
    _position: 'after' | 'before' | 'in',
    _yamlEntityTypeToAdd?: YamlEntityType
  ) => undefined,
  onEditIntention: (_nodeData: CommonNodeDataType) => undefined,
  onDeleteIntention: (_nodeData: CommonNodeDataType) => undefined,
  onRevealInYaml: (_path: string | undefined) => undefined
})

export function usePipelineStudioNodeContext<T>(): PipelineStudioNodeContextProps<T> {
  return useContext(PipelineStudioNodeContext)
}

export interface UnifiedPipelineStudioNodeContextProviderProps<T = unknown> {
  children: React.ReactNode
  globalData?: T
  serialContainerConfig?: Partial<SerialContainerConfigType>
  parallelContainerConfig?: Partial<ParallelContainerConfigType>
}

export const UnifiedPipelineStudioNodeContextProvider: React.FC<
  UnifiedPipelineStudioNodeContextProviderProps
> = props => {
  const { children, globalData, serialContainerConfig, parallelContainerConfig } = props

  const {
    requestYamlModifications,
    setRightDrawer,
    setEditStepIntention,
    setAddStepIntention,
    setEditStageIntention,
    setAddStageIntention,
    selectedPath,
    onSelectedPathChange
  } = useUnifiedPipelineStudioContext()

  const onDeleteIntention = (nodeData: CommonNodeDataType) => {
    requestYamlModifications.deleteInArray({ path: nodeData.yamlPath })
  }

  const onEditIntention = (nodeData: CommonNodeDataType) => {
    onSelectedPathChange(nodeData.yamlPath)

    switch (nodeData.yamlEntityType) {
      case YamlEntityType.Step:
        setRightDrawer(RightDrawer.Form)
        setEditStepIntention({ path: nodeData.yamlPath })
        break
      case YamlEntityType.Stage:
        setRightDrawer(RightDrawer.StageConfig)
        setEditStageIntention({ path: nodeData.yamlPath })
        break
    }
  }

  const onSelectIntention = (data: CommonNodeDataType) => {
    onSelectedPathChange(data.yamlPath)
    onEditIntention(data)
  }

  const onAddIntention = (
    nodeData: CommonNodeDataType,
    position: 'after' | 'before' | 'in',
    yamlEntityTypeToAdd?: YamlEntityType
  ) => {
    if (yamlEntityTypeToAdd === YamlEntityType.ParallelStageGroup) {
      // NOTE: if we are adding in the array we have to provide path to children array
      if (position === 'in' && nodeData.yamlChildrenPath) {
        requestYamlModifications.injectInArray({
          path: nodeData.yamlChildrenPath,
          position,
          item: { parallel: { stages: [] } }
        })
      } else {
        requestYamlModifications.injectInArray({
          path: nodeData.yamlPath,
          position,
          item: { parallel: { stages: [] } }
        })
      }
      return
    }

    if (yamlEntityTypeToAdd === YamlEntityType.SerialStageGroup) {
      // NOTE: if we are adding in the array we have to provide path to children array
      if (position === 'in' && nodeData.yamlChildrenPath) {
        requestYamlModifications.injectInArray({
          path: nodeData.yamlChildrenPath,
          position,
          item: { group: { stages: [] } }
        })
      } else {
        requestYamlModifications.injectInArray({ path: nodeData.yamlPath, position, item: { group: { stages: [] } } })
      }
      return
    }

    if (yamlEntityTypeToAdd === YamlEntityType.Stage) {
      // NOTE: if we are adding in the array we have to provide path to children array
      setRightDrawer(RightDrawer.StageConfig)

      // NOTE: if we are adding in the array we have to provide path to children array
      if (position === 'in' && nodeData.yamlChildrenPath) {
        setAddStageIntention({ path: nodeData.yamlChildrenPath, position })
      } else {
        setAddStageIntention({ path: nodeData.yamlPath, position })
      }
      return
    }

    // TODO: check if last/default action is add step or we need to wrap this code in the condition.

    setRightDrawer(RightDrawer.Collection)

    // NOTE: if we are adding in the array we have to provide path to children array
    if (position === 'in' && nodeData.yamlChildrenPath) {
      setAddStepIntention({ path: nodeData.yamlChildrenPath, position })
    } else {
      setAddStepIntention({ path: nodeData.yamlPath, position })
    }
  }

  const onRevealInYaml = () => {}

  const [contextMenuData, setContextMenuData] = useState<ContextMenuData | undefined>(undefined)
  const [selectionPath, setSelectionPath] = useState<string | undefined>(undefined)

  const showContextMenu = ({
    contextMenu,
    nodeData,
    initiator,
    isIn,
    isOutside,
    outsidePosition
  }: {
    contextMenu: (() => React.ReactNode)[] | any
    nodeData: CommonNodeDataType
    initiator: HTMLElement
    isIn?: boolean
    isOutside?: boolean
    outsidePosition?: 'before' | 'after'
  }) => {
    const rect = initiator.getBoundingClientRect()

    setContextMenuData({
      contextMenu,
      nodeData,
      position: { x: rect.left + rect.width, y: rect.top },
      isIn,
      isOutside,
      outsidePosition
    })
  }

  const hideContextMenu = () => {
    setContextMenuData(undefined)
  }

  useEffect(() => {
    setSelectionPath(selectedPath)
  }, [selectedPath])

  return (
    <PipelineStudioNodeContext.Provider
      value={{
        contextMenuData,
        showContextMenu,
        hideContextMenu,
        setSelectionPath,
        selectionPath,
        onSelectIntention,
        onAddIntention,
        onEditIntention,
        onDeleteIntention,
        onRevealInYaml,
        globalData,
        serialContainerConfig,
        parallelContainerConfig
      }}
    >
      {children}
    </PipelineStudioNodeContext.Provider>
  )
}
