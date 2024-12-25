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
  hideLeftPort?: boolean
  hideRightPort?: boolean
  hideDeleteButton?: boolean
  hideBeforeAdd?: boolean
  hideAfterAdd?: boolean
  selectable?: boolean
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
