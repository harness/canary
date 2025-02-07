import { type TreeViewElement } from '@/components'
import { CiStatus } from '@views/pipelines'
import { ExecutionState } from '@views/repo/pull-request'

export interface StepProps {
  name?: string
  status: ExecutionState
  started?: number
  stopped?: number
  inputs?: KeyValuePair[]
  outputs?: KeyValuePair[]
  number?: number
}

export interface StepExecutionProps {
  onEdit: () => void
  onDownload: () => void
  onCopy: () => void
  step?: StepProps
  logs?: LivelogLine[]
  query?: string
  handleInputChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export interface StageProps {
  name?: string
  group?: string
  steps?: StepProps[]
}

export interface ILogsStore {
  logs?: LivelogLine[]
}

export interface ExecutionInfoProps {
  useLogsStore: () => ILogsStore
  onEdit: () => void
  onDownload: () => void
  onCopy: () => void
}

export interface ConsoleLogsProps {
  logs?: LivelogLine[]
  query?: string
}

export interface LivelogLine {
  out?: string
  pos?: number
  time?: number
  duration?: number
}

export interface NodeSelectionProps {
  parentNode?: TreeViewElement | null
  childNode?: TreeViewElement | null
}

export interface ExecutionTreeProps {
  defaultSelectedId: string
  elements: TreeViewElement[]
  onSelectNode: ({ parentNode, childNode }: NodeSelectionProps) => void
}

export type KeyValuePair = {
  name: string
  value: string | KeyValuePair[]
}

export interface KeyValueTableProps {
  tableTitleName: string
  tableTitleVal: string
  className?: string
  tableSpec: KeyValuePair[]
}

export interface ExecutionStatusProps {
  status: ExecutionState
}

export interface BadgeProps {
  duration?: string /* time formatted as string */
  minimal?: boolean
}

export interface Step {
  number?: number
  name?: string
  status?: CiStatus
  started?: number
  stopped?: number
}

export interface Stage {
  number?: number
  name?: string
  status?: CiStatus
  started?: number
  stopped?: number
  steps?: Step[]
}

export interface Execution {
  stages?: Stage[]
}
