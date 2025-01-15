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

// helper to transform lines to quote format: each line => '> line' + blank line at end
export function quoteTransform(raw: string): string {
  return raw
    .split(CRLF)
    .map(line => `> ${line}`)
    .concat([CRLF])
    .join(CRLF)
}
