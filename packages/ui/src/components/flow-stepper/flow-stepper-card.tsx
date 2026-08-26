import { ReactNode } from 'react'

import { IconV2 } from '@components/icon-v2'
import { Layout } from '@components/layout'
import { Text } from '@components/text'
import { cn } from '@utils/cn'

import { useCardStatus, useEngineContext } from './engine/engine-context'
import { CardStatus } from './engine/engine-types'

export interface FlowStepperCardProps {
  title: string
  description?: string
  /** When set, renders a warning icon and message above card content (e.g. blocked preselect state). */
  blockedMessage?: string
  children: ReactNode
  className?: string
}

function BlockedMessage({ message }: { message: string }) {
  return (
    <Layout.Horizontal gap="xs" align="start" className="cn-flow-stepper-card-blocked-message">
      <IconV2 name="warning-triangle" size="sm" />
      <Text>{message}</Text>
    </Layout.Horizontal>
  )
}

// State machine: active and error are interactive; completed and skipped are terminal.
const INTERACTIVE_STATES: Set<CardStatus> = new Set(['active', 'error'])
const TERMINAL_STATES: Set<CardStatus> = new Set(['completed', 'skipped'])

function shouldShowRestart(status: CardStatus, cardHistory: { stepId: string; status: CardStatus }[], stepId: string) {
  const isTerminal = TERMINAL_STATES.has(status)
  const isLastCard = cardHistory[cardHistory.length - 1]?.stepId === stepId
  const isFlowComplete = !cardHistory.some(e => INTERACTIVE_STATES.has(e.status))
  const isFinished = isTerminal && isLastCard && isFlowComplete
  return isTerminal && !isFinished
}

/** Restart control for a terminal (not finished) step. Single-pane slots this into the step header
 *  beside the collapse caret so card content keeps full width. DualPane still renders it in the
 *  card title row. Hover reveal is CSS on the whole step item (or DualPane card). */
export function FlowStepperRestartButton({ stepId, status }: { stepId: string; status: CardStatus }) {
  const { requestReactivation, cardHistory } = useEngineContext()

  if (!shouldShowRestart(status, cardHistory, stepId)) return null

  return (
    <button
      type="button"
      className="cn-flow-stepper-card-edit"
      onClick={event => {
        event.stopPropagation()
        requestReactivation(stepId)
      }}
      aria-label="Redo this step"
    >
      <IconV2 name="restart" size="sm" />
    </button>
  )
}

export function FlowStepperCard({ title, description, blockedMessage, children, className }: FlowStepperCardProps) {
  const { cardHistory } = useEngineContext()
  const { stepId, status, contentOnly } = useCardStatus()

  const isTerminal = TERMINAL_STATES.has(status)
  const isLastCard = cardHistory[cardHistory.length - 1]?.stepId === stepId
  const isFlowComplete = !cardHistory.some(e => INTERACTIVE_STATES.has(e.status))
  const isFinished = isTerminal && isLastCard && isFlowComplete

  const cardClassName = cn(
    'cn-flow-stepper-card',
    {
      'cn-flow-stepper-card-active': status === 'active',
      'cn-flow-stepper-card-finished': isFinished,
      'cn-flow-stepper-card-completed': isTerminal && !isFinished,
      'cn-flow-stepper-card-error': status === 'error'
    },
    className
  )

  const contentInertProps = isTerminal && !isFinished ? ({ inert: '' } as React.HTMLAttributes<HTMLDivElement>) : {}

  if (contentOnly) {
    return (
      // Single-pane: Restart lives in the Stepper.Step header (left of the collapse caret), not
      // beside this body. Tiles keep the full content width whether Restart is showing or not.
      <div className={cardClassName}>
        {/* inert disables all interaction (click, focus, a11y) in terminal-state cards.
           The finished card (last card in a completed flow) stays interactive for final actions.
           Cast needed because React 18 types don't include inert yet. */}
        <div className="cn-flow-stepper-card-content" {...contentInertProps}>
          {description && (
            <div className="cn-flow-stepper-card-description">
              <Text as="p" variant="body-normal" color="foreground-2">
                {description}
              </Text>
            </div>
          )}
          {blockedMessage && <BlockedMessage message={blockedMessage} />}
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className={cardClassName}>
      <div className="cn-flow-stepper-card-header">
        <span className="cn-flow-stepper-card-status">
          {status === 'completed' ? (
            <IconV2 name="check-circle-solid" size="sm" className="text-cn-success" />
          ) : status === 'error' ? (
            <IconV2 name="xmark-circle" size="sm" className="text-cn-danger" />
          ) : status === 'skipped' ? (
            <IconV2 name="arrow-right" size="sm" className="text-cn-3" />
          ) : (
            <span className="cn-flow-stepper-card-status-dot" />
          )}
        </span>
        <div className="cn-flow-stepper-card-title-row">
          <Text as="span" variant="heading-subsection" color="foreground-1">
            {title}
          </Text>
        </div>
        <FlowStepperRestartButton stepId={stepId} status={status} />
      </div>
      {description && (
        <div className="cn-flow-stepper-card-description">
          <Text as="p" variant="body-normal" color="foreground-2">
            {description}
          </Text>
        </div>
      )}
      <div className="cn-flow-stepper-card-content" {...contentInertProps}>
        {blockedMessage && <BlockedMessage message={blockedMessage} />}
        {children}
      </div>
    </div>
  )
}
