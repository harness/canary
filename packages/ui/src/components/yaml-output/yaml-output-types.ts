import { type ReactNode } from 'react'

export interface YamlOutputProps {
  value: string
  onChange?: (value: string) => void
  title?: string
  icon?: ReactNode
  view?: 'yaml'
  onRun?: (value: string) => void
  runLabel?: string
  runDisabled?: boolean
  runLoading?: boolean
  readOnly?: boolean
  /**
   * Shows the YAML/Visual mode ToggleGroup in the header. Defaults to true. Visual mode has no
   * implementation yet (its segment is always disabled) — consumers with no use for the toggle
   * (e.g. a single-purpose read-only panel) can pass false to omit it entirely.
   */
  showModeToggle?: boolean
}
