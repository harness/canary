import { TypesUser } from '@/types'
import { dispatchCustomEvent } from '@hooks/use-event-listener'
import { get, isEmpty } from 'lodash-es'

import { DiffViewerCustomEvent, DiffViewerEvent } from '../components/pull-request-diff-viewer'
import { PullReqReviewDecision } from '../pull-request.types'
import { innerBlockName, outterBlockName } from '../utils'
import {
  ApprovalItem,
  ApprovalItems,
  CommentItem,
  DiffHeaderProps,
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
      return 'success'
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
  return commentItems[0]?.payload?.kind === 'system'
}

//  check if comment item is a code comment
export function isCodeComment(commentItems: CommentItem<TypesPullReqActivity>[]) {
  return commentItems[0]?.payload?.type === 'code-comment'
}
// check if activity item is a comment
export function isComment(commentItems: CommentItem<TypesPullReqActivity>[]) {
  return commentItems[0]?.payload?.type === 'comment'
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

export function activitiesToDiffCommentItems(commentItem: CommentItem<TypesPullReqActivity>) {
  const right = get(commentItem.payload?.payload?.payload, 'line_start_new', false)
  const span = right
    ? commentItem?.payload?.payload?.code_comment?.span_new || 0
    : commentItem?.payload?.payload?.code_comment?.span_old || 0
  const lineNumberStart = (
    right
      ? commentItem?.payload?.payload?.code_comment?.line_new
      : commentItem?.payload?.payload?.code_comment?.line_old
  ) as number
  const lineNumberEnd = lineNumberStart + span - 1
  const diffSnapshotLines = get(commentItem.payload?.payload?.payload, 'lines', []) as string[]
  const leftLines: string[] = []
  const rightLines: string[] = []
  diffSnapshotLines.forEach(line => {
    const lineContent = line.substring(1) // line has a `prefix` (space, +, or -), always remove it

    if (line.startsWith('-')) {
      leftLines.push(lineContent)
    } else if (line.startsWith('+')) {
      rightLines.push(lineContent)
    } else {
      leftLines.push(lineContent)
      rightLines.push(lineContent)
    }
  })
  const diffHeader = get(commentItem.payload?.payload?.payload, 'title', '') as string
  const [oldStartLine, newStartLine] = diffHeader
    .replaceAll(/@|\+|-/g, '')
    .trim()
    .split(' ')
    .map(token => token.split(',')[0])
    .map(Number)
  const _startLine = right ? newStartLine : oldStartLine
  const codeLines = right ? rightLines : leftLines
  let lineIndex = 0

  while (lineIndex + _startLine < lineNumberStart) {
    lineIndex++
  }
  const codeBlockContent = codeLines
    .slice(lineNumberStart - _startLine, lineNumberStart - _startLine + lineNumberEnd - lineNumberStart + 1)
    .join('\n')

  return {
    commentItem: commentItem,
    left: !right,
    right,
    height: 0,
    lineNumberStart,
    lineNumberEnd,
    span,
    codeBlockContent
  }
}
type FileDropCallback = (file: File) => void

//handle file drop in image upload
export const handleFileDrop = (event: DragEvent, callback: FileDropCallback): void => {
  event.preventDefault()

  const file = event?.dataTransfer?.files[0]
  if (file) {
    callback(file)
  }
}

type PasteCallback = (file: File) => void

// handle file paste in image upload
export const handlePaste = (
  event: { preventDefault: () => void; clipboardData: DataTransfer },
  callback: PasteCallback
) => {
  event.preventDefault()
  const clipboardData = event.clipboardData
  const items = clipboardData.items

  if (items.length > 0) {
    const firstItem = items[0]
    if (firstItem.type.startsWith('image/') || firstItem.type.startsWith('video/')) {
      const blob = firstItem.getAsFile()
      if (blob) {
        callback(blob)
      }
    }
  }
}

function isInViewport(ele: HTMLElement) {
  const rect = ele.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

export const jumpToFile = (
  filePath: string,
  diffBlocks: DiffHeaderProps[][],
  setJumpToDiff: (filePath: string) => void,
  commentId?: string
) => {
  let loopCount = 0

  const blockIndex = diffBlocks.findIndex(block => block.some(diff => diff.filePath === filePath))
  if (blockIndex < 0) return

  function attemptScroll() {
    // Retrieve the top-level block + the sub-block + the final diff DOM
    const outerDOM = document.querySelector(`[data-block="${outterBlockName(blockIndex)}"]`) as HTMLElement | null
    const innerDOM = outerDOM?.querySelector(`[data-block="${innerBlockName(filePath)}"]`) as HTMLElement | null
    const diffDOM = innerDOM?.querySelector(`[data-diff-file-path="${filePath}"]`) as HTMLElement | null

    // Scroll them all in order outterBlock + innerBlock + the final diff
    outerDOM?.scrollIntoView(false)
    innerDOM?.scrollIntoView(false)
    diffDOM?.scrollIntoView(true)

    if (diffDOM && commentId) {
      dispatchCustomEvent<DiffViewerCustomEvent>(filePath, {
        action: DiffViewerEvent.SCROLL_INTO_VIEW,
        commentId: commentId
      })
    }

    // Re-check after a short delay if it’s truly in viewport
    // If not in viewport and loopCount < 100 => re-run
    setTimeout(() => {
      if (loopCount++ < 100) {
        if (
          !outerDOM ||
          !innerDOM ||
          !diffDOM ||
          !isInViewport(outerDOM) ||
          !isInViewport(innerDOM) ||
          !isInViewport(diffDOM)
        ) {
          attemptScroll()
        }
      } else {
        setJumpToDiff('')
      }
    }, 0)
  }

  attemptScroll()
}
