import { noop } from '@utils/viewUtils'

export const repoCommitStore = {
  setPage: noop,
  commits: [
    {
      sha: 'eda4155c2361653f9e0397633920229d9457b044',
      parent_shas: ['44ba60511d58408a17edb499dbc071c537e8f1a7'],
      title: 'Rename bot.txt to bot-edit.txt',
      message: 'Rename bot.txt to bot-edit.txt',
      author: {
        identity: {
          name: 'Administrator',
          email: 'test@google.io'
        },
        when: '2024-02-14T23:00:18-07:00'
      },
      committer: {
        identity: {
          name: 'Administrator',
          email: 'test@google.io'
        },
        when: '2024-02-14T23:00:18-07:00'
      },
      stats: {
        total: {
          insertions: 0,
          deletions: 0,
          changes: 0
        },
        files: [
          {
            path: 'bot-edit.txt',
            old_path: 'bot.txt',
            status: 'RENAMED',
            insertions: 0,
            deletions: 0,
            changes: 0
          }
        ]
      }
    }
  ],
  totalPages: 0,
  setCommits: noop,
  page: 1,
  selectedCommit: { title: '', sha: '' }
}
