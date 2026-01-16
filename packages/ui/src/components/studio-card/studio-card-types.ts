import { JSX } from 'react'

import { ExecutionStatusType } from '../pipeline-nodes/types/types'

export interface StudioCardRootProps {
  isGroupCard?: boolean
  onClick?: React.MouseEventHandler<HTMLDivElement>
  theme?: 'default' | 'success' | 'warning' | 'danger'
  selected?: boolean
}

export interface StudioCardHeaderProps {
  icon: React.ReactNode
  title: string
  actions: JSX.Element | null
}

export interface StudioCardFooterProps {}

export interface StudioCardMessageProps {
  message?: string
}

export interface StudioCardStatusProps {
  status?: ExecutionStatusType
}

export interface StudioCardContentProps {
  className?: string
}

export interface StudioCardExpandButtonProps {
  stepCount: number
  isExpanded?: boolean
  onToggle?: () => void
}
