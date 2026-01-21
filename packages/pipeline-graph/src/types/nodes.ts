export interface NodeProps {
  mode?: 'Edit' | 'Execution'
}

export enum ContainerNode {
  leaf = 'leaf',
  parallel = 'parallel',
  serial = 'serial'
}

export interface ContainerNodeConfig {
  width?: number
  maxWidth?: number
  minWidth?: number
  height?: number
  maxHeight?: number
  minHeight?: number
  /** Hide left port and edge that connects to it */
  hideLeftPort?: boolean
  /** Hide right port and edge that connects to it */
  hideRightPort?: boolean
  hideDeleteButton?: boolean
  /** Hide Add button before node */
  hideBeforeAdd?: boolean
  /** Hide Add button after node */
  hideAfterAdd?: boolean
  selectable?: boolean
  /** Hide left port. Edge remains */
  isLeftPortHidden?: boolean
  /** Hide right port. Edge remains */
  isRightPortHidden?: boolean
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
