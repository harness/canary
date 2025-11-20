import { RefObject } from 'react'

import { TypesUser } from '@/types'
import { dispatchCustomEvent } from '@hooks/use-event-listener'
import { createRequestIdleCallbackTaskPool } from '@utils/task'
import { get, isEmpty } from 'lodash-es'

import { PR_ACCORDION_STICKY_TOP } from '../components/pull-request-accordian'
import { DiffViewerCustomEvent, DiffViewerEvent } from '../components/pull-request-diff-viewer'
import { PullReqReviewDecision } from '../pull-request.types'
import { innerBlockName, outterBlockName } from '../utils'
import {
  ApprovalItem,
  ApprovalItems,
  CommentItem,
  DefaultReviewersApprovalsData,
  DiffHeaderProps,
  EnumPullReqReviewDecisionExtended,
  ReviewerListPullReqOkResponse,
  TypesCodeCommentFields,
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
    case PullReqReviewDecision.approve:
      return 'success'
    case PullReqReviewDecision.changeReq:
      return 'danger'
    default:
      return 'default'
  }
}

export const getApprovalStateVariant = (state: PullReqReviewDecision) => {
  switch (state) {
    case PullReqReviewDecision.approved:
      return 'secondary'
    case PullReqReviewDecision.changeReq:
      return 'secondary'
    case PullReqReviewDecision.approve:
      return 'primary'
    default:
      return 'outline'
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

export function activitiesToDiffCommentItems(
  commentItem: CommentItem<TypesPullReqActivity>,
  linesDataPath?: string,
  dataPath?: string
) {
  const commentLineData = get(commentItem, linesDataPath || 'payload.payload.payload', {})
  const commentData: TypesCodeCommentFields | undefined = (
    get(commentItem, dataPath || 'payload.payload', {}) as TypesPullReqActivity
  )?.code_comment
  const right = get(commentLineData, 'line_start_new', false)
  const span = right ? commentData?.span_new || 0 : commentData?.span_old || 0
  const lineNumberStart = (right ? commentData?.line_new : commentData?.line_old) as number
  const lineNumberEnd = lineNumberStart + span - 1
  const diffSnapshotLines = get(commentLineData, 'lines', []) as string[]
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
  const diffHeader = get(commentLineData, 'title', '') as string
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

export function isInViewport(element: Element, margin = 0, direction: 'x' | 'y' | 'xy' = 'y') {
  const rect = element?.getBoundingClientRect()

  const height = window.innerHeight || document.documentElement.clientHeight
  const width = window.innerWidth || document.documentElement.clientWidth
  const _top = 0 - margin
  const _bottom = height + margin
  const _left = 0 - margin
  const _right = width + margin

  const yCheck =
    (rect?.top >= _top && rect?.top <= _bottom) ||
    (rect?.bottom >= _top && rect?.bottom <= _bottom) ||
    (rect?.top <= _top && rect?.bottom >= _bottom)
  const xCheck = (rect?.left >= _left && rect?.left <= _right) || (rect?.right >= _left && rect?.right <= _right)

  if (direction === 'y') return yCheck
  if (direction === 'x') return xCheck

  return yCheck || xCheck
}

// Estimate scroll position based on diff statistics and open/collapsed state
function estimateScrollPosition(
  targetIndex: number,
  allDiffs: DiffHeaderProps[],
  openItems: string[],
  baseScrollTop: number = 0
): number {
  let estimatedHeight = baseScrollTop

  for (let i = 0; i < Math.min(targetIndex, allDiffs.length); i++) {
    const diff = allDiffs[i]
    const isOpen = openItems.includes(diff.text || diff.filePath || '')

    if (isOpen) {
      // Expanded: ~30px per line + 80px for accordion header
      const lineCount = (diff.addedLines || 0) + (diff.deletedLines || 0)
      const estimatedDiffHeight = Math.max(lineCount * 30, 120) + 80 // Min 120px + header
      estimatedHeight += estimatedDiffHeight
    } else {
      // Collapsed: just accordion header height
      estimatedHeight += 50 // Collapsed accordion height
    }
  }

  return estimatedHeight
}

// Two-phase jump: estimate position → load content → exact scroll
export const jumpToFile = (
  filePath: string,
  diffBlocks: DiffHeaderProps[][],
  commentId?: string,
  diffsContainerRef?: RefObject<Element>,
  onLoadMoreDiffs?: (targetCount: number) => void,
  openItems: string[] = [],
  diffScrollCache?: Map<string, number>
) => {
  const { scheduleTask, cancelTask } = createRequestIdleCallbackTaskPool()
  let taskId = 0

  const allDiffs = diffBlocks.flat()
  const targetIndex = allDiffs.findIndex(diff => diff.filePath === filePath)
  const blockIndex = diffBlocks.findIndex(block => block.some(diff => diff.filePath === filePath))

  if (targetIndex < 0 || blockIndex < 0) return () => {} // Return empty cleanup function

  const scrollContainer = diffsContainerRef?.current?.closest('[data-scroll-container]') || document.documentElement

  // Check cache first for instant jump
  const cachedPosition = diffScrollCache?.get(filePath)

  // if innerBlockDOM available, scroll to it
  const exactScrollToTarget = () => {
    const outerBlockDOM = diffsContainerRef?.current?.querySelector(
      `[data-block="${outterBlockName(blockIndex)}"]`
    ) as HTMLElement | null
    const innerBlockDOM = outerBlockDOM?.querySelector(
      `[data-block="${innerBlockName(filePath)}"]`
    ) as HTMLElement | null

    outerBlockDOM?.scrollIntoView(false)

    // If innerBlockDOM is found, do exact scroll
    if (outerBlockDOM && innerBlockDOM) {
      const rect = innerBlockDOM.getBoundingClientRect()
      const currentScrollTop = scrollContainer.scrollTop || window.scrollY
      const exactScrollTop = currentScrollTop + rect.top - PR_ACCORDION_STICKY_TOP

      // Cache the exact position for future use
      diffScrollCache?.set(filePath, Math.max(0, exactScrollTop))

      scrollContainer.scrollTo({
        top: Math.max(0, exactScrollTop) // Instant jump
      })

      // Handle scrolling to a comment
      if (commentId) {
        dispatchCustomEvent<DiffViewerCustomEvent>(filePath, {
          action: DiffViewerEvent.SCROLL_INTO_VIEW,
          commentId: commentId
        })
      }

      return true // Success
    }
    return false // Target not found yet
  }

  // Phase 1: Try immediate exact scroll if target is already available
  if (exactScrollToTarget()) {
    return () => {
      if (taskId) cancelTask(taskId)
    }
  } else if (cachedPosition !== undefined) {
    scrollContainer.scrollTo({ top: cachedPosition }) // Instant jump
    return () => {}
  }

  // Phase 2: Target not available - scroll to estimated position
  const estimatedPosition = estimateScrollPosition(targetIndex, allDiffs, openItems)
  scrollContainer.scrollTo({ top: estimatedPosition }) // Instant jump to estimate

  // If exact scroll failed, start polling for target to appear
  let attempts = 0
  const maxAttempts = 25

  const pollForTarget = () => {
    taskId = scheduleTask(() => {
      attempts++
      if (exactScrollToTarget()) {
        cancelTask(taskId)
        return
      }

      if (attempts < maxAttempts) {
        // Continue polling
        setTimeout(pollForTarget, 10)
      } else {
        // Timeout - scroll to estimated position as fallback
        console.warn(`jumpToFile timeout for ${filePath}, using estimated position`)
        scrollContainer.scrollTo({ top: estimatedPosition })
        cancelTask(taskId)
      }
    })
  }

  // Start polling immediately - no delay between phases
  pollForTarget()

  return () => {
    if (taskId) cancelTask(taskId)
  }
}

export const getDefaultReviewersApprovalCount = (data: DefaultReviewersApprovalsData): string => {
  if (data.minimum_required_count && data.minimum_required_count > 0) {
    return `${data.current_count} / ${data.minimum_required_count}`
  }

  if (data?.minimum_required_count_latest && data?.minimum_required_count_latest > 0) {
    return `${data.current_count} / ${data.minimum_required_count_latest}`
  }

  return `${data.current_count}`
}
