import { createContext, useContext, useMemo } from 'react'

import { LayoutConfig } from '../pipeline-graph-internal'
import { ParallelContainerConfigType, SerialContainerConfigType } from '../types/container-node'

export const defaultSerialContainerConfig = {
  paddingLeft: 42,
  paddingRight: 42,
  paddingTop: 50,
  paddingBottom: 20,
  nodeGap: 36
}

export const defaultParallelContainerConfig = {
  paddingLeft: 42,
  paddingRight: 42,
  paddingTop: 50,
  paddingBottom: 20,
  nodeGap: 36
}

interface ContainerNodeContextProps {
  serialContainerConfig: SerialContainerConfigType
  parallelContainerConfig: ParallelContainerConfigType
  portComponent?: (props: {
    side: 'left' | 'right'
    id?: string
    adjustment?: number
    layout?: LayoutConfig
  }) => JSX.Element
  layout: LayoutConfig
}

const ContainerNodeContext = createContext<ContainerNodeContextProps>({
  serialContainerConfig: defaultSerialContainerConfig,
  parallelContainerConfig: defaultParallelContainerConfig,
  layout: { type: 'center', portPosition: 'center' }
})

export interface ContainerNodeProviderProps {
  serialContainerConfig?: Partial<SerialContainerConfigType>
  parallelContainerConfig?: Partial<ParallelContainerConfigType>
  portComponent?: (props: {
    side: 'left' | 'right'
    id?: string
    adjustment?: number
    layout?: LayoutConfig
  }) => JSX.Element
  layout?: LayoutConfig
}

const ContainerNodeProvider = ({
  serialContainerConfig,
  parallelContainerConfig,
  portComponent,
  layout = { type: 'center', portPosition: 'center' },
  children
}: React.PropsWithChildren<ContainerNodeProviderProps>) => {
  const serialConfig: SerialContainerConfigType = useMemo(() => {
    const merged = { ...defaultSerialContainerConfig, ...serialContainerConfig }
    merged.serialGroupAdjustment = (merged.paddingTop - merged.paddingBottom) / 2
    return merged
  }, [serialContainerConfig])

  const parallelConfig: ParallelContainerConfigType = useMemo(() => {
    const merged = { ...defaultParallelContainerConfig, ...parallelContainerConfig }
    merged.parallelGroupAdjustment = 0
    return merged
  }, [serialContainerConfig])

  return (
    <ContainerNodeContext.Provider
      value={{
        serialContainerConfig: serialConfig,
        parallelContainerConfig: parallelConfig,
        portComponent,
        layout
      }}
    >
      {children}
    </ContainerNodeContext.Provider>
  )
}

export default ContainerNodeProvider

export const useContainerNodeContext = () => {
  return useContext(ContainerNodeContext)
}
