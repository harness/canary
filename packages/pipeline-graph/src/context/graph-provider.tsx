import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

import { forOwn } from 'lodash-es'

import { NodeContent } from '../types/node-content'
import { OnCollapseChangeCallback, OnCollapseErrorCallback, OnCollapseSuccessCallback } from '../types/nodes'

interface GraphContextProps {
  initialized: boolean
  setInitialized: () => void
  nodes: Record<string, NodeContent>
  collapse: (
    path: string,
    state: boolean,
    callback?: OnCollapseChangeCallback,
    node?: any,
    onSuccess?: OnCollapseSuccessCallback,
    onError?: OnCollapseErrorCallback
  ) => void | Promise<void>
  isCollapsed: (path: string) => boolean
  isCollapsing: (path: string) => boolean
  setNodeToRemove: (path: string | null) => void
  nodeToRemove: string | null
  // rerender connections
  rerender: () => void
  // rerenderConnections increments when in the rerender()
  rerenderConnections: number
  // shift collapsed on node deletion
  shiftCollapsed: (path: string, index: number) => void
  // set initial collapsed state
  setInitialCollapsedState: (state: Record<string, boolean>) => void
}

const GraphContext = createContext<GraphContextProps>({
  initialized: false,
  setInitialized: () => undefined,
  nodes: {},
  collapse: (
    _path: string,
    _state: boolean,
    _callback?: OnCollapseChangeCallback,
    _node?: any,
    _onSuccess?: OnCollapseSuccessCallback,
    _onError?: OnCollapseErrorCallback
  ) => undefined,
  isCollapsed: (_path: string) => false,
  isCollapsing: (_path: string) => false,
  rerenderConnections: 0,
  setNodeToRemove: (_path: string | null) => undefined,
  nodeToRemove: null,
  shiftCollapsed: (_path: string, _index: number) => undefined,
  rerender: () => undefined,
  setInitialCollapsedState: (_state: Record<string, boolean>) => undefined
})

const GraphProvider = ({ nodes: nodesArr, children }: React.PropsWithChildren<{ nodes: NodeContent[] }>) => {
  const [initialized, setInitialized] = useState<boolean>(false)

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const [collapsingPaths, setCollapsingPaths] = useState<Set<string>>(new Set())
  const [rerenderConnections, setRerenderConnections] = useState(1)
  const [nodeToRemove, setNodeToRemove] = useState<string | null>(null)

  const collapsedRef = useRef(collapsed)
  collapsedRef.current = collapsed

  // shift collapsed for 1 when node is deleted
  const shiftCollapsed = (path: string, index: number) => {
    const newpath = path + '.' + index
    const oldpath = path + '.' + (index + 1)

    const newCollapsed: Record<string, boolean> = {}

    forOwn(collapsedRef.current, (value, key) => {
      let peaces = key.split(path + '.')

      peaces = peaces[1].split('.')

      const collapsedIndex = parseInt(peaces[0])

      if (collapsedIndex > index) {
        const newCollapsedIndex = collapsedIndex - 1
        if (key === path + '.' + collapsedIndex) {
          const newKey = key.replace(path + '.' + collapsedIndex, path + '.' + newCollapsedIndex)
          newCollapsed[newKey] = value
        } else {
          const newKey = key.replace(path + '.' + collapsedIndex + '.', path + '.' + newCollapsedIndex + '.')
          newCollapsed[newKey] = value
        }
      } else {
        newCollapsed[key] = value
      }
    })

    setCollapsed(newCollapsed)
  }

  const collapse = useCallback(
    async (
      path: string,
      state: boolean,
      callback?: OnCollapseChangeCallback,
      node?: any,
      onSuccess?: OnCollapseSuccessCallback,
      onError?: OnCollapseErrorCallback
    ) => {
      // BACKWARD COMPATIBILITY: If no callback provided, update collapsed state immediately (current default behavior)
      if (!callback) {
        setCollapsed({ ...collapsed, [path]: state })
        setRerenderConnections(rerenderConnections + 1)
        // Call onSuccess if provided (even without onCollapseChange)
        if (onSuccess && typeof onSuccess === 'function') {
          try {
            await Promise.resolve(onSuccess(path, state, node))
          } catch (error) {
            console.error('onSuccess callback failed:', error)
          }
        }
        return
      }

      // Callback provided: mark as collapsing and wait for callback
      setCollapsingPaths(prev => new Set(prev).add(path))

      try {
        // Call the callback (await if it's a promise)
        await Promise.resolve(callback(path, state, node))

        // Only update collapsed state if callback succeeds
        setCollapsed({ ...collapsed, [path]: state })
        setRerenderConnections(rerenderConnections + 1)

        // Call onSuccess callback if provided
        if (onSuccess && typeof onSuccess === 'function') {
          try {
            await Promise.resolve(onSuccess(path, state, node))
          } catch (error) {
            console.error('onSuccess callback failed:', error)
          }
        }
      } catch (error) {
        // If callback throws/rejects, don't change state
        const errorObj = error instanceof Error ? error : new Error(String(error))
        console.error('Collapse callback failed:', errorObj)

        // Call onError callback if provided
        if (onError && typeof onError === 'function') {
          try {
            await Promise.resolve(onError(path, state, node, errorObj))
          } catch (err) {
            console.error('onError callback failed:', err)
          }
        }
      } finally {
        // Clear collapsing state after completion (even on error)
        setCollapsingPaths(prev => {
          const next = new Set(prev)
          next.delete(path)
          return next
        })
      }
    },
    [collapsed, rerenderConnections]
  )

  const isCollapsing = useCallback(
    (path: string) => {
      return collapsingPaths.has(path)
    },
    [collapsingPaths]
  )

  const setInitialCollapsedState = useCallback((state: Record<string, boolean>) => {
    // Only set initial state for paths that don't already exist (preserve user interactions)
    setCollapsed(prev => {
      const merged = { ...prev }
      for (const [path, value] of Object.entries(state)) {
        if (!(path in merged)) {
          merged[path] = value
        }
      }
      return merged
    })
  }, [])

  const rerender = useCallback(() => {
    setRerenderConnections(prev => prev + 1)
  }, [setRerenderConnections])

  const isCollapsed = useCallback(
    (path: string) => {
      return !!collapsed[path]
    },
    [collapsed]
  )

  const nodes = useMemo(() => {
    return nodesArr.reduce(
      (acc, curr) => {
        acc[curr.type] = curr
        return acc
      },
      {} as Record<string, NodeContent>
    )
  }, [nodesArr])

  return (
    <GraphContext.Provider
      value={{
        initialized,
        setInitialized: () => setInitialized(true),
        nodes,
        collapse,
        isCollapsed,
        isCollapsing,
        setNodeToRemove,
        nodeToRemove,
        // force rerender
        rerenderConnections,
        // shift collapsed on node deletion
        shiftCollapsed,
        // rerender connections
        rerender,
        // set initial collapsed state
        setInitialCollapsedState
      }}
    >
      {children}
    </GraphContext.Provider>
  )
}

export default GraphProvider

export const useGraphContext = () => {
  return useContext(GraphContext)
}
