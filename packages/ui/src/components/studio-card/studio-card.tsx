import { PropsWithChildren, useCallback, useMemo, type JSX } from 'react'

import { IconV2, IconV2NamesType, StatusBadge, Text } from '@/components'
import { cn } from '@/utils'

import {
  StudioCardContentProps,
  StudioCardExpandButtonProps,
  StudioCardFooterProps,
  StudioCardHeaderProps,
  StudioCardMessageProps,
  StudioCardRootProps,
  StudioCardStatusProps
} from './studio-card-types'

/**
 * =================
 * Root Component
 * =================
 */

function Root({ children, isGroupCard = false }: PropsWithChildren<StudioCardRootProps>): JSX.Element {
  return <div className={cn('cn-studio-card', { 'cn-studio-card-group': isGroupCard })}>{children}</div>
}

/**
 * ==================
 * Header Component
 * ==================
 */

function Header({ icon, title, actions }: StudioCardHeaderProps): JSX.Element {
  const headerIcon = icon ?? <IconV2 size="lg" name="harness-plugins" />

  return (
    <div className="cn-studio-card-header">
      {headerIcon}
      <Text className="cn-studio-card-header-title" variant="body-strong">
        {title}
      </Text>

      {/* Actions menu */}
      {actions}
    </div>
  )
}

/**
 * ====================
 * Content Component
 * ====================
 */

function Content({ children, className }: PropsWithChildren<StudioCardContentProps>): JSX.Element {
  return <div className={cn('cn-studio-card-content', className)}>{children}</div>
}

/**
 * ====================
 * Message Component
 * ====================
 */

function Message({ message }: StudioCardMessageProps): JSX.Element {
  return (
    <Text className="cn-studio-card-message" lineClamp={2} color="foreground-2" variant="caption-normal">
      {message}
    </Text>
  )
}

/**
 * ==========================
 * Expand Button Component
 * ==========================
 */

function ExpandButton({ stepCount, isExpanded = false, onToggle }: StudioCardExpandButtonProps): JSX.Element | null {
  // Calculate number of stacks to show (max 2)
  const stackCount = useMemo(() => {
    if (isExpanded || stepCount <= 1) return 0
    if (stepCount === 2) return 1
    return 2 // For 3 or more steps
  }, [stepCount, isExpanded])

  if (stepCount === 0) return null

  return (
    <div className="cn-studio-card-expand-button" data-expanded={isExpanded}>
      {/* Stacking cards - positioned behind the button */}
      {stackCount > 0 && (
        <>
          {stackCount >= 2 && (
            <div className="cn-studio-card-expand-button-stack cn-studio-card-expand-button-stack-2" />
          )}
          {stackCount >= 1 && (
            <div className="cn-studio-card-expand-button-stack cn-studio-card-expand-button-stack-1" />
          )}
        </>
      )}

      {/* Main button */}
      <button type="button" onClick={onToggle} className="cn-studio-card-expand-button-main">
        <Text color="foreground-1" variant="body-single-line-code">
          {stepCount} steps
        </Text>
        <IconV2 className="text-cn-2" name={isExpanded ? 'collapse' : 'expand'} size="sm" />
      </button>
    </div>
  )
}

/**
 * ====================
 * Status Component
 * ====================
 */

function Status({ status }: StudioCardStatusProps): JSX.Element | null {
  const getStatusConfig = useCallback(() => {
    switch (status) {
      case 'queued':
        return { theme: 'muted' as const, label: 'Queued' }
      case 'executing':
        return { theme: 'warning' as const, label: 'Running' }
      case 'success':
        return { theme: 'success' as const, label: 'Completed' }
      case 'warning':
        return { theme: 'warning' as const, label: 'Warning' }
      case 'error':
        return { theme: 'danger' as const, label: 'Error' }
      default:
        return { theme: 'muted' as const, label: 'Unknown' }
    }
  }, [status])

  const { theme, label } = useMemo(() => getStatusConfig(), [getStatusConfig])

  if (!status) return null

  return (
    <StatusBadge data-status={status} className="cn-studio-card-status" size="sm" variant="outline" theme={theme}>
      {status === 'executing' && <IconV2 name="loader" className="animate-spin" size="xs" />}
      {label}
    </StatusBadge>
  )
}

/**
 *
 */

function Tag({ tagText, icon }: PropsWithChildren<{ tagText: string; icon?: IconV2NamesType }>): JSX.Element {
  return (
    <div className="cn-studio-card-tag">
      {icon && <IconV2 name={icon} size="xs" />}
      <Text className="text-cn-gray-outline" variant="caption-single-line-normal">
        {tagText}
      </Text>
    </div>
  )
}

/**
 * ====================
 * Footer Component
 * ====================
 */

function Footer({ message }: StudioCardFooterProps): JSX.Element | null {
  if (!message) return null

  return (
    <div className="cn-studio-card-footer">
      <Text lineClamp={2} color="foreground-3" variant="caption-normal">
        {message}
      </Text>
    </div>
  )
}

/**
 * ===========================
 * Custom actions component
 * ===========================
 */
function CustomActions({ children }: PropsWithChildren<any>): JSX.Element {
  return <>{children}</>
}

export const StudioCard = {
  Root,
  Header,
  Status,
  Tag,
  Message,
  Content,
  Footer,
  ExpandButton,
  CustomActions
}

export type * from './studio-card-types'
