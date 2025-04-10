import { RepoTagsStore } from '@harnessio/ui/views'

export const tagsStore: RepoTagsStore = {
  tags: [
    {
      name: 'v2.4.0',
      sha: 'dd6135add66c91c74b21aa7514a57fdc8d5dc320',
      is_annotated: true,
      title: 'v2.4.0',
      message: 'v2.4.0',
      tagger: {
        identity: {
          name: 'user',
          email: 'user@gmail.com'
        },
        when: '2025-04-07T10:08:00Z'
      }
    },
    {
      name: 'v2.3.0',
      sha: 'f067dc95f956b2b195f30635e6d6e74e774d2108',
      is_annotated: true,
      title: 'v2.3.0',
      message: 'v2.3.0',
      tagger: {
        identity: {
          name: 'user',
          email: 'user@gmail.com'
        },
        when: '2025-04-07T09:04:05Z'
      }
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
