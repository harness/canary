import { create } from 'zustand'

import { ISpaceStore } from '@harnessio/ui/views'

export const useSpaceStore = create<ISpaceStore>(set => ({
  space: null,
  isLoading: false,
  setSpace: space => set({ space }),
  setIsLoading: isLoading => set({ isLoading })
}))
