import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

import { confirm, password } from '@inquirer/prompts'
import ora from 'ora'

import { Cancelled, ROOT } from '../runner'
import { bold, cyan, say, yellow } from '../ui'

const ENV_PATH = path.join(ROOT, 'packages/ui/.env')

function readEnv(): Record<string, string> {
  if (!existsSync(ENV_PATH)) return {}
  const values: Record<string, string> = {}
  for (const line of readFileSync(ENV_PATH, 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)
    if (match) values[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2')
  }
  return values
}

interface Probe {
  ok: boolean
  /** Plain-language reason when not ok */
  reason?: string
}

/** Asks Figma for the icon file's top level only; cheap, and the token never leaves the request header. */
async function probeFigma(token: string, fileId: string): Promise<Probe> {
  try {
    const response = await fetch(`https://api.figma.com/v1/files/${fileId}?depth=1`, {
      headers: { 'X-Figma-Token': token }
    })
    if (response.ok) return { ok: true }
    const body = (await response.json().catch(() => ({}))) as { err?: string }
    if (/expired/i.test(body.err ?? '')) return { ok: false, reason: 'The Figma token has expired.' }
    if (response.status === 404) return { ok: false, reason: 'Figma could not find the design file (FIGMA_FILE_ID).' }
    if (response.status === 401 || response.status === 403) {
      return { ok: false, reason: 'Figma rejected the token (it is invalid or has no access to the design file).' }
    }
    return { ok: false, reason: `Figma answered with an unexpected error (${response.status}).` }
  } catch {
    return { ok: false, reason: 'Could not reach Figma. Please check your internet connection.' }
  }
}

function saveToken(token: string): void {
  const line = `FIGMA_TOKEN=${token}`
  const current = existsSync(ENV_PATH) ? readFileSync(ENV_PATH, 'utf8') : ''
  const next = /^FIGMA_TOKEN=.*$/m.test(current)
    ? current.replace(/^FIGMA_TOKEN=.*$/m, () => line)
    : `${current}${current && !current.endsWith('\n') ? '\n' : ''}${line}\n`
  writeFileSync(ENV_PATH, next)
}

/**
 * Icons and logos are downloaded from Figma. Check the token first, and if it is
 * expired, walk the Contributor through getting a new one and save it for them.
 */
export async function ensureFigmaAccess(): Promise<void> {
  const env = readEnv()

  if (!env.FIGMA_FILE_ID) {
    throw new Cancelled(
      'packages/ui/.env has no FIGMA_FILE_ID (or the file is missing). Ask the design-system owner for the file ID, then try again.'
    )
  }

  const spinner = ora({ text: 'Checking your Figma access', spinner: 'dots' }).start()
  const first = env.FIGMA_TOKEN ? await probeFigma(env.FIGMA_TOKEN, env.FIGMA_FILE_ID) : undefined
  if (first?.ok) {
    spinner.succeed('Your Figma access works')
    return
  }
  spinner.fail(first?.reason ?? 'There is no Figma token yet.')

  say()
  say(bold('You need a new Figma token. It takes about a minute:'))
  say('  1. Open Figma and click your profile picture, then "Settings".')
  say('  2. Open the "Security" tab and find "Personal access tokens".')
  say('  3. Click "Generate new token", give it a name, and allow read access to files.')
  say('  4. Copy the token (it starts with "figd_"). Figma shows it only once.')
  say()

  if (!(await confirm({ message: 'Do you have a new token ready to paste?', default: true }))) {
    throw new Cancelled('No problem. Get a token using the steps above, then run this again.')
  }

  const token = (await password({ message: 'Paste your new Figma token (it will be hidden):', mask: '*' })).trim()
  if (!token) throw new Cancelled('No token was entered. Nothing was changed.')

  const check = ora({ text: 'Checking the new token', spinner: 'dots' }).start()
  const result = await probeFigma(token, env.FIGMA_FILE_ID)
  if (!result.ok) {
    check.fail(result.reason)
    throw new Cancelled(
      `${result.reason} Nothing was saved. Make sure the token can read the icon file, then try again.`
    )
  }
  check.succeed('The new token works')

  if (
    !(await confirm({
      message: `Save it to ${cyan('packages/ui/.env')} (a private file that is never uploaded)?`,
      default: true
    }))
  ) {
    throw new Cancelled('The token was not saved, so icons and logos were not updated.')
  }
  saveToken(token)
  say(yellow('Saved. You will not need to do this again until the token expires.'))
  say()
}
