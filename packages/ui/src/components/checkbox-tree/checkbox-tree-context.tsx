import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

import type { CheckboxTreeContextValue, NodeState, ParentContextValue, Registry } from './checkbox-tree-types'
import {
  addToRegistry,
  computeNodeState,
  getAllLeaves,
  getLeafDescendants,
  removeFromRegistry
} from './checkbox-tree-utils'

// === CheckboxTree context ===

const CheckboxTreeContext = createContext<CheckboxTreeContextValue | null>(null)

export const useCheckboxTree = (): CheckboxTreeContextValue => {
  const context = useContext(CheckboxTreeContext)
  if (!context) {
    throw new Error('CheckboxTree.Group and CheckboxTree.Item must be used within a CheckboxTree.Root')
  }
  return context
}

export const CheckboxTreeProvider = CheckboxTreeContext.Provider

// === Parent context (per-branch parent id + depth) ===

const ParentContext = createContext<ParentContextValue>({ level: 0 })

export const useParent = (): ParentContextValue => useContext(ParentContext)

export const ParentProvider = ParentContext.Provider

// === Selection engine ===

type UseCheckboxTreeSelectionProps = {
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
}

type SelectionEngine = Pick<
  CheckboxTreeContextValue,
  'register' | 'unregister' | 'getNodeState' | 'getLeafCount' | 'setNodeChecked' | 'getRootState' | 'setAllChecked'
>

/**
 * Owns the tree-structure registry and derives selection state from the controlled
 * `selectedIds`. All the tree math lives in `checkbox-tree-utils` — this hook just
 * wires it to React state and the registry ref.
 */
export const useCheckboxTreeSelection = ({
  selectedIds,
  onSelectionChange
}: UseCheckboxTreeSelectionProps): SelectionEngine => {
  // Registry of the tree structure, populated as Group/Item nodes mount.
  const registryRef = useRef<Registry>(new Map())
  // Bumped on register/unregister so derived states recompute after the tree mounts.
  const [, setRegistryVersion] = useState(0)

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds])

  const register = useCallback((id: string, parentId: string | undefined, isLeaf: boolean) => {
    addToRegistry(registryRef.current, id, parentId, isLeaf)
    setRegistryVersion(v => v + 1)
  }, [])

  const unregister = useCallback((id: string) => {
    removeFromRegistry(registryRef.current, id)
    setRegistryVersion(v => v + 1)
  }, [])

  const getNodeState = useCallback(
    (id: string): NodeState => computeNodeState(getLeafDescendants(registryRef.current, id), selectedSet),
    [selectedSet]
  )

  const getLeafCount = useCallback((id: string): number => getLeafDescendants(registryRef.current, id).length, [])

  const setNodeChecked = useCallback(
    (id: string, checked: boolean) => {
      const leaves = getLeafDescendants(registryRef.current, id)
      const next = new Set(selectedSet)
      leaves.forEach(leaf => (checked ? next.add(leaf) : next.delete(leaf)))
      onSelectionChange([...next])
    },
    [onSelectionChange, selectedSet]
  )

  const getRootState = useCallback(
    (): NodeState => computeNodeState(getAllLeaves(registryRef.current), selectedSet),
    [selectedSet]
  )

  const setAllChecked = useCallback(
    (checked: boolean) => {
      onSelectionChange(checked ? getAllLeaves(registryRef.current) : [])
    },
    [onSelectionChange]
  )

  return { register, unregister, getNodeState, getLeafCount, setNodeChecked, getRootState, setAllChecked }
}

/**
 * Registers a Group/Item node with the tree on mount and cleans up on unmount.
 * Both sub-components register identically, differing only by `isLeaf`.
 */
export const useRegisterNode = (id: string, isLeaf: boolean): void => {
  const { register, unregister } = useCheckboxTree()
  const { parentId } = useParent()

  useEffect(() => {
    register(id, parentId, isLeaf)
    return () => unregister(id)
  }, [id, parentId, isLeaf, register, unregister])
}
