import { createContext, ReactNode, useContext } from 'react'

interface PortalContextProps {
  portalContainer?: Element | null
}

const PortalContext = createContext<PortalContextProps>({})

const PortalProvider = ({
  children,
  portalContainer
}: {
  children: ReactNode
  portalContainer?: PortalContextProps['portalContainer']
}) => {
  return <PortalContext.Provider value={{ portalContainer }}>{children}</PortalContext.Provider>
}

const usePortal = () => useContext(PortalContext)

export { PortalProvider, usePortal }
