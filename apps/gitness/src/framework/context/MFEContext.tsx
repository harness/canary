import { createContext } from 'react'

import { Scope } from '@harness/microfrontends'

interface IMFEContext {
  scope?: Scope
}
export const MFEContext = createContext<IMFEContext>({
  scope: {}
})
