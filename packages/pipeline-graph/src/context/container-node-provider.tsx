import { createContext, useContext, useMemo } from 'react'

import { ParallelContainerConfig, SerialContainerConfig } from '../types/container-node'

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
  serialContainerConfig: SerialContainerConfig
  parallelContainerConfig: ParallelContainerConfig
}

const ContainerNodeContext = createContext<ContainerNodeContextProps>({
  serialContainerConfig: defaultSerialContainerConfig,
  parallelContainerConfig: defaultParallelContainerConfig
})

const ContainerNodeProvider = ({
  serialContainerConfig,
  parallelContainerConfig,
  children
}: React.PropsWithChildren<{
  serialContainerConfig?: Partial<SerialContainerConfig>
  parallelContainerConfig?: Partial<ParallelContainerConfig>
}>) => {
  const serialConfig: SerialContainerConfig = useMemo(() => {
    const merged = { ...defaultSerialContainerConfig, ...serialContainerConfig }
    merged.serialGroupAdjustment = (merged.paddingTop - merged.paddingBottom) / 2
    return merged
  }, [serialContainerConfig])

  const parallelConfig: ParallelContainerConfig = useMemo(() => {
    const merged = { ...defaultParallelContainerConfig, ...parallelContainerConfig }
    merged.parallelGroupAdjustment = 0
    return merged
  }, [serialContainerConfig])

  return (
    <ContainerNodeContext.Provider
      value={{
        serialContainerConfig: serialConfig,
        parallelContainerConfig: parallelConfig
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
