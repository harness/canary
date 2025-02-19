import { create } from 'zustand'

import { RepoTagsStore } from '@harnessio/ui/views'

export const useRepoTagsStore = create<RepoTagsStore>(set => ({
  tags: [],
  branches: [],
  page: 1,
  xNextPage: 0,
  xPrevPage: 0,
  setPage: page => set({ page }),
  setPaginationFromHeaders: (xNextPage: number, xPrevPage: number) => {
    set({ xNextPage, xPrevPage })
  },
  setTags: tags => set({ tags }),
  addTag: tag => set(state => ({ tags: [tag, ...state.tags] })),
  removeTag: tagName => set(state => ({ tags: state.tags.filter(t => t.name !== tagName) }))
}))
