import { ComponentType, createContext } from 'react'

interface Scope {
  accountId?: string
  orgIdentifier?: string
  projectIdentifier?: string
}

export type Unknown = any

export interface IMFEContext {
  /**
   * Scope will be later referred from "Scope" from @harness/microfrontends
   *  */
  scope: Scope
  renderUrl: string
  customComponents: {
    Link: ComponentType<any>
    NavLink: ComponentType<any>
    Switch: ComponentType<any>
    Route: ComponentType<any>
    Redirect: ComponentType<any>
  }
  customHooks: Partial<{
    useGenerateToken: Unknown
    useParams: Unknown
  }>
  customUtils: Partial<{
    navigate: Unknown
    navigateToUserProfile: Unknown
  }>
}

export const MFEContext = createContext<IMFEContext>({
  scope: {},
  renderUrl: '',
  customHooks: {},
  customUtils: {},
  customComponents: {
    Link: () => <></>,
    NavLink: () => <></>,
    Switch: () => <></>,
    Route: () => <></>,
    Redirect: () => <></>
  }
})
