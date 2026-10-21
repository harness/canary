import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'

import { ROOT, runStep, runSteps, type Step } from '../runner'
import type { Task } from '../types'

/** Workspaces that can check formatting (`pretty`) but have no `pretty:fix` script of their own. */
function workspacesWithoutFixScript(): string[] {
  return ['apps', 'packages'].flatMap(group => {
    const groupDir = path.join(ROOT, group)
    return readdirSync(groupDir).flatMap(name => {
      const manifest = path.join(groupDir, name, 'package.json')
      if (!existsSync(manifest)) return []
      const scripts = JSON.parse(readFileSync(manifest, 'utf8')).scripts ?? {}
      return scripts.pretty && !scripts['pretty:fix'] ? [path.join(groupDir, name)] : []
    })
  })
}

const formatSteps = (): Step[] => [
  { label: 'Fixing code formatting', cmd: 'pnpm', args: ['-r', 'pretty:fix'] },
  ...workspacesWithoutFixScript().map(dir => ({
    label: `Fixing code formatting in ${path.relative(ROOT, dir)}`,
    cmd: 'pnpm',
    args: ['exec', 'prettier', '--write', './src'],
    cwd: dir
  }))
]

const lintStep: Step = { label: 'Checking code style', cmd: 'pnpm', args: ['lint'] }
const typecheckStep: Step = { label: 'Checking for type errors', cmd: 'pnpm', args: ['typecheck'] }
const dsCheckStep: Step = {
  label: 'Checking design system contracts',
  cmd: 'pnpm',
  args: ['--filter', '@harnessio/ui', 'ds-check', '--schema', '--refs', '--code', '--source', '--generated'],
  cwd: ROOT
}
const testStep: Step = { label: 'Running tests', cmd: 'pnpm', args: ['test'] }

export const qualityTasks: Task[] = [
  {
    id: 'format',
    label: 'Fix code formatting',
    category: 'Quality',
    description: 'Automatically tidy the formatting of the code in every package.',
    run: () => runSteps(formatSteps())
  },
  {
    id: 'lint',
    label: 'Check code style',
    category: 'Quality',
    description: 'Look for code style problems. If any are found, ask the AI to fix them.',
    run: () => runStep(lintStep.label, lintStep.cmd, lintStep.args).then(() => {})
  },
  {
    id: 'typecheck',
    label: 'Check for type errors',
    category: 'Quality',
    description: 'Make sure the code has no TypeScript errors.',
    run: () => runStep(typecheckStep.label, typecheckStep.cmd, typecheckStep.args).then(() => {})
  },
  {
    id: 'test',
    label: 'Run tests',
    category: 'Quality',
    description: 'Run the automated tests for all packages.',
    run: () => runStep(testStep.label, testStep.cmd, testStep.args).then(() => {})
  },
  {
    id: 'check-all',
    label: 'Check everything',
    category: 'Quality',
    description: 'Fix formatting, then check code style, types, design system contracts and tests. Stops at the first problem.',
    run: () => runSteps([...formatSteps(), lintStep, typecheckStep, dsCheckStep, testStep])
  }
]
