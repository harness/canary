export enum ContainerNode {
  leaf = "leaf",
  parallel = "parallel",
  serial = "serial",
}

export interface NodeCommon<T = unknown> {
  data?: T;
  config?: {
    width?: number;
    maxWidth?: number;
    minWidth?: number;
    height?: number;
    maxHeight?: number;
    minHeight?: number;
    hideLeftPort?: boolean;
    hideRightPort?: boolean;
    hideDeleteButton?: boolean;
    hideBeforeAdd?: boolean;
    hideAfterAdd?: boolean;
  };
}

export interface LeafNodeType extends NodeCommon {
  type: string;
}

export interface ParallelNodeType extends NodeCommon {
  type: string;
  children: AnyNodeType[];
  config?: NodeCommon["config"] & { hideCollapseButton?: boolean };
}

export interface SerialNodeType extends NodeCommon {
  type: string;
  children: AnyNodeType[];
  config?: NodeCommon["config"] & { hideCollapseButton?: boolean };
}

export type AnyNodeType<T = unknown> =
  | LeafNodeType
  | ParallelNodeType
  | SerialNodeType;
