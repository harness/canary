import React, { createContext, useContext } from 'react'

import { routes } from '../../routes'
import { RouteFunctionMap } from '../routing/types'
import { getRouteMapping } from '../routing/utils'

const RouteMappingContext = createContext<RouteFunctionMap | undefined>(undefined)

export const RoutingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <RouteMappingContext.Provider value={getRouteMapping({ routes })}>{children}</RouteMappingContext.Provider>
}

export const useRoutes = (): RouteFunctionMap => {
  const context = useContext(RouteMappingContext)
  if (!context) {
    throw new Error('useRoutes must be used within a RoutingProvider')
  }
  return context
}
