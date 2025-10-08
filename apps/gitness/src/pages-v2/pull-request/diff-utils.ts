import { isEmpty } from 'lodash-es'

import { ReviewerListPullReqOkResponse, TypesUser } from '@harnessio/code-service-client'

import { ApprovalItem, ApprovalItems, PullReqReviewDecision } from './types'

export function parseSpecificDiff(
  rawDiff: string,
  sourceFileName: string,
  targetFileName: string,
  checksumBefore?: string | string[],
  checksumAfter?: string
) {
  const diffs = rawDiff.split(/(?=^diff --git)/gm)

  for (const diff of diffs) {
    // Try checksum matching first (most reliable)
    if (checksumBefore || checksumAfter) {
      const indexLineMatch = diff.match(/^index ([a-f0-9]+)\.\.([a-f0-9]+)/m)
      if (indexLineMatch) {
        const [, beforeChecksum, afterChecksum] = indexLineMatch

        // Compare checksums (use first 7 chars for short SHA comparison)
        const checksumBeforeStr = Array.isArray(checksumBefore) ? checksumBefore[0] : checksumBefore
        const beforeMatches = !checksumBeforeStr || beforeChecksum.startsWith(checksumBeforeStr.slice(0, 7))
        const afterMatches = !checksumAfter || afterChecksum.startsWith(checksumAfter.slice(0, 7))

        if (beforeMatches && afterMatches) {
          return diff
        }
      }
    }

    // Fallback to path matching if no checksums or checksum matching failed
    const diffHeaderMatch = diff.match(/^diff --git a\/(.+?) b\/(.+?)$/m)
    if (diffHeaderMatch) {
      const [, aPath, bPath] = diffHeaderMatch
      const expectedAPath = sourceFileName === 'dev/null' ? targetFileName : sourceFileName

      // Check for exact path matches
      if (aPath === expectedAPath && bPath === targetFileName) {
        return diff
      }
    }
  }

  return undefined
}

export const determineOverallDecision = (data: ReviewerListPullReqOkResponse | undefined, currentUser: TypesUser) => {
  if (data === null || isEmpty(data)) {
    return PullReqReviewDecision.approve // Default case
  }
  // Check if the current user is among the reviewers
  const currentUserReviews = data?.filter(val => val?.reviewer?.uid === currentUser.uid)
  if (currentUserReviews?.length === 0) {
    // Current user not found among reviewers, return default approval state
    return PullReqReviewDecision.approve
  }

  // Directly return based on the review decision of the current user
  const decision = currentUserReviews && currentUserReviews[0]?.review_decision
  if (decision === PullReqReviewDecision.changeReq) {
    return PullReqReviewDecision.changeReq
  } else if (decision === PullReqReviewDecision.approved) {
    return PullReqReviewDecision.approved
  } else {
    return PullReqReviewDecision.approve // Default case or any other state not explicitly handled
  }
}

export const getApprovalStateTheme = (state: PullReqReviewDecision) => {
  switch (state) {
    case PullReqReviewDecision.approved:
      return 'success'
    case PullReqReviewDecision.approve:
      return 'primary'
    case PullReqReviewDecision.changeReq:
      return 'warning'
    default:
      return 'default'
  }
}

export function getApprovalItems(approveState: PullReqReviewDecision, approvalItems: ApprovalItems[]): ApprovalItem[] {
  if (approveState === 'approve' || approveState === 'approved') {
    return approvalItems[0].items
  } else if (approveState === 'changereq') {
    return approvalItems[1].items
  }
  return []
}

export const approvalItems = [
  {
    id: 0,
    state: 'success',
    method: 'approve',
    title: 'Approve',
    items: [
      {
        id: 0,
        title: 'Request changes',
        state: 'changereq',
        method: 'changereq'
      }
    ]
  },
  {
    id: 1,
    state: 'changereq',
    title: 'Changes requested',
    method: 'changereq',
    items: [
      {
        id: 0,
        title: 'Approve',
        state: 'approved',
        method: 'approved'
      }
    ]
  }
]
