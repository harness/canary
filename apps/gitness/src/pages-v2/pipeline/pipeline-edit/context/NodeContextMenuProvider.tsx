import { createContext, useContext, useMemo, useState } from 'react'

import { CommonNodeDataType, YamlEntityType } from '../components/graph-implementation/types/nodes'
import { PipelineStudioView } from '../types/types'
import { usePipelineDataContext } from './PipelineStudioDataProvider'
import { StepDrawer, usePipelineViewContext } from './PipelineStudioViewProvider'

export interface ContextMenuData {
  nodeData: CommonNodeDataType
  position: { x: number; y: number }
  isIn?: boolean
}

export interface NodeContextProps {
  // context menu
  showContextMenu: (nodeData: CommonNodeDataType, initiator: HTMLElement, isIn?: boolean) => void
  hideContextMenu: () => void
  contextMenuData: ContextMenuData | null
  // selected entity path
  selectionPath?: string
  // step manipulation
  addStep: (nodeData: CommonNodeDataType, position: 'after' | 'before') => void
  editStep: (nodeData: CommonNodeDataType) => void
  deleteStep: (nodeData: CommonNodeDataType) => void
  // stage manipulation
  addStage: (nodeData: CommonNodeDataType, position: 'after' | 'before' | 'in') => void
  addSerialGroup: (nodeData: CommonNodeDataType, position: 'after' | 'before' | 'in') => void
  addParallelGroup: (nodeData: CommonNodeDataType, position: 'after' | 'before' | 'in') => void
  // handle add in empty group/parallel
  handleAddIn: (nodeData: CommonNodeDataType, initiator: HTMLElement) => void
  // reveal in yaml
  revealInYaml: (path: string | undefined) => void
}

export const NodeContext = createContext<NodeContextProps>({
  showContextMenu: (_nodeData: CommonNodeDataType, _initiator: HTMLElement, _isIn?: boolean) => undefined,
  hideContextMenu: () => undefined,
  contextMenuData: null,
  //
  selectionPath: undefined,
  //
  addStep: (_yamlPath: CommonNodeDataType, _position: 'after' | 'before') => undefined,
  editStep: (_yamlPath: CommonNodeDataType) => undefined,
  deleteStep: (_yamlPath: CommonNodeDataType) => undefined,
  //
  addStage: (_yamlPath: CommonNodeDataType, _position: 'after' | 'before' | 'in') => undefined,
  addSerialGroup: (_nodeData: CommonNodeDataType, _position: 'after' | 'before' | 'in') => undefined,
  addParallelGroup: (_nodeData: CommonNodeDataType, _position: 'after' | 'before' | 'in') => undefined,
  //
  handleAddIn: (_nodeData: CommonNodeDataType, _initiator: HTMLElement) => undefined,
  //
  revealInYaml: (_path: string | undefined) => undefined
})

export function useNodeContext(): NodeContextProps {
  return useContext(NodeContext)
}

export const NodeContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    setAddStepIntention,
    setEditStepIntention,
    requestYamlModifications,
    state: { editStepIntention }
  } = usePipelineDataContext()
  const { setStepDrawerOpen, setHighlightInYamlPath, setView } = usePipelineViewContext()

  const [contextMenuData, setContextMenuData] = useState<ContextMenuData | null>(null)

  const showContextMenu = (nodeData: CommonNodeDataType, initiator: HTMLElement, isIn?: boolean) => {
    const rect = initiator.getBoundingClientRect()

    setContextMenuData({
      nodeData,
      position: { x: rect.left + rect.width, y: rect.top },
      isIn
    })
  }

  const hideContextMenu = () => {
    setContextMenuData(null)
  }

  const deleteStep = (nodeData: CommonNodeDataType) => {
    requestYamlModifications.deleteInArray({ path: nodeData.yamlPath })
  }

  const addStep = (nodeData: CommonNodeDataType, position: 'after' | 'before' | 'in') => {
    setStepDrawerOpen(StepDrawer.Collection)

    // NOTE: if we are adding in the array we have to provide path to children array
    if (position === 'in' && nodeData.yamlChildrenPath) {
      setAddStepIntention({ path: nodeData.yamlChildrenPath, position })
    } else {
      setAddStepIntention({ path: nodeData.yamlPath, position })
    }
  }

  const editStep = (nodeData: CommonNodeDataType) => {
    setStepDrawerOpen(StepDrawer.Form)
    setEditStepIntention({ path: nodeData.yamlPath })
  }

  const addStage = (nodeData: CommonNodeDataType, position: 'after' | 'before' | 'in') => {
    // NOTE: if we are adding in the array we have to provide path to children array
    if (position === 'in' && nodeData.yamlChildrenPath) {
      requestYamlModifications.injectInArray({ path: nodeData.yamlChildrenPath, position, item: { steps: [] } })
    } else {
      requestYamlModifications.injectInArray({ path: nodeData.yamlPath, position, item: { steps: [] } })
    }
  }

  const addSerialGroup = (nodeData: CommonNodeDataType, position: 'after' | 'before' | 'in') => {
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
  }

  const addParallelGroup = (nodeData: CommonNodeDataType, position: 'after' | 'before' | 'in') => {
    // NOTE: if we are adding in the array we have to provide path to children array
    if (position === 'in' && nodeData.yamlChildrenPath) {
      requestYamlModifications.injectInArray({
        path: nodeData.yamlChildrenPath,
        position,
        item: { parallel: { stages: [] } }
      })
    } else {
      requestYamlModifications.injectInArray({ path: nodeData.yamlPath, position, item: { parallel: { stages: [] } } })
    }
  }

  const handleAddIn = (nodeData: CommonNodeDataType, initiator: HTMLElement) => {
    const isAddStep =
      nodeData.yamlEntityType === YamlEntityType.StepParallelGroup ||
      nodeData.yamlEntityType === YamlEntityType.StepSerialGroup ||
      nodeData.yamlEntityType === YamlEntityType.Stage

    if (isAddStep) {
      addStep(nodeData, 'in')
    } else {
      showContextMenu(nodeData, initiator, true)
    }
  }

  const revealInYaml = (path: string | undefined) => {
    setView(PipelineStudioView.Yaml)
    setHighlightInYamlPath(path)
  }

  const selectionPath = useMemo(() => {
    return editStepIntention?.path
  }, [editStepIntention])

  return (
    <NodeContext.Provider
      value={{
        contextMenuData,
        showContextMenu,
        hideContextMenu,
        deleteStep,
        addStep,
        editStep,
        addStage,
        addSerialGroup,
        addParallelGroup,
        //
        handleAddIn,
        //
        revealInYaml,
        //
        selectionPath
      }}
    >
      {children}
    </NodeContext.Provider>
  )
}
