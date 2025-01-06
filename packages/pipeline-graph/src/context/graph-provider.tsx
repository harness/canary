import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

import { forOwn } from 'lodash-es'

import { NodeContent } from '../types/node-content'

interface GraphContextProps {
  initialized: boolean
  setInitialized: () => void
  nodes: Record<string, NodeContent>
  collapse: (path: string, state: boolean) => void
  isCollapsed: (path: string) => boolean
  setNodeToRemove: (path: string | null) => void
  nodeToRemove: string | null
  // rerender connections
  rerender: () => void
  // rerenderConnections increments when in the rerender()
  rerenderConnections: number
  // shift collapsed on node deletion
  shiftCollapsed: (path: string, index: number) => void
}

const GraphContext = createContext<GraphContextProps>({
  initialized: false,
  setInitialized: () => undefined,
  nodes: {},
  collapse: (_path: string, _state: boolean) => undefined,
  isCollapsed: (_path: string) => false,
  rerenderConnections: 0,
  setNodeToRemove: (_path: string | null) => undefined,
  nodeToRemove: null,
  shiftCollapsed: (_path: string, _index: number) => undefined,
  rerender: () => undefined
})

const GraphProvider = ({ nodes: nodesArr, children }: React.PropsWithChildren<{ nodes: NodeContent[] }>) => {
  const [initialized, setInitialized] = useState<boolean>(false)

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
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
    (path: string, state: boolean) => {
      setCollapsed({ ...collapsed, [path]: state })
      setRerenderConnections(rerenderConnections + 1)
    },
    [collapsed, setCollapsed, rerenderConnections, setRerenderConnections]
  )

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
        setNodeToRemove,
        nodeToRemove,
        // force rerender
        rerenderConnections,
        // shift collapsed on node deletion
        shiftCollapsed,
        // rerender connections
        rerender
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
