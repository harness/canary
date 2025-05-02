import { createContext } from 'react'

/**
 * @todo import from '@harness/microfrontends'
 * Currently, unable to do so due to npm access issues.
 */
export interface Scope {
  accountId?: string
  orgIdentifier?: string
  projectIdentifier?: string
}

export interface UseLogoutReturn {
  forceLogout: () => void
}

export declare const useLogout: () => UseLogoutReturn

export interface Hooks {
  useLogout?: typeof useLogout
}

/**************/

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
  hooks: Hooks
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
