import { appTasks } from './tasks/apps'
import { qualityTasks } from './tasks/quality'
import { setupTasks } from './tasks/setup'
import { uiPackageTasks } from './tasks/ui-package'
import { workspaceTasks } from './tasks/workspace'
import type { Task } from './types'

/** Single source of truth: the menu, the by-id mode and the docs all read from this list. */
export const TASKS: Task[] = [...workspaceTasks, ...appTasks, ...uiPackageTasks, ...qualityTasks, ...setupTasks]
