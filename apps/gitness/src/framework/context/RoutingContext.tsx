import React, { createContext, ReactNode, useContext } from 'react'
import { Params } from 'react-router-dom'

// Enum defining the route constants
export enum RouteConstants {
  toRepoSummary = 'toRepoSummary',
  toRepoCommits = 'toRepoCommits'
}

// Type for a mapping of enum keys to functions that generate paths
export type RouteFunctionMap = Record<keyof typeof RouteConstants, (params: Params<string>) => string>

const RouteMappingContext = createContext<RouteFunctionMap | undefined>(undefined)

export const RoutingProvider: React.FC<{ value: RouteFunctionMap; children: ReactNode }> = ({ value, children }) => (
  <RouteMappingContext.Provider value={value}>{children}</RouteMappingContext.Provider>
)

export const useRoutes = (): RouteFunctionMap => {
  const context = useContext(RouteMappingContext)
  if (!context) {
    throw new Error('useRoutes must be used within a RoutingProvider')
  }
  return context
}
