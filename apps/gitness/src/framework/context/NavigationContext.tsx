import { createContext, useContext } from 'react'

import { CustomRouteObject, RouteFunctionMap } from '../routing/types'
import { getRouteMapping } from '../routing/utils'

const RouteMappingContext = createContext<RouteFunctionMap | undefined>(undefined)

interface NavigationProviderProps {
  routes: CustomRouteObject[]
  children: React.ReactNode
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ routes, children }) => {
  return <RouteMappingContext.Provider value={getRouteMapping({ routes })}>{children}</RouteMappingContext.Provider>
}

export const useRoutes = (): RouteFunctionMap => {
  const context = useContext(RouteMappingContext)
  if (!context) {
    throw new Error('useRoutes must be used within a NavigationProvider')
  }
  return context
}
