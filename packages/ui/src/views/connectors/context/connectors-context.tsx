import { createContext, useCallback, useContext, useState } from 'react'

import { ConnectorFormEntityType, ConnectorRightDrawer } from '../types'

interface ConnectorsContextProps {
  rightDrawer: ConnectorRightDrawer
  setRightDrawer: (value: ConnectorRightDrawer) => void
  formEntity: ConnectorFormEntityType | null
  setFormEntity: (value: ConnectorFormEntityType | null) => void
  clearRightDrawerData: () => void
}

const ConnectorsContext = createContext<ConnectorsContextProps>({
  rightDrawer: ConnectorRightDrawer.None,
  setRightDrawer: () => undefined,
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
  const [rightDrawer, setRightDrawer] = useState<ConnectorRightDrawer>(ConnectorRightDrawer.None)
  const [formEntity, setFormEntity] = useState<ConnectorFormEntityType | null>(null)

  const clearRightDrawerData = useCallback(() => {
    setRightDrawer(ConnectorRightDrawer.None)
    setFormEntity(null)
  }, [])

  return (
    <ConnectorsContext.Provider
      value={{
        rightDrawer,
        setRightDrawer,
        formEntity,
        setFormEntity,
        clearRightDrawerData
      }}
    >
      {children}
    </ConnectorsContext.Provider>
  )
}
