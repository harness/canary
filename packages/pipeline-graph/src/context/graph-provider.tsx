import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

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
  // rerenderConnections increments when when we call rerender
  rerenderConnections: number
  setShowSvg: (show: boolean) => void
  isMounted: React.MutableRefObject<boolean>
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
  rerender: () => undefined,
  setShowSvg: (_show: boolean) => undefined,
  isMounted: { current: false }
})

export interface GraphProviderProps {
  nodes: NodeContent[]
  collapse: (path: string, state: boolean) => void
  collapsed: Record<string, boolean>
  setShowSvg: (show: boolean) => void
}
const GraphProvider = ({
  nodes: nodesArr,
  children,
  collapsed,
  collapse,
  setShowSvg
}: React.PropsWithChildren<GraphProviderProps>) => {
  const [initialized, setInitialized] = useState<boolean>(false)

  const [rerenderConnections, setRerenderConnections] = useState(1)
  const [nodeToRemove, setNodeToRemove] = useState<string | null>(null)

  const collapsedRef = useRef(collapsed)
  collapsedRef.current = collapsed

  const isMounted = useRef(false)

  useEffect(() => {
    setRerenderConnections(prev => prev + 1)
  }, [collapsed])

  // TODO:  remove this functionality outside of library and implement properly
  // shift collapsed for 1 when node is deleted
  // const shiftCollapsed = (path: string, index: number) => {
  //   const newpath = path + '.' + index
  //   const oldpath = path + '.' + (index + 1)

  //   const newCollapsed: Record<string, boolean> = {}

  //   forOwn(collapsedRef.current, (value, key) => {
  //     let peaces = key.split(path + '.')

  //     peaces = peaces[1].split('.')

  //     const collapsedIndex = parseInt(peaces[0])

  //     if (collapsedIndex > index) {
  //       const newCollapsedIndex = collapsedIndex - 1
  //       if (key === path + '.' + collapsedIndex) {
  //         const newKey = key.replace(path + '.' + collapsedIndex, path + '.' + newCollapsedIndex)
  //         newCollapsed[newKey] = value
  //       } else {
  //         const newKey = key.replace(path + '.' + collapsedIndex + '.', path + '.' + newCollapsedIndex + '.')
  //         newCollapsed[newKey] = value
  //       }
  //     } else {
  //       newCollapsed[key] = value
  //     }
  //   })

  //   setCollapsed(newCollapsed)
  // }

  // const collapse = useCallback(
  //   (path: string, state: boolean) => {
  //     setCollapsed({ ...collapsed, [path]: state })
  //     setRerenderConnections(rerenderConnections + 1)
  //   },
  //   [collapsed, setCollapsed, rerenderConnections, setRerenderConnections]
  // )

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
        // rerender connections
        rerender,
        setShowSvg,
        isMounted,
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
