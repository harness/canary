import path from 'node:path'

import { ROOT, runStep, runSteps, type StepOptions } from '../runner'
import type { Task } from '../types'
import { green, say } from '../ui'
import { ensureFigmaAccess } from './figma'

const UI_DIR = path.join(ROOT, 'packages/ui')

// icons.js and logos.js download from Figma and print "💥 Error ..." but still exit 0
const figmaOptions: StepOptions = {
  failWhen: /💥|❌/,
  hint: 'Figma stopped the download even though the token looked fine. Check the details in the log.'
}

const buildUi = () => runStep('Building the UI package (this can take a few minutes)', 'pnpm', ['build'], UI_DIR)

export const uiPackageTasks: Task[] = [
  {
    id: 'update:icons',
    label: 'Update icons',
    category: 'UI package',
    description: 'Refresh the icon set from the icon files in the UI package.',
    run: async () => {
      await ensureFigmaAccess()
      await runStep('Updating icons', 'pnpm', ['update:icons'], ROOT, figmaOptions)
    }
  },
  {
    id: 'update:logos',
    label: 'Update logos',
    category: 'UI package',
    description: 'Refresh the logo set from the logo files in the UI package.',
    run: async () => {
      await ensureFigmaAccess()
      await runStep('Updating logos', 'pnpm', ['update:logos'], ROOT, figmaOptions)
    }
  },
  {
    id: 'build:ui',
    label: 'Build the UI package',
    category: 'UI package',
    description: 'Build @harnessio/ui so other apps can use your latest changes.',
    run: () => buildUi().then(() => {})
  },
  {
    id: 'publish:yalc',
    label: 'Publish the UI package locally (yalc)',
    category: 'UI package',
    description: 'Build @harnessio/ui and publish it to your local yalc store for testing in other apps.',
    run: async () => {
      await buildUi()
      await runSteps([{ label: 'Publishing to yalc', cmd: 'yalc', args: ['publish'], cwd: UI_DIR }])
      say()
      say(green('Published. Other apps can now pick it up with "yalc add @harnessio/ui".'))
    }
  }
]
