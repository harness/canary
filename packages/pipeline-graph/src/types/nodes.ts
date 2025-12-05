export interface NodeProps {
  mode?: 'Edit' | 'Execution'
}

export enum ContainerNode {
  leaf = 'leaf',
  parallel = 'parallel',
  serial = 'serial'
}

// Callback type for collapse/expand operations
// Note: node parameter will be AnyNodeInternal when used, but we use 'any' here to avoid circular dependency
export type OnCollapseChangeCallback = (path: string, collapsed: boolean, node: any) => void | Promise<void>
export type OnCollapseSuccessCallback = (path: string, collapsed: boolean, node: any) => void | Promise<void>
export type OnCollapseErrorCallback = (
  path: string,
  collapsed: boolean,
  node: any,
  error: Error
) => void | Promise<void>

export interface ContainerNodeConfig {
  width?: number
  maxWidth?: number
  minWidth?: number
  height?: number
  maxHeight?: number
  minHeight?: number
  hideLeftPort?: boolean
  hideRightPort?: boolean
  hideDeleteButton?: boolean
  hideBeforeAdd?: boolean
  hideAfterAdd?: boolean
  selectable?: boolean
  initialCollapsed?: boolean
  onCollapseChange?: OnCollapseChangeCallback
  onCollapseSuccess?: OnCollapseSuccessCallback
  onCollapseError?: OnCollapseErrorCallback
}
export interface ContainerNodeCommonType<T> {
  data: T
  config?: ContainerNodeConfig
}

export interface LeafContainerNodeType<T = unknown> extends ContainerNodeCommonType<T> {
  type: string
}

export interface ParallelContainerNodeType<T = unknown> extends ContainerNodeCommonType<T> {
  type: string
  children: AnyContainerNodeType[]
  config?: ContainerNodeCommonType<T>['config'] & { hideCollapseButton?: boolean }
}

export interface SerialContainerNodeType<T = unknown> extends ContainerNodeCommonType<T> {
  type: string
  children: AnyContainerNodeType[]
  config?: ContainerNodeCommonType<T>['config'] & { hideCollapseButton?: boolean }
}

export type AnyContainerNodeType = LeafContainerNodeType | ParallelContainerNodeType | SerialContainerNodeType
