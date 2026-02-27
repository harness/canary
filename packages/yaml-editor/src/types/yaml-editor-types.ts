import type { editor } from 'monaco-editor'

/**
 * Visual or YAML view toggle value
 */
export type VisualYamlValue = 'visual' | 'yaml'

/**
 * Problem severity level
 */
export type ProblemSeverity = 'error' | 'warning' | 'info'

/**
 * Problem item representing a validation issue
 */
export interface Problem<T = unknown> {
  severity: ProblemSeverity
  message: string
  position: {
    row: number
    column: number
  }
  data?: T
  action?: React.ReactNode
}

/**
 * YAML validation error data
 */
export interface YamlErrorDataType {
  problems: Problem<editor.IMarker>[]
  problemsCount: Record<ProblemSeverity | 'all', number>
  isYamlValid: boolean
}
