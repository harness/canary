import { createContext, useCallback, useContext, useState } from 'react'

import { ConnectorFormEntityType, ConnectorRightDrawerMode } from '../types'

interface ConnectorsContextProps {
  rightDrawerMode: ConnectorRightDrawerMode
  setRightDrawerMode: (value: ConnectorRightDrawerMode) => void
  formEntity: ConnectorFormEntityType | null
  setFormEntity: (value: ConnectorFormEntityType | null) => void
  clearRightDrawerData: () => void
}

const ConnectorsContext = createContext<ConnectorsContextProps>({
  rightDrawerMode: ConnectorRightDrawerMode.None,
  setRightDrawerMode: () => undefined,
  formEntity: null,
  setFormEntity: () => undefined,
  clearRightDrawerData: () => undefined
})

export const useConnectorsContext = () => {
  const context = useContext(ConnectorsContext)
  if (!context) {
    throw new Error('useConnectorsContext must be used within a ConnectorsProvider')
  }
  return context
}

type ConnectorsProviderProps = {
  children: React.ReactNode
}

export const ConnectorsProvider = ({ children }: ConnectorsProviderProps): JSX.Element => {
  const [rightDrawerMode, setRightDrawerMode] = useState<ConnectorRightDrawerMode>(ConnectorRightDrawerMode.None)
  const [formEntity, setFormEntity] = useState<ConnectorFormEntityType | null>(null)

  const clearRightDrawerData = useCallback(() => {
    setRightDrawerMode(ConnectorRightDrawerMode.None)
    setFormEntity(null)
  }, [])

  return (
    <ConnectorsContext.Provider
      value={{
        rightDrawerMode,
        setRightDrawerMode,
        formEntity,
        setFormEntity,
        clearRightDrawerData
      }}
    >
      {children}
    </ConnectorsContext.Provider>
  )
}
