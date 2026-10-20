import { execFileSync, spawn } from 'node:child_process'

import { ROOT } from './runner'

export const MAIN_BRANCH = 'main'

/** Runs a quick git query. Slow or user-visible git work goes through runStep instead. */
export function git(...args: string[]): string {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trimEnd()
}

export const currentBranch = () => git('rev-parse', '--abbrev-ref', 'HEAD')

export function branchExists(name: string): boolean {
  try {
    git('rev-parse', '--verify', '--quiet', `refs/heads/${name}`)
    return true
  } catch {
    return false
  }
}

export interface ChangeSummary {
  modified: number
  added: number
  deleted: number
  files: string[]
}

export function changeSummary(): ChangeSummary {
  const lines = git('status', '--porcelain').split('\n').filter(Boolean)
  const summary: ChangeSummary = { modified: 0, added: 0, deleted: 0, files: [] }
  for (const line of lines) {
    const code = line.slice(0, 2)
    summary.files.push(line.slice(3))
    if (code.includes('D')) summary.deleted++
    else if (code === '??' || code.includes('A')) summary.added++
    else summary.modified++
  }
  return summary
}

export const hasChanges = () => changeSummary().files.length > 0

export const isJiraId = (value: string) => /^[A-Za-z][A-Za-z0-9]+-\d+$/.test(value)

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Turns a Jira id or free text into a branch name: "uui-12" -> "UUI-12", "Fix buttons" -> "feat/fix-buttons". */
export function toBranchName(input: string): string {
  const value = input.trim()
  if (isJiraId(value)) return value.toUpperCase()
  const slug = slugify(value)
  return slug ? `feat/${slug}` : ''
}

/** Finds the pull-request compare link that the Harness Code server prints after a push. */
export function findCompareLink(pushOutput: string): string | undefined {
  return pushOutput.match(/https?:\/\/\S+\/pulls\/compare\/\S+/)?.[0]
}

export function openInBrowser(url: string): void {
  const opener = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'cmd' : 'xdg-open'
  const args = process.platform === 'win32' ? ['/c', 'start', '', url] : [url]
  const child = spawn(opener, args, { detached: true, stdio: 'ignore' })
  child.on('error', () => {})
  child.unref()
}
