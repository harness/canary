import { create } from 'zustand'

import { RepoCommitTag } from '@harnessio/code-service-client'

interface RepoTagsStore {
  tags: RepoCommitTag[]

  setTags: (tags: RepoCommitTag[]) => void
  addTag: (tag: RepoCommitTag) => void
  removeTag: (tagName: string) => void
}

export const useRepoTagsStore = create<RepoTagsStore>(set => ({
  tags: [],
  branches: [],
  setTags: tags => set({ tags }),
  addTag: tag => set(state => ({ tags: [...state.tags, tag] })),
  removeTag: tagName => set(state => ({ tags: state.tags.filter(t => t.name !== tagName) }))
}))
