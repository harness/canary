import { createContext } from 'react'

export interface Scope {
  accountId?: string
  orgIdentifier?: string
  projectIdentifier?: string
}

export interface RouteDefinitions {
  toRepositories: ({ space }: { space: string }) => string
  toPipelines: ({
    accountId,
    orgIdentifier,
    projectIdentifier,
    mode
  }: {
    accountId: string
    orgIdentifier?: string
    projectIdentifier?: string
    mode: 'all'
  }) => string
}

export type Unknown = any

interface IMFEContext {
  /**
   * Scope will be later referred from "Scope" from @harness/microfrontends
   *  */
  scope: Scope
  renderUrl: string
  customHooks: Partial<{
    useGenerateToken: Unknown
  }>
  customUtils: Partial<{
    navigateToUserProfile: Unknown
  }>
  customPromises: Partial<{
    getCurrentUser: Unknown
  }>
  routes: Partial<RouteDefinitions>
}

export const MFEContext = createContext<IMFEContext>({
  scope: {},
  renderUrl: '',
  customHooks: {},
  customUtils: {},
  customPromises: {},
  routes: {}
})
