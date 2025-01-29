import { create } from 'zustand'

import { ISpaceStore } from '@harnessio/ui/views'

export const useSpaceStore = create<ISpaceStore>(set => ({
  space: null,
  setSpace: space => set({ space })
}))
