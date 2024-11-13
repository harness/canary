export interface LivelogLine {
  out?: string
  pos?: number
  time?: number
}

export enum ExecutionState {
  PENDING = 'pending',
  RUNNING = 'running',
  SUCCESS = 'success',
  FAILURE = 'failure',
  ERROR = 'error',
  SKIPPED = 'skipped',
  KILLED = 'killed',
  BLOCKED = 'blocked',
  WAITING_ON_DEPENDENCIES = 'waiting_on_dependencies',
  UNKNOWN = 'unknown'
}

export type CiStatus =
  | 'blocked'
  | 'declined'
  | 'error'
  | 'failure'
  | 'killed'
  | 'pending'
  | 'running'
  | 'skipped'
  | 'success'
  | 'waiting_on_dependencies'
