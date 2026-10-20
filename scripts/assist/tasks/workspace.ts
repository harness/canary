import { confirm, input, select } from '@inquirer/prompts'

import {
  branchExists,
  changeSummary,
  currentBranch,
  findCompareLink,
  hasChanges,
  isJiraId,
  MAIN_BRANCH,
  openInBrowser,
  toBranchName
} from '../git'
import { Cancelled, runAction, runStep, runSteps } from '../runner'
import type { Task } from '../types'
import { bold, cyan, dim, green, say, yellow } from '../ui'

/** Asks permission, then stashes uncommitted work. Returns whether anything was stashed. */
async function putUnsavedChangesAside(): Promise<boolean> {
  const dirty = await runAction('Checking for unsaved changes', hasChanges, found =>
    found ? 'Found unsaved changes' : 'No unsaved changes to put aside'
  )
  if (!dirty) return false

  say(yellow('You have changes that are not saved (committed) yet.'))
  const ok = await confirm({
    message:
      'To continue, I need to put these changes aside safely. They will not be lost and can be brought back later. Is that OK?',
    default: true
  })
  if (!ok) throw new Cancelled('Nothing was changed.')

  await runStep('Putting your unsaved changes aside', 'git', [
    'stash',
    'push',
    '--include-untracked',
    '-m',
    'assist: set aside before updating'
  ])
  return true
}

const switchToLatestMain = () =>
  runSteps([
    { label: 'Switching to the main branch', cmd: 'git', args: ['checkout', MAIN_BRANCH] },
    { label: 'Downloading the newest main', cmd: 'git', args: ['pull', '--ff-only', 'origin', MAIN_BRANCH] }
  ])

const stashNotice = () => {
  say()
  say(yellow('Your earlier unsaved changes are still put aside (stashed).'))
  say(dim('Ask the AI to "restore my stashed changes" when you want them back.'))
}

/** Runs the steps that follow a stash. Whether they pass or fail, tell the Contributor their work is safe. */
async function afterStash(stashed: boolean, work: () => Promise<void>): Promise<void> {
  try {
    await work()
  } catch (error) {
    if (stashed) stashNotice()
    throw error
  }
  if (stashed) stashNotice()
}

async function fetchLatest() {
  const stashed = await putUnsavedChangesAside()
  await afterStash(stashed, async () => {
    await switchToLatestMain()
    await runSteps([
      { label: 'Installing packages', cmd: 'pnpm', args: ['install'] },
      { label: 'Building all packages', cmd: 'pnpm', args: ['build'] }
    ])
    say()
    say(green('You now have the latest code.'))
  })
}

async function startNewFeature() {
  const stashed = await putUnsavedChangesAside()
  await afterStash(stashed, async () => {
    await switchToLatestMain()

    say()
    const branch = toBranchName(
      await input({
        message: 'Enter your Jira ticket (for example UUI-1234) or a short name for your work:',
        validate: value => {
          const name = toBranchName(value)
          if (!name) return 'Please enter a Jira ticket or a short name using letters or numbers.'
          if (branchExists(name)) return `A branch named "${name}" already exists. Please use a different name.`
          return true
        }
      })
    )

    await runStep(`Creating your branch "${branch}"`, 'git', ['checkout', '-b', branch])
    say()
    say(green(`You are ready to start. Your work will be saved on "${branch}".`))
  })
}

const COMMIT_TYPES = [
  { value: 'feat', name: 'feat — a new feature or improvement' },
  { value: 'fix', name: 'fix — a bug fix' },
  { value: 'chore', name: 'chore — maintenance or cleanup' },
  { value: 'docs', name: 'docs — documentation only' }
]

async function saveAndPush() {
  const { branch, summary } = await runAction(
    'Checking your branch and changes',
    () => {
      const branch = currentBranch()
      if (branch === MAIN_BRANCH) {
        throw new Cancelled(
          'You are on the main branch. Please run "Start a new feature" first, then make your changes.'
        )
      }
      const summary = changeSummary()
      if (!summary.files.length) throw new Cancelled('There is nothing to save. You have no changes.')
      return { branch, summary }
    },
    result => `Checked your branch (${result.branch}) and found ${result.summary.files.length} changed file(s)`
  )

  const counts = [
    summary.modified && `${summary.modified} changed`,
    summary.added && `${summary.added} new`,
    summary.deleted && `${summary.deleted} removed`
  ].filter(Boolean)
  say(bold(`These files will be saved (${counts.join(', ')}):`))
  for (const file of summary.files.slice(0, 30)) say(`  ${file}`)
  if (summary.files.length > 30) say(dim(`  …and ${summary.files.length - 30} more`))
  say()

  if (!(await confirm({ message: 'Save and push all of these changes?', default: true }))) {
    throw new Cancelled('Nothing was saved.')
  }

  const type = await select({ message: 'What kind of change is this?', choices: COMMIT_TYPES })
  const jira = (
    await input({
      message: 'Jira ticket (optional, for example UUI-1234 — press Enter to skip):',
      validate: value =>
        !value.trim() ||
        isJiraId(value.trim()) ||
        'That does not look like a Jira ticket. Use a format like UUI-1234, or leave it empty.'
    })
  ).trim()
  const description = (
    await input({
      message: 'Describe what you changed in one short sentence:',
      validate: value => !!value.trim() || 'Please describe your change.'
    })
  ).trim()

  const message = jira ? `${type}: [${jira.toUpperCase()}]: ${description}` : `${type}: ${description}`
  say()

  await runStep('Gathering your changes', 'git', ['add', '-A'])
  await runStep('Recording your changes (running safety checks)', 'git', ['commit', '-m', message])
  const pushOutput = await runStep(`Uploading to "${branch}"`, 'git', ['push', '-u', 'origin', branch])

  say()
  say(green('Your changes are saved and uploaded.'))
  const link = findCompareLink(pushOutput)
  if (link) {
    say('Use this link to create your pull request:')
    say(cyan(link))
    say()
    if (await confirm({ message: 'Open the pull request page in your browser now?', default: true })) {
      openInBrowser(link)
    }
  } else {
    say(
      yellow(
        'I could not find the pull request link. Please open the canary repository in Harness Code and create the pull request manually.'
      )
    )
  }
}

export const workspaceTasks: Task[] = [
  {
    id: 'fetch-latest',
    label: 'Get latest code',
    category: 'Daily workflow',
    description: 'Update your workspace to the newest main, install packages and rebuild everything.',
    run: fetchLatest
  },
  {
    id: 'start:new-feature',
    label: 'Start a new feature',
    category: 'Daily workflow',
    description: 'Switch to the newest main and create a fresh branch from a Jira ticket or a name.',
    run: startNewFeature
  },
  {
    id: 'save-and-push',
    label: 'Save & push my changes',
    category: 'Daily workflow',
    description: 'Save all your changes with a message, upload them, and open the pull request link.',
    run: saveAndPush
  }
]
