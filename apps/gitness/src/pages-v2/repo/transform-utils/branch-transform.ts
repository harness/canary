import { TypesBranchExtended, TypesCommitDivergence } from '@harnessio/code-service-client'

import { timeAgoFromISOTime } from '../../../pages/pipeline-edit/utils/time-utils'

export const transformBranchList = (
  branches: TypesBranchExtended[],
  defaultBranch?: string,
  divergence?: TypesCommitDivergence[]
) => {
  return branches.map((branch, index) => {
    const { ahead, behind } = divergence?.[index] || {}
    return {
      id: index,
      name: branch.name || '',
      sha: branch.commit?.sha || '',
      timestamp: branch.commit?.committer?.when ? timeAgoFromISOTime(branch.commit.committer.when) : '',
      default: branch.name === defaultBranch || false,
      user: {
        name: branch.commit?.committer?.identity?.name || '',
        avatarUrl: ''
      },
      behindAhead: {
        behind: behind || 0,
        ahead: ahead || 0,
        default: defaultBranch === branch.name
      }
    }
  })
}
