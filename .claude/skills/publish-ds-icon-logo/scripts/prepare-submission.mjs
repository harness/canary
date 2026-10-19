#!/usr/bin/env node
/**
 * prepare-submission.mjs — draft and validate the Jira ticket + PR, never submit.
 *
 * This is the deterministic half of the ⛔ CHECKPOINT. It does NOT create the
 * ticket or open the PR — that is a side-effecting, outward-facing step that
 * stays behind explicit user approval and goes through the Harness MCP. What it
 * does is everything mechanical that a wrong keystroke turns into a CI rejection
 * or a ticket someone has to clean up:
 *
 *   1. Validate the title against `<type>: [<KEY>]: <description>` and the
 *      accepted-type / project allowlists (the rules `messageCheck` enforces).
 *   2. Pre-flight the Jira payload — project, type Task, FF Added=No, assignee,
 *      and the two-step summary dance (the summary carries the ticket's own key).
 *   3. Assemble a paste-ready PR body from facts already on disk: the
 *      `git diff --stat`, the Figma source, the Jira link, and — when you
 *      exported from a Figma branch — the exact ⛔ merge-gate checklist block.
 *
 * The agent still does the actual create/open via MCP, after approval. This just
 * makes the draft correct before it leaves the machine.
 *
 * Dependency-free (imports only names.mjs), so it runs from anywhere in the repo.
 *
 * Usage:
 *   node .claude/skills/publish-ds-icon-logo/scripts/prepare-submission.mjs \
 *     --type feat --ticket UUI-4033 --desc "Add ai-evals icon" \
 *     --asset-type icon --name ai-evals \
 *     --figma-file-key NYeN8I4D3anR9it8ds0lyr --figma-file-name "HDS | Icons" \
 *     --figma-link "https://www.figma.com/design/…?node-id=…" \
 *     --approver "Jane Designer" --signoff-date 2026-10-19 \
 *     --jira-link "https://harness.atlassian.net/browse/UUI-4033" \
 *     --assignee 5f1a… --base origin/main
 *
 * Logos add --hex '#1F6FEB'. If you exported from a Figma branch, add
 * --figma-branch "<branch name>" and the merge gate is emitted automatically.
 *
 * Before the ticket exists you will not have a key — pass --ticket PENDING and
 * it drafts everything else, flagging the key as the one thing still to fill in.
 *
 * Exit 0 = draft is valid. Exit 1 = a format/type/project error that would be
 * rejected downstream (the draft is still printed so you can see what to fix).
 */

import { execFileSync } from 'child_process'

import { parseArgs } from './names.mjs'

const args = parseArgs(process.argv.slice(2))

const ACCEPTED_TYPES = ['feat', 'fix', 'techdebt', 'hotfixpreqa', 'chore']
const VALID_PROJECTS = ['UUI', 'CODE', 'ENGOPS']
const TICKET_RE = /^[A-Z][A-Z0-9]+-\d+$/
const HEX6 = /^#[0-9a-fA-F]{6}$/

const errors = []
const warnings = []
const E = m => errors.push(m)
const W = m => warnings.push(m)

/** A key the user has not filled in yet — drafts everything but the key. */
const isPlaceholder = v => !v || /^(pending|tbd|todo)$/i.test(v) || /[<>]/.test(v) || /TICKET-?KEY/i.test(v)

/** Today in YYYY-MM-DD; only used as a fallback when --signoff-date is omitted. */
function today() {
  return new Date().toISOString().slice(0, 10)
}

/** git diff --stat for what the PR will contain. Degrades gracefully. */
function diffStat(base) {
  for (const range of [`${base}...HEAD`, 'HEAD~1..HEAD']) {
    try {
      const out = execFileSync('git', ['diff', '--stat', range], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore']
      }).trim()
      if (out) return { range, out }
    } catch {
      // try the next range
    }
  }
  return { range: null, out: null }
}

function validateTitle(type, ticket, desc) {
  if (!type) {
    E('--type is required (the change type, e.g. feat).')
  } else if (!ACCEPTED_TYPES.includes(type)) {
    if (type === 'docs') {
      E(`--type "docs" is rejected by messageCheck. Use "chore" for docs-only changes.`)
    } else {
      E(`--type "${type}" is not accepted. Use one of: ${ACCEPTED_TYPES.join(' ')}.`)
    }
  }

  if (isPlaceholder(ticket)) {
    W(`No ticket key yet (--ticket "${ticket || ''}"). Create the Jira ticket first, then rerun ` +
      `with its key — the title and summary both embed it.`)
  } else {
    if (!TICKET_RE.test(ticket)) {
      E(`--ticket "${ticket}" is not a KEY like UUI-4033 (PROJECT-number).`)
    } else {
      const project = ticket.split('-')[0]
      if (project === 'XD') {
        E(`Jira project XD is rejected by messageCheck. Use ${VALID_PROJECTS.join(' / ')}.`)
      } else if (!VALID_PROJECTS.includes(project)) {
        W(`Ticket project "${project}" is unusual — the expected projects are ` +
          `${VALID_PROJECTS.join(' / ')}. Continue only if you know this is right.`)
      }
    }
  }

  if (!desc) E('--desc is required (the description, e.g. "Add ai-evals icon").')
}

function jiraPreflight(type, ticket, desc) {
  const project = !isPlaceholder(ticket) && TICKET_RE.test(ticket) ? ticket.split('-')[0] : 'UUI'
  const keyShown = isPlaceholder(ticket) ? '<KEY>' : ticket
  const fullSummary = `${type || '<type>'}: [${keyShown}]: ${desc || '<description>'}`

  // Assignee: cannot resolve a real account ID here, only catch an obvious stub.
  if (!args.assignee) {
    W('No --assignee given. The ticket must be assigned to the user by their REAL Jira account ID ' +
      '— resolve it, never reuse an example ID.')
  } else if (/example|xxxx|account-?id|12345/i.test(String(args.assignee))) {
    E(`--assignee "${args.assignee}" looks like a placeholder. Resolve the user's real account ID.`)
  }

  return [
    'JIRA TICKET — pre-flight (create via MCP only after approval)',
    '',
    `  Project:   ${project}${project === 'XD' ? '  ❌ XD is rejected' : ''}`,
    '  Type:      Task      (NOT Story — do not copy the old UUI-3837/3854/3855 tickets)',
    `  FF Added:  No        (required custom field; empty = CI fails "FF Added has not been updated")`,
    `  Assignee:  ${args.assignee || '<the user’s real account ID>'}`,
    '',
    '  Two-step creation (the summary contains the ticket’s own key):',
    `    1. Create with summary:  ${desc || '<description>'}        + FF Added = No`,
    `    2. Edit summary to:      ${fullSummary}`
  ].join('\n')
}

function mergeGate(branch, key) {
  return [
    '## ⛔ Do not merge this PR until the Figma branch is merged',
    '',
    `- [ ] Figma branch \`${branch}\` merged into main and published by ${args.approver || '<approver>'}`,
    '',
    `Exported from Figma branch \`${branch}\` (file key \`${key || '<key>'}\`), not main. The name maps ` +
      `are regenerated from **main's** export page, so merging this PR first would leave the asset in ` +
      `code but absent from main — and the next full \`pnpm update:icons\` / \`update:logos\` would ` +
      `drop it from the map and break every consumer.`,
    ''
  ].join('\n')
}

function prBody(type, ticket, desc) {
  const assetType = args['asset-type']
  const name = args.name
  const isLogo = assetType === 'logo'
  const { range, out } = diffStat(args.base ? String(args.base) : 'origin/main')
  const signoff = args['signoff-date'] ? String(args['signoff-date']) : today()
  const branch = args['figma-branch']

  const todo = label => `_TODO: ${label}_`
  const lines = []

  if (branch) lines.push(mergeGate(String(branch), args['figma-file-key']), '')

  lines.push('## Summary')
  lines.push(
    `Add the \`${name || '<name>'}\` ${assetType || '<icon|logo>'} to \`@harnessio/ui\`` +
      `${isLogo ? ' (LogoV2 + LogoSymbol).' : ' (IconV2 set).'}`
  )
  lines.push('')

  lines.push('## Source')
  lines.push(
    `- Figma file: ${args['figma-file-name'] ? `\`${args['figma-file-name']}\`` : todo('Figma file name')}` +
      ` (key \`${args['figma-file-key'] || '<key>'}\`)` +
      (branch ? ` — **branch \`${branch}\`, not main**` : '')
  )
  lines.push(`- Component: ${args['figma-link'] || todo('Figma component link')}`)
  if (isLogo) {
    if (args.hex && HEX6.test(String(args.hex))) {
      lines.push(`- Brand hex: \`${args.hex}\` (background); mark is monochrome on that field`)
    } else {
      lines.push(`- Brand hex: ${todo('brand hex + mark colour (logos only)')}`)
    }
  }
  lines.push('')

  lines.push('## Changed files')
  if (out) {
    lines.push(`Only the expected files changed (\`git diff --stat ${range}\`):`)
    lines.push('', '```', out, '```')
  } else {
    lines.push(todo('paste `git diff --stat origin/main...HEAD` — none detected; is the branch committed?'))
  }
  lines.push('')

  lines.push('## Tracking')
  lines.push(`- Jira: ${args['jira-link'] || (isPlaceholder(ticket) ? todo('Jira link (once the ticket exists)') : ticket)}`)
  lines.push('')

  lines.push('## Design sign-off')
  lines.push(`- Approved by ${args.approver || todo('approver name')} on ${signoff}`)

  return lines.join('\n')
}

function main() {
  if (process.argv.length <= 2) {
    console.log('\nSee the usage comment at the top of this file.\n')
    process.exit(0)
  }

  const type = args.type ? String(args.type) : ''
  const ticket = args.ticket ? String(args.ticket) : ''
  const desc = args.desc ? String(args.desc) : ''

  validateTitle(type, ticket, desc)

  const keyShown = isPlaceholder(ticket) ? '<KEY>' : ticket
  const title = `${type || '<type>'}: [${keyShown}]: ${desc || '<description>'}`

  console.log('\n' + '─'.repeat(78))
  console.log('PR / JIRA TITLE  (same format for both)')
  console.log('─'.repeat(78))
  console.log(`  ${title}`)

  console.log('\n' + '─'.repeat(78))
  console.log(jiraPreflight(type, ticket, desc))

  console.log('\n' + '─'.repeat(78))
  console.log('PR DESCRIPTION  (paste into the PR — do NOT open it until approved)')
  console.log('─'.repeat(78) + '\n')
  console.log(prBody(type, ticket, desc))

  console.log('\n' + '─'.repeat(78))
  if (warnings.length) {
    console.log('\nStill to confirm before you submit:')
    for (const w of warnings) console.log(`  ⚠️  ${w}`)
  }
  if (errors.length) {
    console.log('\nFix these — they will be rejected downstream:')
    for (const e of errors) console.log(`  ❌ ${e}`)
    console.log('')
    process.exit(1)
  }
  console.log('\n✅ Draft is valid. Open the PR and create the ticket via MCP only after the user approves.\n')
}

main()
