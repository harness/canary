import { TypesCommit } from '../repo.types'

export interface TypeTagger {
  identity: { email?: string; name?: string }
  when?: string
}

export interface CommitTagType {
  commit?: TypesCommit
  is_annotated?: boolean
  message?: string
  name: string
  sha: string
  tagger?: TypeTagger
  title?: string
}

export interface RepoTagsStore {
  tags: CommitTagType[]
  page: number
  xNextPage: number
  xPrevPage: number
  setPaginationFromHeaders: (xNextPage: number, xPrevPage: number) => void
  setPage: (page: number) => void
  setTags: (tags: CommitTagType[]) => void
  addTag: (tag: CommitTagType) => void
  removeTag: (tagName: string) => void
}
