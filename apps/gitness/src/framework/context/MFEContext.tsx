import { createContext } from 'react'

import { Hooks, Scope } from '@harness/microfrontends'

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
  routes: Partial<{
    toAccountSettings: () => string
    toOrgSettings: () => string
    toProjectSettings: () => string
  }>
  hooks: Omit<Hooks, 'useDocumentTitle'>
}

export const MFEContext = createContext<IMFEContext>({
  scope: {},
  renderUrl: '',
  customHooks: {},
  customUtils: {},
  customPromises: {},
  routes: {},
  hooks: {}
})
