import { create } from 'zustand'

// import { GetUserOkResponse } from '@harnessio/code-service-client'
import { IProfileSettingsStore, KeysList, ProfileFields, TokenFormType, TokensList } from '@harnessio/ui/views'

export const useProfileSettingsStore = create<IProfileSettingsStore>(set => ({
  publicKeys: [],
  tokens: [],
  createdTokenData: null,
  userData: null,

  setPublicKeys: (data: KeysList[]) => {
    set({
      publicKeys: data
    })
  },
  setTokens: (data: TokensList[]) => {
    set({
      tokens: data
    })
  },
  deleteToken: (id: string) => {
    set(state => ({
      tokens: state.tokens.filter(token => token.identifier !== id)
    }))
  },
  addToken: (token: TokensList) => set(state => ({ tokens: [token, ...state.tokens] })),
  deletePublicKey: (id: string) =>
    set(state => ({
      publicKeys: state.publicKeys.filter(key => key.identifier !== id)
    })),
  addPublicKey: (key: KeysList) => set(state => ({ publicKeys: [key, ...state.publicKeys] })),
  setCreatedTokenData: (data: (TokenFormType & { token: string }) | null) => set({ createdTokenData: data }),
  setUserData: (data: ProfileFields) =>
    set({
      userData: data
    })
}))
