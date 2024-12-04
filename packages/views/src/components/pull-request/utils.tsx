import { useMemo } from 'react'

import type * as Diff2Html from 'diff2html'
import HoganJsUtils from 'diff2html/lib/hoganjs-utils'

import {
  CommentItem,
  EnumPullReqReviewDecision,
  orderSortDate,
  PRCommentFilterType,
  PullReqReviewDecision,
  TypesPullReqActivity,
  TypesRuleViolations,
  TypesViolation
} from './interfaces'

export const processReviewDecision = (
  review_decision: EnumPullReqReviewDecision,
  reviewedSHA?: string,
  sourceSHA?: string
) =>
  review_decision === PullReqReviewDecision.approved && reviewedSHA !== sourceSHA
    ? PullReqReviewDecision.outdated
    : review_decision

export function useActivityFilters() {
  return useMemo(
    () => [
      {
        label: 'Show everything',
        value: PRCommentFilterType.SHOW_EVERYTHING
      },
      {
        label: 'All comments',
        value: PRCommentFilterType.ALL_COMMENTS
      },
      {
        label: 'My comments/replies',
        value: PRCommentFilterType.MY_COMMENTS
      },
      {
        label: 'Unresolved comments',
        value: PRCommentFilterType.UNRESOLVED_COMMENTS
      },
      {
        label: 'Resolved comments',
        value: PRCommentFilterType.RESOLVED_COMMENTS
      }
    ],
    []
  )
}

export function useDateFilters() {
  return useMemo(
    () => [
      {
        label: 'First added',
        value: orderSortDate.ASC
      },
      {
        label: 'Last added',
        value: orderSortDate.DESC
      }
    ],
    []
  )
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

//**
//  * parses diff strings to extract the starting line number from the hunk header. this
//  * function is needed because the diff viewer being used hides that info because it assumes
//  * the starting line is not relevant for the displayed diffs, leading to potential confusion for users.
//  * @param diffString: string
//  * @returns string or null
//
export function parseStartingLineIfOne(diffString: string) {
  // Use a regular expression to find the hunk header in the diff string
  const hunkHeaderMatch = diffString.match(/@@ -(\d+),\d+ \+\d+(?:,\d+)? @@/)
  if (hunkHeaderMatch) {
    const startingLine = parseInt(hunkHeaderMatch[1]) // Convert the extracted string to an integer
    // Check if the starting line is 1
    if (startingLine === 1 || startingLine === 0) {
      return hunkHeaderMatch[0]
    }
  }

  // Return null if the starting line is not 1 or if the header is not found
  return null
}

export const getPrState = (is_draft?: boolean, merged?: number | null, state?: string) => {
  if (state === 'open' && is_draft) {
    return { icon: 'pr-draft', text: 'Draft', theme: 'warning' }
  } else if (merged) {
    return { icon: 'pr-merge', text: 'Merged', theme: 'emphasis' }
  } else if (state === 'closed') {
    return { icon: 'pr-closed', text: 'Closed', theme: 'muted' }
  } else {
    return { icon: 'pr-open', text: 'Open', theme: 'success' }
  }
}

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
