import { ListBranchesOkResponse, TypesBranchExtended, TypesCommitDivergence } from '@harnessio/code-service-client'
import { BranchData, PullRequestType } from '@harnessio/ui/views'

import { timeAgoFromISOTime } from '../../../pages/pipeline-edit/utils/time-utils'

export const transformBranchList = (
  branches: TypesBranchExtended[],
  defaultBranch?: string,
  divergence?: TypesCommitDivergence[]
): BranchData[] => {
  return branches.map((branch, index) => {
    const { ahead, behind } = divergence?.[index] || {}
    return {
      id: index,
      name: branch.name || '',
      sha: branch.commit?.sha || '',
      timestamp: branch.commit?.author?.when ? timeAgoFromISOTime(branch.commit.author.when) : '',
      default: branch.name === defaultBranch || branch.is_default || false,
      user: {
        name: branch.commit?.author?.identity?.name || '',
        avatarUrl: ''
      },
      behindAhead: {
        behind: behind || 0,
        ahead: ahead || 0,
        default: defaultBranch === branch.name || branch.is_default || false
      },
      pullRequests: (branch.pull_requests as PullRequestType[]) || []
    }
  })
}

export function apiBranches2BranchNames(apiBranches?: ListBranchesOkResponse) {
  return apiBranches?.map(apiBranch => apiBranch.name ?? '')
}

export function apiBranches2DefaultBranchName(apiBranches?: ListBranchesOkResponse, defaultBranch = 'main') {
  return apiBranches?.find(apiBranch => apiBranch.is_default)?.name ?? defaultBranch
}
