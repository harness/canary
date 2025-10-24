import { createContext, useContext, useEffect, useState } from 'react'

import { CommonNodeDataType } from '../types/common-node-data-type'
import { YamlEntityType } from '../types/yaml-entity-type'

export interface ContextMenuData {
  contextMenu: () => JSX.Element
  nodeData: CommonNodeDataType
  position: { x: number; y: number }
  isIn?: boolean
}

export interface PipelineStudioNodeContextProps<T> {
  // context menu
  showContextMenu: (
    contextMenu: () => React.ReactNode,
    nodeData: CommonNodeDataType,
    initiator: HTMLElement,
    isIn?: boolean
  ) => void
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
}

export const PipelineStudioNodeContext = createContext<PipelineStudioNodeContextProps<any>>({
  showContextMenu: (
    _contextMenu: () => React.ReactNode,
    _nodeData: CommonNodeDataType,
    _initiator: HTMLElement,
    _isIn?: boolean
  ) => undefined,
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

export interface PipelineStudioNodeContextProviderProps<T = unknown> {
  children: React.ReactNode
  selectedPath?: string
  onSelectIntention: (nodeData: CommonNodeDataType) => undefined
  onAddIntention: (
    nodeData: CommonNodeDataType,
    position: 'after' | 'before' | 'in',
    yamlEntityTypeToAdd?: YamlEntityType
  ) => void
  onEditIntention: (nodeData: CommonNodeDataType) => undefined
  onDeleteIntention: (nodeData: CommonNodeDataType) => undefined
  onRevealInYaml: (_path: string | undefined) => undefined
  globalData?: T
}
export const PipelineStudioNodeContextProvider: React.FC<PipelineStudioNodeContextProviderProps> = props => {
  const {
    onSelectIntention,
    onAddIntention,
    onEditIntention,
    onDeleteIntention,
    onRevealInYaml,
    children,
    selectedPath,
    globalData
  } = props

  const [contextMenuData, setContextMenuData] = useState<ContextMenuData | undefined>(undefined)
  const [selectionPath, setSelectionPath] = useState<string | undefined>(undefined)

  const showContextMenu = (
    contextMenu: (() => React.ReactNode)[] | any,
    nodeData: CommonNodeDataType,
    initiator: HTMLElement,
    isIn?: boolean
  ) => {
    const rect = initiator.getBoundingClientRect()

    setContextMenuData({
      contextMenu,
      nodeData,
      position: { x: rect.left + rect.width, y: rect.top },
      isIn
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
        globalData
      }}
    >
      {children}
    </PipelineStudioNodeContext.Provider>
  )
}
