import { JSX } from 'react'

import { StatusBadgeTheme } from '@components/status-badge/status-badge'

export type ExecutionStatusType = 'executing' | 'success' | 'warning' | 'error' | 'queued' | undefined

export interface StudioCardRootProps {
  isGroupCard?: boolean
  onClick?: React.MouseEventHandler<HTMLDivElement>
  theme?: 'default' | 'success' | 'warning' | 'danger'
  selected?: boolean
  // It will be updated to a generic value later
  variant?: 'default' | 'stage'
  execution?: boolean
  size?: 'xs' | 'sm' | 'md'
}

export interface StudioCardHeaderProps {
  icon: React.ReactNode
  title: string
  actions: JSX.Element | null
}

export interface StudioCardFooterProps {
  size?: 'compact' | 'default'
  invisible?: boolean
}

export interface StudioCardMessageProps {
  message?: string
}

export interface StudioCardStatusProps {
  theme?: StatusBadgeTheme
  status?: ExecutionStatusType
}

export interface StudioCardContentProps {
  className?: string
}

export interface StudioCardExpandButtonProps {
  stepCount: number
  isExpanded?: boolean
  onToggle?: () => void
  label: string
  icon?: React.ReactElement
  loading?: boolean
  stackDirection?: 'right' | 'bottom'
  variant?: 'default' | 'minimal'
}
