import { create } from 'zustand'

import { ISPaceStore } from '@harnessio/ui/views'

export const useSpaceStore = create<ISPaceStore>(set => ({
  space: null,
  setSpace: space => set({ space })
}))
