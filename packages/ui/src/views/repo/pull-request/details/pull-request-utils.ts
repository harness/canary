import { TypesUser } from '@/types'
import { isEmpty } from 'lodash-es'

import { PullReqReviewDecision } from '../pull-request.types'
import {
  ApprovalItem,
  ApprovalItems,
  CommentItem,
  EnumPullReqReviewDecisionExtended,
  ReviewerListPullReqOkResponse,
  TypesPullReqActivity,
  TypesRuleViolations,
  TypesViolation
} from './pull-request-details-types'

export const processReviewDecision = (
  review_decision: EnumPullReqReviewDecisionExtended,
  reviewedSHA?: string,
  sourceSHA?: string
) =>
  review_decision === PullReqReviewDecision.approved && reviewedSHA !== sourceSHA
    ? PullReqReviewDecision.outdated
    : review_decision
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
export function getApprovalItems(approveState: PullReqReviewDecision, approvalItems: ApprovalItems[]): ApprovalItem[] {
  if (approveState === 'approve' || approveState === 'approved') {
    return approvalItems[0].items
  } else if (approveState === 'changereq') {
    return approvalItems[1].items
  }
  return []
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

export const extractInfoFromRuleViolationArr = (ruleViolationArr: TypesRuleViolations[]) => {
  const tempArray: unknown[] = ruleViolationArr?.flatMap(
    (item: { violations?: TypesViolation[] | null }) => item?.violations?.map(violation => violation.message) ?? []
  )
  const uniqueViolations = new Set(tempArray)
  const violationArr = [...uniqueViolations].map(violation => ({ violation: violation }))

  const checkIfBypassAllowed = ruleViolationArr.some(ruleViolation => ruleViolation.bypassed === false)

  return {
    uniqueViolations,
    checkIfBypassAllowed,
    violationArr
  }
}

export function easyPluralize(count: number, singular: string, plural: string, include?: boolean): string {
  const word = count === 1 ? singular : plural

  return include ? `${count} ${word}` : word
}
// check if activity item is a system comment
export function isSystemComment(commentItems: CommentItem<TypesPullReqActivity>[]) {
  return commentItems[0]?.payload?.payload?.kind === 'system'
}

//  check if comment item is a code comment
export function isCodeComment(commentItems: CommentItem<TypesPullReqActivity>[]) {
  return commentItems[0]?.payload?.payload?.type === 'code-comment'
}
// check if activity item is a comment
export function isComment(commentItems: CommentItem<TypesPullReqActivity>[]) {
  return commentItems[0]?.payload?.payload?.type === 'comment'
}

export function removeLastPlus(str: string) {
  if (typeof str !== 'string' || str.length === 0) {
    return str
  }

  // Check if the last character is a plus
  if (str.charAt(str.length - 1) === '+') {
    // Remove the last character
    return str.slice(0, -1)
  }

  return str
}

export enum FileViewedState {
  NOT_VIEWED,
  VIEWED,
  CHANGED
}

export function getFileViewedState(
  filePath?: string,
  fileSha?: string | undefined,
  views?: Map<string, string> | undefined
): FileViewedState {
  if (!filePath || !views || !views.has(filePath)) {
    return FileViewedState.NOT_VIEWED
  }

  const viewedSHA = views.get(filePath)

  // this case is only expected in case of pure rename - but we'll also use it as fallback.
  if (fileSha === undefined || fileSha === '') {
    return viewedSHA === FILE_VIEWED_OBSOLETE_SHA ? FileViewedState.CHANGED : FileViewedState.VIEWED
  }

  return viewedSHA === fileSha ? FileViewedState.VIEWED : FileViewedState.CHANGED
}

export const FILE_VIEWED_OBSOLETE_SHA = 'ffffffffffffffffffffffffffffffffffffffff'
