import { RepoRepositoryOutput } from '@harnessio/code-service-client'

import { transformRepoList } from '../repo-list-transform'

// Mock data
const mockRepos: RepoRepositoryOutput[] = [
  {
    id: 1,
    identifier: 'repo1',
    description: 'A sample repository',
    is_public: false,
    num_forks: 5,
    num_pulls: 10,
    updated: 1617181723,
    created: 1617181723,
    importing: false
  }
]

// Tests

describe('transformRepoList', () => {
  it('should transform repository data correctly', () => {
    const result = transformRepoList(mockRepos)
    expect(result).toEqual([
      {
        id: 1,
        name: 'repo1',
        description: 'A sample repository',
        private: true,
        stars: 0,
        forks: 5,
        pulls: 10,
        timestamp: 'Jan 19, 1970', // Assuming timeAgoFromEpochTime returns 'just now'
        createdAt: 1617181723,
        importing: false
      }
    ])
  })
})
