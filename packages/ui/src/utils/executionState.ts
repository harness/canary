// TODO: should be deleted
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
  UNKNOWN = 'unknown',
  FAILURE_IGNORED = 'failure_ignored',
  IGNORE_FAILED = 'ignorefailed'
}
