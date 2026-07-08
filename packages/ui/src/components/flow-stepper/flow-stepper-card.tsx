import { ReactNode } from 'react'

import { IconV2 } from '@components/icon-v2'
import { Text } from '@components/text'
import { cn } from '@utils/cn'

import { useCardStatus, useEngineContext } from './engine/engine-context'
import { CardStatus } from './engine/engine-types'

export interface FlowStepperCardProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

// State machine: active and error are interactive; completed and skipped are terminal.
const INTERACTIVE_STATES: Set<CardStatus> = new Set(['active', 'error'])
const TERMINAL_STATES: Set<CardStatus> = new Set(['completed', 'skipped'])

export function FlowStepperCard({ title, description, children, className }: FlowStepperCardProps) {
  const { requestReactivation, cardHistory } = useEngineContext()
  const { subStepId, status } = useCardStatus()

  const isTerminal = TERMINAL_STATES.has(status)
  const isLastCard = cardHistory[cardHistory.length - 1]?.subStepId === subStepId
  const isFlowComplete = !cardHistory.some(e => INTERACTIVE_STATES.has(e.status))
  const isFinished = isTerminal && isLastCard && isFlowComplete
  const showRestart = isTerminal && !isFinished

  return (
    <div
      className={cn(
        'cn-flow-stepper-card',
        {
          'cn-flow-stepper-card-active': status === 'active',
          'cn-flow-stepper-card-finished': isFinished,
          'cn-flow-stepper-card-completed': isTerminal && !isFinished,
          'cn-flow-stepper-card-error': status === 'error'
        },
        className
      )}
    >
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
        {showRestart && (
          <button
            type="button"
            className="cn-flow-stepper-card-edit"
            onClick={() => requestReactivation(subStepId)}
            aria-label="Redo this step"
          >
            <IconV2 name="restart" size="sm" className="text-cn-2" />
          </button>
        )}
      </div>
      {description && (
        <div className="cn-flow-stepper-card-description">
          <Text as="p" variant="body-normal" color="foreground-2">
            {description}
          </Text>
        </div>
      )}
      {/* inert disables all interaction (click, focus, a11y) in terminal-state cards.
         The finished card (last card in a completed flow) stays interactive for final actions.
         Cast needed because React 18 types don't include inert yet. */}
      <div
        className="cn-flow-stepper-card-content"
        {...(isTerminal && !isFinished ? ({ inert: '' } as React.HTMLAttributes<HTMLDivElement>) : {})}
      >
        {children}
      </div>
    </div>
  )
}
