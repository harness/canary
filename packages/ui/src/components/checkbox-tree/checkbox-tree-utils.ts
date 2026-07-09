import type * as React from 'react'

import type { NodeState, Registry } from './checkbox-tree-types'

/** Register a node in the registry and link it to its parent's child list. */
export const addToRegistry = (registry: Registry, id: string, parentId: string | undefined, isLeaf: boolean): void => {
  const existing = registry.get(id)
  registry.set(id, { parentId, isLeaf, childIds: existing?.childIds ?? [] })

  if (parentId) {
    const parent = registry.get(parentId)
    if (parent) {
      if (!parent.childIds.includes(id)) parent.childIds.push(id)
    } else {
      registry.set(parentId, { childIds: [id], isLeaf: false })
    }
  }
}

/** Remove a node from the registry and unlink it from its parent's child list. */
export const removeFromRegistry = (registry: Registry, id: string): void => {
  const entry = registry.get(id)
  if (entry?.parentId) {
    const parent = registry.get(entry.parentId)
    if (parent) parent.childIds = parent.childIds.filter(childId => childId !== id)
  }
  registry.delete(id)
}

/** Collect all leaf ids at or below `id`. */
export const getLeafDescendants = (registry: Registry, id: string): string[] => {
  const entry = registry.get(id)
  if (!entry) return []
  if (entry.isLeaf) return [id]
  return entry.childIds.flatMap(childId => getLeafDescendants(registry, childId))
}

/** Collect every leaf id registered in the tree. */
export const getAllLeaves = (registry: Registry): string[] => {
  const leaves: string[] = []
  registry.forEach((entry, id) => {
    if (entry.isLeaf) leaves.push(id)
  })
  return leaves
}

/**
 * Derive a node's tri-state from its leaf descendants:
 * none selected → unchecked, all selected → checked, otherwise indeterminate.
 */
export const computeNodeState = (leaves: string[], selectedSet: Set<string>): NodeState => {
  if (leaves.length === 0) return 'unchecked'
  const selectedCount = leaves.filter(leaf => selectedSet.has(leaf)).length
  if (selectedCount === 0) return 'unchecked'
  if (selectedCount === leaves.length) return 'checked'
  return 'indeterminate'
}

/** Map a NodeState to the value expected by the Checkbox `checked` prop. */
export const toCheckboxValue = (state: NodeState): boolean | 'indeterminate' =>
  state === 'indeterminate' ? 'indeterminate' : state === 'checked'

/** Indentation applied to a row's content area based on its depth. */
export const getIndentStyle = (level: number): React.CSSProperties | undefined =>
  level > 0 ? { paddingLeft: `calc(${level} * var(--cn-spacing-12))` } : undefined
