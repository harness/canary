import { z } from 'zod'

import { tokenCreateFormSchema } from './components/token-create/token-create-form'
import { ProfileFields } from './profile-settings-general-page'

export type TokenFormType = z.infer<typeof tokenCreateFormSchema>

export interface AlertDeleteParams {
  identifier: string
  type: string
}

export enum ApiErrorType {
  KeyFetch = 'keyFetch',
  TokenFetch = 'tokenFetch',
  KeyCreate = 'keyCreate',
  TokenCreate = 'tokenCreate',
  TokenDelete = 'tokenDelete',
  KeyDelete = 'keyDelete'
}

export interface KeysList {
  created?: number
  verified?: number | null
  identifier?: string
  usage?: string
  fingerprint?: string
  comment?: string
  type?: string
}

export interface TokensList {
  principal_id?: number
  type?: string
  identifier?: string
  expires_at?: number | null
  issued_at?: number
  created_by?: number
  uid?: string
}

export interface IProfileSettingsStore {
  publicKeys: KeysList[]
  tokens: TokensList[]
  createdTokenData: (TokenFormType & { token: string }) | null
  userData: ProfileFields | null

  setPublicKeys: (data: KeysList[]) => void
  addPublicKey: (key: KeysList) => void
  deletePublicKey: (id: string) => void
  setTokens: (data: TokensList[]) => void
  deleteToken: (id: string) => void
  addToken: (data: TokensList) => void
  setCreatedTokenData: (data: (TokenFormType & { token: string }) | null) => void
  setUserData: (data: ProfileFields) => void
}
