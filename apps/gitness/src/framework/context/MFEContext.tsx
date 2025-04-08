import { createContext } from 'react'

interface Scope {
  accountId?: string
  orgIdentifier?: string
  projectIdentifier?: string
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
}

export const MFEContext = createContext<IMFEContext>({
  scope: {},
  renderUrl: '',
  customHooks: {},
  customUtils: {},
  customPromises: {}
})
