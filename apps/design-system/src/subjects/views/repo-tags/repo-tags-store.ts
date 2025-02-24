import { RepoTagsStore } from '@harnessio/ui/views'

export const tagsStore: RepoTagsStore = {
  tags: [
    {
      name: 'v2.4.0',
      sha: '947bcbe92a5d40aacf861269b6605226adda0daf',
      is_annotated: false
    },
    {
      name: 'v2.3.1',
      sha: '794bdb1c56d885ae02f799c6cce13942e8614516',
      is_annotated: false
    },
    {
      name: 'v2.3.0',
      sha: '87f1c74cd8a14ea90635c56a627d5e99a4950c73',
      is_annotated: false
    },
    {
      name: 'v2.25.1-debug',
      sha: '3e7ecf16153e88919951725c3ecc69ff076c00b9',
      is_annotated: false
    }
  ],
  page: 1,
  xNextPage: 0,
  xPrevPage: 0,
  setPage: () => {},
  setPaginationFromHeaders: () => {},
  setTags: () => {},
  addTag: () => {},
  removeTag: () => {}
}
