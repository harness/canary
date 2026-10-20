import { runForeground, runStep } from '../runner'
import type { Task } from '../types'
import { dim, say } from '../ui'

// Same package build the existing portal:dev / view-preview:dev scripts do before starting the app
const buildPackages = () =>
  runStep('Building the packages (this can take a few minutes)', 'pnpm', ['-r', '-F', './packages/*', 'build'])

async function startApp(app: string, name: string) {
  await buildPackages()
  say()
  say(`Starting the ${name}. The address to open will appear below.`)
  say(dim('Press Ctrl+C to stop it.'))
  say()
  await runForeground('pnpm', ['-r', '-F', `./apps/${app}`, 'dev'])
}

export const appTasks: Task[] = [
  {
    id: 'start:portal',
    label: 'Start the documentation portal',
    category: 'Apps',
    description: 'Build the packages, then run the portal so you can see your changes in the browser.',
    run: () => startApp('portal', 'documentation portal')
  },
  {
    id: 'start:design-system',
    label: 'Start the design-system preview',
    category: 'Apps',
    description: 'Build the packages, then run the design-system preview app.',
    run: () => startApp('design-system', 'design-system preview')
  }
]
