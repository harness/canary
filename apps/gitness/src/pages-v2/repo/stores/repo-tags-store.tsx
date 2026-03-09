import { create } from 'zustand'

import { RepoTagsStore } from '@harnessio/views'

export const useRepoTagsStore = create<RepoTagsStore>(set => ({
  tags: [],
  page: 1,
  pageSize: 25,
  xNextPage: 0,
  xPrevPage: 0,
  setPage: page => set({ page }),
  setPageSize: size => set({ pageSize: size, page: 1 }),
  setPaginationFromHeaders: (xNextPage: number, xPrevPage: number) => {
    set({ xNextPage, xPrevPage })
  },
  setTags: tags => set({ tags }),
  addTag: tag => set(state => ({ tags: [tag, ...state.tags] })),
  removeTag: tagName => set(state => ({ tags: state.tags.filter(t => t.name !== tagName) }))
}))
