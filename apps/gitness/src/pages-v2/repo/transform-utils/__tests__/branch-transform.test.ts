import { ListBranchesOkResponse, TypesBranchExtended, TypesCommitDivergence } from '@harnessio/code-service-client'

import { apiBranches2BranchNames, apiBranches2DefaultBranchName, transformBranchList } from '../branch-transform'

// Mock data
const mockBranches: TypesBranchExtended[] = [
  {
    name: 'main',
    commit: {
      sha: 'abc123',
      committer: { when: '2025-01-02T00:00:00Z', identity: { name: 'John Doe' } },
      author: { when: '2025-01-02T00:00:00Z', identity: { name: 'John Doe' } }
    },
    is_default: true
  },
  {
    name: 'feature',
    commit: {
      sha: 'def456',
      committer: { when: '2025-01-02T00:00:00Z', identity: { name: 'Jane Smith' } },
      author: { when: '2025-01-02T00:00:00Z', identity: { name: 'Jane Smith' } }
    },
    is_default: false
  }
]
const mockDivergence: TypesCommitDivergence[] = [
  { ahead: 5, behind: 3 },
  { ahead: 2, behind: 1 }
]

const mockApiBranches: ListBranchesOkResponse = [
  { name: 'main', is_default: true },
  { name: 'feature', is_default: false }
]

describe('transformBranchList', () => {
  beforeAll(() => {
    // Set the system time to a specific date
    vi.setSystemTime(new Date('2025-01-03T00:00:00Z'))
  })

  it('should transform branch data correctly', () => {
    const result = transformBranchList(mockBranches, 'main', mockDivergence)
    expect(result).toEqual([
      {
        id: 0,
        name: 'main',
        sha: 'abc123',
        timestamp: 'yesterday', // Adjust this according to your expectations
        default: true,
        user: { name: 'John Doe', avatarUrl: '' },
        behindAhead: { behind: 3, ahead: 5, default: true },
        pullRequests: []
      },
      {
        id: 1,
        name: 'feature',
        sha: 'def456',
        timestamp: 'yesterday', // Adjust this according to your expectations
        default: false,
        user: { name: 'Jane Smith', avatarUrl: '' },
        behindAhead: { behind: 1, ahead: 2, default: false },
        pullRequests: []
      }
    ])
  })
})

describe('apiBranches2BranchNames', () => {
  it('should extract branch names from API response', () => {
    const result = apiBranches2BranchNames(mockApiBranches)
    expect(result).toEqual(['main', 'feature'])
  })
})

describe('apiBranches2DefaultBranchName', () => {
  it('should extract default branch name from API response', () => {
    const result = apiBranches2DefaultBranchName(mockApiBranches)
    expect(result).toBe('main')
  })
})
