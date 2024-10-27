import { RepoData } from '../../../index'

export const mockRepoData: RepoData = {
  name: 'uuid',
  description: 'optimistic updates',
  defaultBranch: 'master',
  isPublic: false,
  branches: [
    { name: 'main', sha: 'sha2576836394e3' },
    { name: 'feature-branch-1', sha: 'sha38749348752' },
    { name: 'feature-branch-2', sha: 'sha981e7543832' }
  ]
}
