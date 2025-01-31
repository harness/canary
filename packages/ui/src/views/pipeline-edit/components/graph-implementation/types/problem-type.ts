export type ProblemSeverity = 'error' | 'warning' | 'info'

export interface Problem<T = unknown> {
  severity: ProblemSeverity
  message: string
  position: {
    row: number
    column: number
  }
  data?: T
}
