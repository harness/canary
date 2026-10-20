import { spawn } from 'node:child_process'
import path from 'node:path'

import ora from 'ora'

export const ROOT = path.resolve(__dirname, '../..')

/** A step failed; carries the raw output so it can be saved to the error log. */
export class StepError extends Error {
  constructor(
    public step: string,
    public command: string,
    public output: string,
    public hint?: string
  ) {
    super(`${step} failed`)
  }
}

/** The Contributor chose not to continue. Not an error. */
export class Cancelled extends Error {}

export interface Step {
  label: string
  cmd: string
  args: string[]
  cwd?: string
}

const display = (cmd: string, args: string[]) => [cmd, ...args].join(' ')

function exec(cmd: string, args: string[], cwd: string): Promise<{ code: number; output: string }> {
  return new Promise(resolve => {
    const child = spawn(cmd, args, {
      cwd,
      env: { ...process.env, FORCE_COLOR: '0' },
      stdio: ['ignore', 'pipe', 'pipe']
    })
    let output = ''
    child.stdout.on('data', chunk => (output += chunk))
    child.stderr.on('data', chunk => (output += chunk))
    child.on('error', error => resolve({ code: 127, output: `${output}\n${error.message}` }))
    child.on('close', code => resolve({ code: code ?? 1, output }))
  })
}

/** Runs one command behind a spinner. Output is hidden unless the step fails. */
export interface StepOptions {
  /** For scripts that print an error but still exit 0: treat matching output as a failure. */
  failWhen?: RegExp
  /** Plain-language advice shown to the Contributor when the step fails. */
  hint?: string
}

export async function runStep(
  label: string,
  cmd: string,
  args: string[],
  cwd: string = ROOT,
  options: StepOptions = {}
): Promise<string> {
  const spinner = ora({ text: label, spinner: 'dots' }).start()
  const { code, output } = await exec(cmd, args, cwd)
  if (code !== 0 || options.failWhen?.test(output)) {
    spinner.fail(label)
    throw new StepError(label, display(cmd, args), output, options.hint)
  }
  spinner.succeed(label)
  return output
}

/**
 * Shows a spinner around quick in-process work (a check, creating a file) so no step is silent.
 * `done` can turn the result into the final line, e.g. "No unsaved changes".
 */
export async function runAction<T>(
  label: string,
  work: () => T | Promise<T>,
  done?: (result: T) => string
): Promise<T> {
  const spinner = ora({ text: label, spinner: 'dots' }).start()
  try {
    const result = await work()
    spinner.succeed(done ? done(result) : label)
    return result
  } catch (error) {
    if (error instanceof Cancelled) {
      spinner.stop()
      throw error
    }
    spinner.fail(label)
    throw new StepError(label, '', error instanceof Error ? (error.stack ?? error.message) : String(error))
  }
}

/** Runs steps one after another, numbering them "(1/3)". Stops at the first failure. */
export async function runSteps(steps: Step[]): Promise<void> {
  for (const [index, step] of steps.entries()) {
    const label = steps.length > 1 ? `${step.label} (${index + 1}/${steps.length})` : step.label
    await runStep(label, step.cmd, step.args, step.cwd)
  }
}

/** Hands the terminal to a long-running process (a dev server) until Ctrl+C. */
export function runForeground(cmd: string, args: string[], cwd: string = ROOT): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd, stdio: 'inherit' })
    child.on('error', error => reject(new StepError(display(cmd, args), display(cmd, args), error.message)))
    child.on('close', (code, signal) => {
      // Ctrl+C is the normal way to stop a server
      if (code === 0 || signal || code === 130) return resolve()
      reject(
        new StepError(
          display(cmd, args),
          display(cmd, args),
          'The process stopped unexpectedly. See the messages above.'
        )
      )
    })
  })
}
