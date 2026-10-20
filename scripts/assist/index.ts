import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'

import { select, Separator } from '@inquirer/prompts'

import { TASKS } from './registry'
import { Cancelled, ROOT, StepError } from './runner'
import type { Task } from './types'
import { bold, cyan, dim, red, say, yellow } from './ui'

const LOG_PATH = path.join(ROOT, '.assist/last-error.log')

async function chooseTask(): Promise<Task> {
  const choices: Array<Separator | { name: string; value: Task; short: string }> = []
  let category: string | undefined

  for (const task of TASKS) {
    if (task.category !== category) {
      category = task.category
      choices.push(new Separator(`\n${bold(category)}`))
    }
    choices.push({
      name: `${task.label}\n  ${dim(task.description)}`,
      value: task,
      short: task.label
    })
  }

  return select({ message: 'What would you like to do?', choices, pageSize: 30, loop: false })
}

/** Ctrl+C at a prompt */
const isPromptAbort = (error: unknown) => (error as { name?: string })?.name === 'ExitPromptError'

function reportFailure(error: unknown) {
  const step = error instanceof StepError ? error.step : 'Running the task'
  const command = error instanceof StepError ? error.command : ''
  const output =
    error instanceof StepError ? error.output : String(error instanceof Error ? (error.stack ?? error.message) : error)

  mkdirSync(path.dirname(LOG_PATH), { recursive: true })
  writeFileSync(LOG_PATH, `Step: ${step}\nCommand: ${command}\nTime: ${new Date().toISOString()}\n\n${output}\n`)

  say()
  say(red(`Something went wrong: ${step}.`))
  if (error instanceof StepError && error.hint) say(error.hint)
  say(`The full details were saved to ${cyan('.assist/last-error.log')}`)
  say()
  say(bold('Copy this and send it to the AI:'))
  say(`  Fix the error in .assist/last-error.log`)
}

async function main() {
  // `pnpm assist -- <id>` may forward the "--" itself
  const [id] = process.argv.slice(2).filter(arg => arg !== '--')

  let task: Task | undefined
  if (id) {
    task = TASKS.find(candidate => candidate.id === id)
    if (!task) {
      say(red(`There is no task called "${id}". Available tasks:`))
      for (const candidate of TASKS) say(`  ${candidate.id.padEnd(22)} ${dim(candidate.description)}`)
      process.exitCode = 1
      return
    }
  } else {
    task = await chooseTask()
  }

  say()
  try {
    await task.run()
  } catch (error) {
    if (isPromptAbort(error)) {
      say(yellow('\nCancelled. Nothing was changed.'))
      return
    }
    if (error instanceof Cancelled) {
      say(yellow(error.message || 'Cancelled.'))
      process.exitCode = 1
      return
    }
    reportFailure(error)
    process.exitCode = 1
  }
}

main().catch(error => {
  if (isPromptAbort(error)) {
    say(yellow('\nCancelled. Nothing was changed.'))
    return
  }
  reportFailure(error)
  process.exitCode = 1
})
