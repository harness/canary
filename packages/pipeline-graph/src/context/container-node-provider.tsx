import { createContext, useContext, useMemo } from 'react'

import { ParallelContainerConfig, SerialContainerConfig } from '../types/container-node'
import {CollapseButtonProps} from "../components/components/collapse";

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
  portComponent?: (props: { side: 'left' | 'right'; id?: string; adjustment?: number }) => JSX.Element
  collapseButtonComponent?: (props: CollapseButtonProps) => JSX.Element
}

const ContainerNodeContext = createContext<ContainerNodeContextProps>({
  serialContainerConfig: defaultSerialContainerConfig,
  parallelContainerConfig: defaultParallelContainerConfig
})

export interface ContainerNodeProviderProps {
  serialContainerConfig?: Partial<SerialContainerConfig>
  parallelContainerConfig?: Partial<ParallelContainerConfig>
  portComponent?: (props: { side: 'left' | 'right'; id?: string; adjustment?: number }) => JSX.Element
  collapseButtonComponent?: (props: CollapseButtonProps) => JSX.Element
}

const ContainerNodeProvider = ({
  serialContainerConfig,
  parallelContainerConfig,
  portComponent,
  collapseButtonComponent,
  children
}: React.PropsWithChildren<ContainerNodeProviderProps>) => {
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
        parallelContainerConfig: parallelConfig,
        portComponent,
        collapseButtonComponent
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
