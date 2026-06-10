import { ReactNode } from 'react'

import { IconV2 } from '@components/icon-v2'
import { Text } from '@components/text'
import { cn } from '@utils/cn'

import { useCardStatus, useEngineContext } from './split-pane-stepper-context'

export interface SplitPaneStepperCardProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export function SplitPaneStepperCard({ title, description, children, className }: SplitPaneStepperCardProps) {
  const { requestReactivation, cardHistory } = useEngineContext()
  const { subStepId, status } = useCardStatus()
  const isActive = status === 'active'
  const isCompleted = status === 'completed'
  const isError = status === 'error'
  const isSkipped = status === 'skipped'
  const isLastCard = cardHistory[cardHistory.length - 1]?.subStepId === subStepId
  const isFinished = isCompleted && isLastCard && !cardHistory.some(e => e.status === 'active')
  const showRestart = (isCompleted || isError || isSkipped) && !isFinished

  return (
    <div
      className={cn(
        'cn-split-pane-stepper-card',
        {
          'cn-split-pane-stepper-card-active': isActive,
          'cn-split-pane-stepper-card-finished': isFinished,
          'cn-split-pane-stepper-card-completed': (isCompleted || isSkipped) && !isFinished,
          'cn-split-pane-stepper-card-error': isError
        },
        className
      )}
      data-card-id={subStepId}
    >
      <div className="cn-split-pane-stepper-card-header">
        <span className="cn-split-pane-stepper-card-status">
          {isCompleted ? (
            <IconV2 name="check-circle-solid" size="sm" className="text-cn-success" />
          ) : isError ? (
            <IconV2 name="xmark-circle" size="sm" className="text-cn-danger" />
          ) : isSkipped ? (
            <IconV2 name="arrow-right" size="sm" className="text-cn-3" />
          ) : (
            <span className="cn-split-pane-stepper-card-status-dot" />
          )}
        </span>
        <div className="cn-split-pane-stepper-card-title-row">
          <Text as="span" variant="heading-subsection" color="foreground-1">
            {title}
          </Text>
        </div>
        {showRestart && (
          <button
            type="button"
            className="cn-split-pane-stepper-card-edit"
            onClick={() => requestReactivation(subStepId)}
            aria-label="Redo this step"
          >
            <IconV2 name="restart" size="sm" className="text-cn-2" />
          </button>
        )}
      </div>
      {description && (
        <div className="cn-split-pane-stepper-card-description">
          <Text as="p" variant="body-normal" color="foreground-2">
            {description}
          </Text>
        </div>
      )}
      <div className="cn-split-pane-stepper-card-content">{children}</div>
    </div>
  )
}