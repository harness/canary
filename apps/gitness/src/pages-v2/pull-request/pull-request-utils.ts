import type * as Diff2Html from 'diff2html'
import HoganJsUtils from 'diff2html/lib/hoganjs-utils'
import { get, isEmpty } from 'lodash-es'

import {
  EnumPullReqReviewDecision,
  ListPullReqQueryQueryParams,
  TypesCodeOwnerEvaluationEntry,
  TypesOwnerEvaluation,
  TypesRuleViolations,
  TypesViolation
} from '@harnessio/code-service-client'
import {
  DefaultReviewersApprovalsData,
  DefaultReviewersDataProps,
  easyPluralize,
  ExecutionState,
  ExtendedScope,
  PRListFilters,
  Scope
} from '@harnessio/views'

import { extractInfoForPRPanelChangesProps, PullReqReviewDecision, TypeCheckData } from './types'

export const processReviewDecision = (
  review_decision: EnumPullReqReviewDecision | PullReqReviewDecision.outdated,
  reviewedSHA?: string,
  sourceSHA?: string
) =>
  review_decision === PullReqReviewDecision.approved && reviewedSHA !== sourceSHA
    ? PullReqReviewDecision.outdated
    : review_decision

export function generateStatusSummary(checks: TypeCheckData[]) {
  // Initialize counts for each status
  const statusCounts = {
    failedReq: 0,
    pendingReq: 0,
    runningReq: 0,
    failureIgnoredReq: 0,
    successReq: 0,
    failed: 0,
    pending: 0,
    running: 0,
    succeeded: 0,
    total: checks?.length || 0
  }
  if (isEmpty(checks)) {
    return { message: '', summary: statusCounts }
  }

  // Count occurrences of each status
  checks.forEach(check => {
    const status = check.check.status
    const required = check.required

    switch (status) {
      case ExecutionState.FAILURE:
      case ExecutionState.ERROR:
        if (required) {
          statusCounts.failedReq += 1
        } else {
          statusCounts.failed += 1
        }
        break

      case ExecutionState.PENDING:
        if (required) {
          statusCounts.pendingReq += 1
        } else {
          statusCounts.pending += 1
        }
        break

      case ExecutionState.RUNNING:
        if (required) {
          statusCounts.runningReq += 1
        } else {
          statusCounts.running += 1
        }
        break

      case ExecutionState.FAILURE_IGNORED:
        if (required) {
          statusCounts.failureIgnoredReq += 1
        } else {
          statusCounts.failureIgnoredReq += 1
        }
        break

      case ExecutionState.SUCCESS:
        if (required) {
          statusCounts.successReq += 1
        } else {
          statusCounts.succeeded += 1
        }
        break

      default:
        console.error('Unrecognized status:', status)
        break
    }
  })

  // Format the summary string
  const summaryParts = []
  if (statusCounts.failed > 0 || statusCounts.failedReq) {
    const num = statusCounts.failed + statusCounts.failedReq
    summaryParts.push(`${num} failed`)
  }
  if (statusCounts.pending > 0 || statusCounts.pendingReq > 0) {
    const num = statusCounts.pending + statusCounts.pendingReq
    summaryParts.push(`${num} pending`)
  }
  if (statusCounts.running > 0 || statusCounts.runningReq) {
    const num = statusCounts.running + statusCounts.runningReq
    summaryParts.push(`${num} running`)
  }
  if (statusCounts.succeeded > 0 || statusCounts.successReq || statusCounts.failureIgnoredReq) {
    const num = statusCounts.succeeded + statusCounts.successReq + statusCounts.failureIgnoredReq
    summaryParts.push(`${num} succeeded`)
  }

  return { message: summaryParts.join(', '), summary: statusCounts }
}

export function checkRequired(checkData: TypeCheckData[]) {
  return checkData.some(item => item.required)
}

export function determineStatusMessage(
  checks: TypeCheckData[]
): { title: string; content: string; color: string; status: string } | undefined {
  if (checks === undefined || isEmpty(checks)) {
    return undefined
  }
  const { message } = generateStatusSummary(checks)
  let title = ''
  let content = ''
  let color = ''
  let status = ''
  const oneRuleHasRequired = checkRequired(checks)
  if (oneRuleHasRequired) {
    if (
      checks.some(
        check =>
          (check.required && check.check.status === ExecutionState.FAILURE) ||
          (check.required && check.check.status === ExecutionState.ERROR)
      )
    ) {
      title = 'Some required checks have failed'
      content = `${message}`
      color = 'text-cn-danger'
      status = 'failure'
    } else if (checks.some(check => check.required && check.check.status === ExecutionState.PENDING)) {
      title = 'Some required checks are pending'
      status = 'pending'
      content = `${message}`
      color = 'text-cn-warning'
    } else if (checks.some(check => check.required && check.check.status === ExecutionState.RUNNING)) {
      title = 'Some required checks are running'
      status = 'running'
      content = `${message}`
      color = 'text-cn-warning'
    } else if (
      checks.every(
        check =>
          check?.check?.status !== undefined &&
          [ExecutionState.SUCCESS, ExecutionState.FAILURE_IGNORED].includes(check.check.status as ExecutionState)
      )
    ) {
      title = 'All checks have succeeded'
      content = `${message}`
      color = 'text-cn-3'
    } else {
      title = 'All required checks passed'
      content = `${message}`
      status = 'success'
      color = 'text-cn-success'
    }
  } else {
    if (
      checks.some(check => check.check.status === ExecutionState.FAILURE || check.check.status === ExecutionState.ERROR)
    ) {
      title = 'Some checks have failed'
      content = ` ${message}`
      status = 'failure'
      color = 'text-cn-danger'
    } else if (checks.some(check => check.check.status === ExecutionState.PENDING)) {
      title = 'Some checks haven’t been completed yet'
      status = 'pending'
      content = `${message}`
      color = 'text-cn-warning'
    } else if (checks.some(check => check.check.status === ExecutionState.RUNNING)) {
      title = 'Some checks are running'
      content = `${message}`
      status = 'running'
      color = 'text-cn-warning'
    } else if (
      checks.every(
        check =>
          check?.check?.status !== undefined &&
          [ExecutionState.SUCCESS, ExecutionState.FAILURE_IGNORED].includes(check.check.status as ExecutionState)
      )
    ) {
      title = 'All checks have succeeded'
      content = `${message}`
      color = 'text-cn-3'
      status = 'success'
    }
  }
  return { title, content, color, status }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractSpecificViolations(violationsData: any, rule: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const specificViolations = violationsData?.data?.rule_violations.flatMap((violation: { violations: any[] }) =>
    violation.violations.filter(v => v.code === rule)
  )
  return specificViolations
}

export const checkIfOutdatedSha = (reviewedSHA?: string, sourceSHA?: string) =>
  reviewedSHA !== sourceSHA || reviewedSHA !== sourceSHA ? true : false

// find code owner request decision from given entries
export const findChangeReqDecisions = (
  entries: TypesCodeOwnerEvaluationEntry[] | null | undefined,
  decision: string
) => {
  if (entries === null || entries === undefined) {
    return []
  } else {
    return entries
      .map((entry: TypesCodeOwnerEvaluationEntry) => {
        // Filter the owner_evaluations for 'changereq' decisions
        const changeReqEvaluations = entry?.owner_evaluations?.filter(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (evaluation: any) => evaluation?.review_decision === decision
        )

        // If there are any 'changereq' decisions, return the entry along with them
        if (changeReqEvaluations && changeReqEvaluations?.length > 0) {
          return { ...entry, owner_evaluations: changeReqEvaluations }
        }
      }) // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((entry: any) => entry !== null && entry !== undefined) // Filter out the null entries
  }
}

export const findWaitingDecisions = (
  entries: TypesCodeOwnerEvaluationEntry[] | null | undefined,
  source_sha: string,
  reqCodeOwnerLatestApproval?: boolean
) => {
  if (isEmpty(entries) || entries === null || entries === undefined) {
    //adding extra check to bypass typescript error
    return []
  } else {
    return entries.filter((entry: TypesCodeOwnerEvaluationEntry) => {
      const hasNoReview = entry?.owner_evaluations?.every(
        (evaluation: TypesOwnerEvaluation | { review_decision: string }) => evaluation.review_decision === ''
      )

      // add entry if no review found from codeowners
      if (hasNoReview) return true
      // add entry to waiting decision array if approved changes are outdated or no approvals are found for the given entry
      const hasNoApprovedDecision = !entry?.owner_evaluations?.some(
        evaluation =>
          evaluation.review_decision === PullReqReviewDecision.approved &&
          (reqCodeOwnerLatestApproval ? evaluation.review_sha === source_sha : true)
      )
      return hasNoApprovedDecision
    })
  }
}

export const getUnifiedDefaultReviewersState = (info?: DefaultReviewersApprovalsData[]): DefaultReviewersDataProps => {
  const defaultReviewState = {
    defReviewerApprovalRequiredByRule: false,
    defReviewerLatestApprovalRequiredByRule: false,
    defReviewerApprovedLatestChanges: true,
    defReviewerApprovedChanges: true
  }

  info?.forEach(({ current_count, minimum_required_count, minimum_required_count_latest }) => {
    if (minimum_required_count !== undefined && minimum_required_count > 0) {
      defaultReviewState.defReviewerApprovalRequiredByRule = true
      if (current_count !== undefined && current_count < minimum_required_count) {
        defaultReviewState.defReviewerApprovedChanges = false
      }
    }
    if (minimum_required_count_latest !== undefined && minimum_required_count_latest > 0) {
      defaultReviewState.defReviewerLatestApprovalRequiredByRule = true
      if (current_count !== undefined && current_count < minimum_required_count_latest) {
        defaultReviewState.defReviewerApprovedLatestChanges = false
      }
    }
  })

  return defaultReviewState
}

export const extractInfoForPRPanelChanges = ({
  approvedEvaluations,
  reqNoChangeReq,
  codeOwnersData,
  minApproval,
  minReqLatestApproval,
  latestApprovalArr,
  changeReqReviewer,
  changeReqEvaluations,
  defaultReviewersData,
  mergeBlockedViaRule
}: extractInfoForPRPanelChangesProps) => {
  let statusMessage = ''
  let statusColor = 'grey' // Default color for no rules required
  let title = ''
  let statusIcon = ''
  let isNotRequired = false
  const {
    reqCodeOwnerApproval,
    reqCodeOwnerLatestApproval,
    codeOwnerChangeReqEntries,
    codeOwnerPendingEntries,
    latestCodeOwnerApprovalArr,
    codeOwnerApprovalEntries
  } = codeOwnersData
  const {
    defReviewerApprovalRequiredByRule,
    defReviewerLatestApprovalRequiredByRule,
    defReviewerApprovedLatestChanges,
    defReviewerApprovedChanges
  } = defaultReviewersData || {}

  if (
    reqNoChangeReq ||
    reqCodeOwnerApproval ||
    (minApproval && minApproval > 0) ||
    reqCodeOwnerLatestApproval ||
    (minReqLatestApproval && minReqLatestApproval > 0) ||
    defReviewerApprovalRequiredByRule ||
    defReviewerLatestApprovalRequiredByRule ||
    mergeBlockedViaRule
  ) {
    if (mergeBlockedViaRule) {
      title = 'Base branch does not allow updates'
      statusColor = 'text-cn-danger'
      statusIcon = 'error'
    } else if (
      codeOwnerChangeReqEntries &&
      codeOwnerChangeReqEntries?.length > 0 &&
      (reqCodeOwnerApproval || reqCodeOwnerLatestApproval)
    ) {
      title = 'Changes requested by code owner'
      statusMessage = 'Code owner requested changes'
      statusColor = 'text-cn-danger'
      statusIcon = 'error'
    } else if (changeReqEvaluations && changeReqEvaluations?.length > 0 && reqNoChangeReq) {
      title = 'Changes Requested'
      statusMessage = `${changeReqReviewer} requested changes to the pull request`
      statusColor = 'text-cn-danger'
      statusIcon = 'error'
    } else if (codeOwnerPendingEntries && codeOwnerPendingEntries?.length > 0 && reqCodeOwnerLatestApproval) {
      title = 'Approvals pending from code owners'
      statusMessage = 'Latest changes are pending approval from code owners'
      statusColor = 'text-cn-warning'
      statusIcon = 'pending'
    } else if (codeOwnerPendingEntries && codeOwnerPendingEntries?.length > 0 && reqCodeOwnerApproval) {
      title = 'Approvals pending from code owners'
      statusMessage = 'Changes are pending approval from code owners'
      statusColor = 'text-cn-warning'
      statusIcon = 'pending'
    } else if (
      minReqLatestApproval &&
      minReqLatestApproval > 0 &&
      latestApprovalArr &&
      latestApprovalArr?.length < minReqLatestApproval
    ) {
      title = 'Approvals pending'
      statusMessage = 'Latest changes are pending approval from required reviewers'
      statusColor = 'text-cn-warning'
      statusIcon = 'pending'
    } else if (defReviewerLatestApprovalRequiredByRule && !defReviewerApprovedLatestChanges) {
      title = 'Approvals pending'
      statusMessage = 'Latest changes are pending approval from default reviewers'
      statusColor = 'text-cn-warning'
      statusIcon = 'pending'
    } else if (minApproval && approvedEvaluations && approvedEvaluations?.length < minApproval && minApproval > 0) {
      title = 'Approvals pending'
      statusMessage = 'Changes are pending approval from required reviewers'

      statusColor = 'text-cn-warning'
      statusIcon = 'pending'
    } else if (defReviewerApprovalRequiredByRule && !defReviewerApprovedChanges) {
      title = 'Approvals pending'
      statusMessage = 'Changes are pending approval from default reviewers'
      statusColor = 'text-cn-warning'
      statusIcon = 'pending'
    } else if (reqCodeOwnerLatestApproval && latestCodeOwnerApprovalArr && latestCodeOwnerApprovalArr?.length > 0) {
      title = 'Changes approved'
      statusMessage = 'Latest changes were approved by code owners'
      statusColor = 'text-cn-success'
      statusIcon = 'success'
    } else if (reqCodeOwnerApproval && codeOwnerApprovalEntries && codeOwnerApprovalEntries?.length > 0) {
      title = 'Changes approved'
      statusMessage = 'Changes were approved by code owners'
      statusColor = 'text-cn-success'
      statusIcon = 'success'
    } else if (
      minReqLatestApproval &&
      minReqLatestApproval > 0 &&
      latestApprovalArr &&
      latestApprovalArr?.length >= minReqLatestApproval
    ) {
      title = 'Changes approved'
      statusMessage = 'Latest changes were approved by required reviewers'
      statusColor = 'text-cn-success'
      statusIcon = 'success'
    } else if (minApproval && minApproval > 0 && approvedEvaluations && approvedEvaluations?.length >= minApproval) {
      title = 'Changes approved'
      statusMessage = 'Changes were approved by required reviewers'
      statusColor = 'text-cn-success'
      statusIcon = 'success'
    } else if (approvedEvaluations && approvedEvaluations?.length > 0) {
      title = 'Changes approved'
      statusMessage = 'Changes were approved by reviewers'
      statusColor = 'text-cn-success'
      statusIcon = 'success'
    } else {
      title = 'No reviews required'
      statusMessage = 'Pull request can be merged without any reviews'
      statusColor = 'text-cn-3'
      statusIcon = 'success'
    }
  } else {
    // When no rules are required
    if (codeOwnerChangeReqEntries && codeOwnerChangeReqEntries?.length > 0) {
      title = 'Changes requested by code owner'
      statusMessage = 'Code owners requested changes to the pull request'
      statusIcon = 'error'
      isNotRequired = true
    } else if (changeReqEvaluations && changeReqEvaluations?.length > 0) {
      title = 'Changes Requested'
      statusMessage = `${changeReqReviewer} requested changes to the pull request`
      statusIcon = 'error'
      isNotRequired = true
    } else if (approvedEvaluations?.length && approvedEvaluations?.length > 0) {
      title = 'Changes approved'
      statusMessage = 'Changes were approved by reviewers'
      statusIcon = 'success'
    } else {
      title = 'No reviews required'
      statusMessage = 'Pull request can be merged without any reviews'
      statusIcon = 'success'
    }
  }
  return { title, statusMessage, statusColor, statusIcon, isNotRequired }
}

// Workaround util to correct filePath which is not correctly produced by
// git itself when filename contains space
// @see https://stackoverflow.com/questions/77596606/why-does-git-add-trailing-tab-to-the-b-line-of-the-diff-when-the-file-nam
export const normalizeGitFilePath = (filePath: string) => {
  if (filePath && filePath.endsWith('\t') && filePath.indexOf(' ') !== -1) {
    return filePath.replace(/\t$/, '')
  }
  return filePath
}

export const changedFileId = (collection: unknown[]) => collection.filter(Boolean).join('::::')

export const DIFF2HTML_CONFIG = {
  outputFormat: 'side-by-side',
  drawFileList: false,
  fileListStartVisible: false,
  fileContentToggle: true,
  matching: 'lines',
  synchronisedScroll: true,
  highlight: true,
  renderNothingWhenEmpty: false,
  compiledTemplates: {
    'generic-line': HoganJsUtils.compile(`
      <tr>
        <td class="{{lineClass}} {{type}}">
          <div class="relative z-[100] w-0 h-0 inline-block">
            <span class="annotation-for-line" data-annotation-for-line="{{lineNumber}}" tab-index="0" role="button">+</span>
            <span data-selected-indicator></span>
          </div>{{{lineNumber}}}<!-- {{{filePath}}} --></td>
        <td class="{{type}}" data-content-for-line-number="{{lineNumber}}" data-content-for-file-path="{{file.filePath}}">
            <div class="{{contentClass}} relative z-[1]">
            {{#prefix}}
              <span class="d2h-code-line-prefix">{{{prefix}}}</span>
            {{/prefix}}
            {{^prefix}}
              <span class="d2h-code-line-prefix">&nbsp;</span>
            {{/prefix}}
            {{#content}}
              <span class="d2h-code-line-ctn">{{{content}}}</span>
            {{/content}}
            {{^content}}
              <span class="d2h-code-line-ctn"><br></span>
            {{/content}}
            </div>
        </td>
      </tr>
    `),
    'side-by-side-file-diff': HoganJsUtils.compile(`
      <div id="{{fileHtmlId}}" data="{{file.filePath}}" class="d2h-file-wrapper side-by-side-file-diff" data-lang="{{file.language}}">
        <div class="d2h-file-header">
          {{{filePath}}}
        </div>
        <div class="d2h-files-diff">
            <div class="d2h-file-side-diff left">
                <div
                class="d2h-code-wrapper">
                    <table class="d2h-diff-table" cellpadding="0px" cellspacing="0px">
                        <tbody class="d2h-diff-tbody rounded-bl-[var(--radius)] rounded-br-[var(--radius)]">
                        {{{diffs.left}}}
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="d2h-file-side-diff right">
                <div class="d2h-code-wrapper">
                    <table class="d2h-diff-table" cellpadding="0px" cellspacing="0px">
                        <tbody class="d2h-diff-tbody rounded-bl-[var(--radius)] rounded-br-[var(--radius)]">
                        {{{diffs.right}}}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    `),
    'line-by-line-file-diff': HoganJsUtils.compile(`
      <div id="{{fileHtmlId}}" data="{{file.filePath}}" class="d2h-file-wrapper {{file.filePath}} line-by-line-file-diff" data-lang="{{file.language}}">
        <div class="d2h-file-header">
        {{{filePath}}}
        </div>
        <div class="d2h-file-diff">
            <div class="d2h-code-wrapper">
                <table class="d2h-diff-table" cellpadding="0px" cellspacing="0px">
                    <tbody class="d2h-diff-tbody rounded-bl-[var(--radius)] rounded-br-[var(--radius)]">
                    {{{diffs}}}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    `),
    'line-by-line-numbers': HoganJsUtils.compile(`
      <div class="line-num1" data-line-number="{{oldNumber}}">{{oldNumber}}</div>
      <div class="line-num2" data-line-number="{{newNumber}}">{{newNumber}}</div>
    `)
  }
} as Readonly<Diff2Html.Diff2HtmlConfig>

export enum ViewStyle {
  SIDE_BY_SIDE = 'side-by-side',
  LINE_BY_LINE = 'line-by-line'
}

export const getErrorMessage = (error: unknown): string | undefined =>
  error ? (get(error, 'data.error', get(error, 'data.message', get(error, 'message', error))) as string) : undefined

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

export const buildPRFilters = ({
  filterData,
  scope,
  reviewerId
}: {
  filterData: PRListFilters
  scope?: Scope
  reviewerId?: number
}) => {
  const filters: Record<string, ListPullReqQueryQueryParams[keyof ListPullReqQueryQueryParams]> = {}
  if (filterData.created_gt instanceof Date) {
    filters.created_gt = filterData.created_gt.getTime().toString()
  }

  if (filterData.created_lt instanceof Date) {
    filters.created_lt = filterData.created_lt.getTime().toString()
  }

  if (filterData.created_by && typeof filterData.created_by === 'object' && 'value' in filterData.created_by) {
    filters.created_by = filterData.created_by.value
  }

  if (filterData.review_decision && Array.isArray(filterData.review_decision)) {
    filters.review_decision = filterData.review_decision.map((item: { value: string }) => item.value).join(',')
  }

  if (filterData.label_by) {
    const labelIds: string[] = []
    const valueIds: string[] = []

    for (const labelKey in filterData.label_by) {
      const labelValue = filterData.label_by[labelKey]
      if (labelValue) {
        labelIds.push(labelKey)

        if (typeof labelValue === 'object' && labelValue.valueId) {
          valueIds.push(labelValue.valueId)
        }
      }
    }

    filters.label_id = labelIds.map(Number)
    filters.value_id = valueIds.map(Number)
  }

  if (
    filterData.include_subspaces &&
    typeof filterData.include_subspaces === 'object' &&
    'value' in filterData.include_subspaces
  ) {
    const { accountId, orgIdentifier, projectIdentifier } = scope || {}

    if (accountId && orgIdentifier && projectIdentifier) {
      filters.include_subspaces = 'false'
    } else if (accountId && orgIdentifier) {
      filters.include_subspaces = String(filterData.include_subspaces.value === ExtendedScope.OrgProg)
    } else if (accountId) {
      filters.include_subspaces = String(filterData.include_subspaces.value === ExtendedScope.All)
    }
  }

  if (filters['review_decision']) {
    filters['reviewer_id'] = reviewerId
  }

  return filters
}

export const getCommentsInfoData = ({
  requiresCommentApproval,
  resolvedCommentArrParams
}: {
  requiresCommentApproval: boolean
  resolvedCommentArrParams?: number[]
}) => {
  const resolvedComments = requiresCommentApproval && !resolvedCommentArrParams

  if (resolvedComments) {
    return { header: 'All comments are resolved', content: undefined, status: 'success' }
  }

  const unresolvedCount = resolvedCommentArrParams?.[0] || 0 // Ensure a default value

  return {
    header: `Unresolved ${easyPluralize(unresolvedCount, 'comment', 'comments')}`,
    content: `There ${unresolvedCount === 1 ? 'is' : 'are'} ${unresolvedCount} unresolved ${easyPluralize(unresolvedCount, 'comment', 'comments')}`,
    status: 'failed'
  }
}
