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
}
