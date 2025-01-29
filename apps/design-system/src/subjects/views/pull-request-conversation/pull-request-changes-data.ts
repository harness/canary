export const currentUser = {
  uid: 'admin',
  email: 'admin@gitness.io',
  display_name: 'Administrator',
  admin: true,
  blocked: false,
  created: 1699863416002,
  updated: 1699863416002
}

export const commitData = {
  commits: [
    {
      sha: 'c59260ea5656e3e831b2d06a6524ad03c9f1ca9a',
      parent_shas: ['bf28bf043ef81c642a57b44b1b276e2eba4001fa'],
      title: 'Create gfdgfdgfdgfdg.txt',
      message: 'Create gfdgfdgfdgfdg.txt',
      author: {
        identity: {
          name: 'test1234',
          email: 'test1234@harness.io'
        },
        when: '2025-01-15T14:35:50-07:00'
      },
      committer: {
        identity: {
          name: 'Gitness',
          email: 'system@gitness.io'
        },
        when: '2025-01-15T14:35:50-07:00'
      }
    },
    {
      sha: 'bf28bf043ef81c642a57b44b1b276e2eba4001fa',
      parent_shas: ['0e5ec7a99e6a6d6dfc2781bd6834c0581f3361ca'],
      title: 'Create cxzcxczx.txt',
      message: 'Create cxzcxczx.txt',
      author: {
        identity: {
          name: 'test1234',
          email: 'test1234@harness.io'
        },
        when: '2025-01-15T14:35:30-07:00'
      },
      committer: {
        identity: {
          name: 'Gitness',
          email: 'system@gitness.io'
        },
        when: '2025-01-15T14:35:30-07:00'
      }
    }
  ],
  rename_details: [],
  total_commits: 2
}
