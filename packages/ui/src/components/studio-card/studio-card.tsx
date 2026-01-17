import { PropsWithChildren, useCallback, useMemo, useRef, type JSX } from 'react'

import { IconV2, IconV2NamesType, StatusBadge, Text } from '@/components'
import { cn } from '@/utils'
import { easyPluralize } from '@/utils/stringUtils'

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

const CLICK_DRAG_THRESHOLD = 5
function Root({
  children,
  isGroupCard = false,
  onClick,
  theme = 'default',
  selected = false,
  variant = 'default'
}: PropsWithChildren<StudioCardRootProps>): JSX.Element {
  // Used to determine if a click was a drag or a click
  const dragPos = useRef({ x: 0, y: 0 })

  return (
    <div
      className={cn('cn-studio-card cursor-default', {
        'cn-studio-card-group': isGroupCard,
        'cn-studio-card-stage': variant === 'stage'
      })}
      onMouseDown={e => {
        dragPos.current = { x: e.clientX, y: e.clientY }
      }}
      onClick={e => {
        const dx = Math.abs(e.clientX - dragPos.current.x)
        const dy = Math.abs(e.clientY - dragPos.current.y)

        // If the mouse moved more than 5px, it was a drag, not a click
        if (dx > CLICK_DRAG_THRESHOLD || dy > CLICK_DRAG_THRESHOLD) return

        e.stopPropagation()
        onClick?.(e)
      }}
      role="button"
      tabIndex={-1}
      data-theme={theme}
      data-selected={selected}
    >
      {children}
    </div>
  )
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
      <Text color="foreground-1" className="cn-studio-card-header-title truncate" variant="body-strong">
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

function Message({ message }: StudioCardMessageProps): JSX.Element | null {
  if (!message) return null

  return (
    <Text className="cn-studio-card-message" lineClamp={2} color="foreground-2" variant="caption-normal">
      {message}
    </Text>
  )
}

/**
 * ==========================
 * Expand Button Component
 *
 * It is used to expand the studio card to show the content.
 * Use StudioCard.Button for standalone button inside a studio card.
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

  const stepCountText = easyPluralize(stepCount, 'step', 'steps', true)

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
      <button
        onClick={e => {
          e.stopPropagation()
          onToggle?.()
        }}
        className={cn('cn-studio-card-expand-button-main', {
          'bg-cn-2': isExpanded,
          'bg-cn-3': !isExpanded
        })}
      >
        <Text color="foreground-1" variant="body-single-line-code">
          {stepCountText}
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
 * ====================
 * Tag Component
 * ====================
 */

function Tag({ tagText, icon }: PropsWithChildren<{ tagText: string; icon?: IconV2NamesType }>): JSX.Element {
  const truncatedText = tagText.length > 12 ? `${tagText.slice(0, 12)}...` : tagText

  return (
    <div className="cn-studio-card-tag">
      {icon && <IconV2 name={icon} size="xs" />}
      <Text title={tagText} className="text-cn-gray-outline" variant="caption-single-line-normal">
        {truncatedText}
      </Text>
    </div>
  )
}

/**
 * ====================
 * Footer Component
 * ====================
 */
function Footer({ children }: PropsWithChildren<StudioCardFooterProps>): JSX.Element {
  return (
    <div className="cn-studio-card-footer">
      {typeof children === 'string' ? (
        <Text color="foreground-3" variant="caption-normal">
          {children}
        </Text>
      ) : (
        children
      )}
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

/**
 *
 * =====================
 * Button Component
 *
 * Can be used a standalone button inside a studio card.
 * It is different from expand button.
 * =====================
 */
function StudioCardButton({
  children,
  className,
  onClick,
  icon
}: PropsWithChildren<{
  className?: string
  onClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  icon?: IconV2NamesType
}>): JSX.Element {
  return (
    <button
      onClick={e => {
        e.stopPropagation()
        onClick(e)
      }}
      type="button"
      className={cn('cn-studio-card-button', 'bg-cn-3 shadow-cn-none self-start', className)}
    >
      <Text color="foreground-1" variant="body-single-line-code">
        {children}
      </Text>
      {icon && <IconV2 className="text-cn-2" name={icon} size="sm" />}
    </button>
  )
}

export const StudioCard = {
  Root,
  Header,
  Content,
  Footer,
  Status,
  Message,
  Tag,
  Button: StudioCardButton,
  ExpandButton,
  CustomActions
}

export type * from './studio-card-types'
