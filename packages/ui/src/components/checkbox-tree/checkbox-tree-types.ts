import type * as React from 'react'

import type { IconV2NamesType } from '../icon-v2'

/** Selection state of a single node, derived from its leaf descendants. */
export type NodeState = 'checked' | 'unchecked' | 'indeterminate'

/** A node's structural record in the selection registry. */
export type RegistryEntry = {
  parentId?: string
  childIds: string[]
  isLeaf: boolean
}

/** The tree-structure registry keyed by node id. */
export type Registry = Map<string, RegistryEntry>

/** Value provided by `CheckboxTree.Root` to all descendant nodes. */
export type CheckboxTreeContextValue = {
  disabled?: boolean
  /** Whether groups render their leaf-descendant count. */
  showCount?: boolean
  expandedIds: string[]
  setExpandedIds: React.Dispatch<React.SetStateAction<string[]>>
  register: (id: string, parentId: string | undefined, isLeaf: boolean) => void
  unregister: (id: string) => void
  getNodeState: (id: string) => NodeState
  /** Number of leaf descendants beneath a node. */
  getLeafCount: (id: string) => number
  setNodeChecked: (id: string, checked: boolean) => void
  getRootState: () => NodeState
  setAllChecked: (checked: boolean) => void
}

/**
 * Provides the current parent id and nesting depth to descendant Group/Item nodes.
 * `Root` seeds this with `parentId: undefined` and `level: 0`.
 */
export type ParentContextValue = {
  parentId?: string
  level: number
}

export interface CheckboxTreeRootProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Controlled set of selected leaf ids. */
  selectedIds: string[]
  /** Called with the next set of selected leaf ids whenever the selection changes. */
  onSelectionChange: (ids: string[]) => void
  /** Ids of groups that should start expanded. */
  defaultExpandedIds?: string[]
  /** Render a top-level "Select All" row. */
  showSelectAll?: boolean
  /** Label for the "Select All" row. */
  selectAllLabel?: string
  /** Render each group's leaf-descendant count next to its label, e.g. "Resources (16)". */
  showCount?: boolean
  /** Disable the entire tree. */
  disabled?: boolean
}

export interface CheckboxTreeGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string
  label: React.ReactNode
  disabled?: boolean
  /** Icon rendered before the group label. Defaults to `folder`. */
  icon?: IconV2NamesType
}

export interface CheckboxTreeItemProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string
  label: React.ReactNode
  disabled?: boolean
}
