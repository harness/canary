import { createContext, useContext, useRef } from 'react'

interface CanvasTransform {
  scale: number
  translateX: number
  translateY: number
}

interface MultiCanvasContextProps {
  setCanvasTransformRef: (id: string, ref: React.MutableRefObject<CanvasTransform | undefined>) => void
  getCanvasTransformRef: (id: string) => React.MutableRefObject<CanvasTransform | undefined> | undefined
}

const MultiCanvasContext = createContext<MultiCanvasContextProps>({
  setCanvasTransformRef: (_id: string, _ref: React.MutableRefObject<CanvasTransform | undefined>) => undefined,
  getCanvasTransformRef: (_id: string) => undefined
})

export interface MultiCanvasProviderProps {
  children: React.ReactNode
}

export const MultiCanvasProvider = ({ children }: { children: React.ReactNode }) => {
  const graphStateRef = useRef<Map<string, React.MutableRefObject<CanvasTransform | undefined>>>(new Map())

  const setCanvasTransformRef = (id: string, ref: React.MutableRefObject<CanvasTransform | undefined>) => {
    graphStateRef.current.set(id, ref)
  }

  const getCanvasTransformRef = (id: string) => {
    return graphStateRef.current.get(id)
  }

  return (
    <MultiCanvasContext.Provider
      value={{
        getCanvasTransformRef,
        setCanvasTransformRef
      }}
    >
      {children}
    </MultiCanvasContext.Provider>
  )
}

export const useMultiCanvasContext = () => {
  return useContext(MultiCanvasContext)
}
