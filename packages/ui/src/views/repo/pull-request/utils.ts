import { IconType } from './pull-request.types'

export const getPrState = (
  is_draft?: boolean,
  merged?: number | null,
  state?: string
): { icon: IconType; text: string; theme: string } => {
  if (state === 'open' && is_draft) {
    return { icon: 'pr-draft', text: 'Draft', theme: 'muted' }
  } else if (merged) {
    return { icon: 'pr-merge', text: 'Merged', theme: 'emphasis' }
  } else if (state === 'closed') {
    return { icon: 'pr-closed', text: 'Closed', theme: 'destructive' }
  } else {
    return { icon: 'pr-open', text: 'Open', theme: 'success' }
  }
}

// TODO: check if this is the correct way to get the checks state
export const getChecksState = (status: {
  failure: number
  error: number
  pending: number
  running: number
  success: number
}) => {
  if (status.failure > 0 || status.error > 0) {
    return 'failure'
  }

  if (status.pending > 0 || status.running > 0) {
    return 'running'
  }

  return 'success'
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

export const CRLF = '\n'

export const PULL_REQUEST_LARGE_DIFF_CHANGES_LIMIT = 500
export const PULL_REQUEST_DIFF_RENDERING_BLOCK_SIZE = 10
export const IN_VIEWPORT_DETECTION_MARGIN = 2000

// helper to transform lines to quote format: each line => '> line' + blank line at end
export function quoteTransform(raw: string): string {
  return raw
    .split(CRLF)
    .map(line => `> ${line}`)
    .concat([CRLF])
    .join(CRLF)
}

// If a diff container has a Markdown Editor active, retain it even if it's off-screen to make
// sure editor content is not cleared out during off-screen optimization
export const shouldRetainDiffChildren = (dom: HTMLElement | null) =>
  !!dom?.querySelector('[data-comment-editor-shown="true"]')

export const outterBlockName = (blockIndex: number) => `outter-${blockIndex}`
export const innerBlockName = (filePath: string) => `inner-${filePath}`

// If there are more than 200 diffs, we decrease the detection margin to make sure browser do not crash. As a result, Cmd-F won't work well on diffs that got hidden/out of viewport.
export const calculateDetectionMargin = (diffsLength: number) =>
  diffsLength >= 200 ? 5000 : IN_VIEWPORT_DETECTION_MARGIN
