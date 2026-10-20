import { execFileSync } from 'node:child_process'
import {
  accessSync,
  appendFileSync,
  chmodSync,
  constants,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readlinkSync,
  rmSync,
  symlinkSync
} from 'node:fs'
import { homedir } from 'node:os'
import path from 'node:path'

import { confirm } from '@inquirer/prompts'

import { Cancelled, ROOT, runAction } from '../runner'
import type { Task } from '../types'
import { bold, dim, green, say, yellow } from '../ui'

const LAUNCHER = path.join(ROOT, 'scripts/assist/bin/assist.js')
const LAUNCHER_SUFFIX = path.join('scripts', 'assist', 'bin', 'assist.js')
const LOCAL_BIN = path.join(homedir(), '.local/bin')

const pathDirs = () => (process.env.PATH ?? '').split(path.delimiter).filter(Boolean)

function isWritableDir(dir: string): boolean {
  try {
    accessSync(dir, constants.W_OK)
    return true
  } catch {
    return false
  }
}

function pnpmGlobalBin(): string | undefined {
  try {
    return (
      execFileSync('pnpm', ['bin', '-g'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() || undefined
    )
  } catch {
    return undefined
  }
}

function exists(file: string): boolean {
  try {
    lstatSync(file)
    return true
  } catch {
    return false
  }
}

/** Is `file` a symlink that points at a canary Assist launcher (this clone or another)? */
function isAssistLink(file: string): boolean {
  try {
    return lstatSync(file).isSymbolicLink() && readlinkSync(file).endsWith(LAUNCHER_SUFFIX)
  } catch {
    return false
  }
}

const candidateDirs = (): string[] =>
  [LOCAL_BIN, pnpmGlobalBin(), '/usr/local/bin'].filter((dir): dir is string => !!dir)

/** Adds ~/.local/bin to the shell config, only after the Contributor agrees. */
async function addToPath(): Promise<void> {
  const shell = path.basename(process.env.SHELL ?? '')
  const rcName = shell === 'zsh' ? '.zshrc' : shell === 'bash' ? '.bashrc' : undefined
  const line = 'export PATH="$HOME/.local/bin:$PATH"'

  if (!rcName) {
    say(yellow('Please ask the AI to add ~/.local/bin to your PATH, then open a new terminal window.'))
    return
  }

  const rcFile = path.join(homedir(), rcName)
  if (existsSync(rcFile) && readFileSync(rcFile, 'utf8').includes(line)) {
    say(yellow('Please open a new terminal window so the "assist" command is found.'))
    return
  }

  const ok = await confirm({
    message: `To use "assist" from anywhere, I need to add one line to your terminal settings (${rcName}). Is that OK?`,
    default: true
  })
  if (!ok) {
    say(yellow(`Skipped. You can still use "pnpm assist". To enable "assist" later, add this line to ${rcName}:`))
    say(`  ${line}`)
    return
  }
  appendFileSync(rcFile, `\n# Added by canary assist\n${line}\n`)
  say(green(`Added to ${rcName}.`))
  say(yellow('Please open a new terminal window so the "assist" command is found.'))
}

async function install() {
  const onPath = pathDirs()
  const target = await runAction(
    'Finding a place for the "assist" command',
    () => candidateDirs().find(dir => onPath.includes(dir) && existsSync(dir) && isWritableDir(dir)),
    found => `Using ${found ?? LOCAL_BIN}`
  )
  const dir = target ?? LOCAL_BIN
  const link = path.join(dir, 'assist')

  await runAction('Creating the "assist" command', () => {
    if (exists(link) && !isAssistLink(link)) {
      throw new Cancelled(
        `There is already a different program called "assist" at ${link}. I did not touch it. Ask the AI to help choose another location.`
      )
    }
    mkdirSync(dir, { recursive: true })
    rmSync(link, { force: true })
    symlinkSync(LAUNCHER, link)
    chmodSync(LAUNCHER, 0o755)
  })
  say(green(`The "assist" command is installed (${link}).`))

  // Another "assist" earlier in PATH would win over ours
  const first = onPath.map(d => path.join(d, 'assist')).find(exists)
  if (first && first !== link) {
    say(yellow(`Note: ${first} comes first in your PATH and will run instead.`))
  }

  if (!target) await addToPath()
  else say(bold('Try it now: type "assist" in any terminal.'))
}

async function uninstall() {
  const removed = await runAction(
    'Removing the "assist" command',
    () => {
      const links: string[] = []
      for (const dir of candidateDirs()) {
        const link = path.join(dir, 'assist')
        if (isAssistLink(link)) {
          rmSync(link)
          links.push(link)
        }
      }
      return links
    },
    links => (links.length ? 'Removed the "assist" command' : 'The "assist" command was not installed')
  )
  if (!removed.length) throw new Cancelled('The global "assist" command was not installed. Nothing was changed.')
  for (const link of removed) say(green(`Removed ${link}`))
  say(dim('Your terminal settings were left as they were. "pnpm assist" still works.'))
}

export const setupTasks: Task[] = [
  {
    id: 'install',
    label: 'Install the global "assist" command',
    category: 'Setup',
    description: 'Lets you type just "assist" in any terminal instead of "pnpm assist".',
    run: install
  },
  {
    id: 'uninstall',
    label: 'Remove the global "assist" command',
    category: 'Setup',
    description: 'Removes the shortcut created by the install task.',
    run: uninstall
  }
]
