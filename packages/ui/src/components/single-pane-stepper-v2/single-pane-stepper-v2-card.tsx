import { Text } from '@components/text'
import { cn } from '@utils/cn'

import { useCardStatus, useEngineContext } from '../flow-stepper/engine'
import { FlowStepperRestartButton, shouldShowRestart } from '../flow-stepper/flow-stepper-card'
import { SinglePaneStepperV2Answer } from './single-pane-stepper-v2-answer'
import { useSinglePaneStepperV2Layout } from './single-pane-stepper-v2-layout-context'
import { SinglePaneStepperV2CardProps } from './single-pane-stepper-v2-types'

function resolveAnswer(
  answerProp: string | undefined,
  historyAnswer: string | undefined,
  stateSnapshot: Record<string, unknown> | undefined
) {
  if (typeof answerProp === 'string' && answerProp.length > 0) return answerProp
  if (typeof historyAnswer === 'string' && historyAnswer.length > 0) return historyAnswer
  const snapshotAnswer = stateSnapshot?.answer
  if (typeof snapshotAnswer === 'string' && snapshotAnswer.length > 0) return snapshotAnswer
  return undefined
}

export function SinglePaneStepperV2Card({
  title,
  description,
  answer,
  children,
  className
}: SinglePaneStepperV2CardProps) {
  const { cardHistory } = useEngineContext()
  const { stepId, status } = useCardStatus()
  const { showStepBadge, totalSteps } = useSinglePaneStepperV2Layout()

  const entry = cardHistory.find(item => item.stepId === stepId)
  const stepNumber = cardHistory.findIndex(item => item.stepId === stepId) + 1
  const showRestart = shouldShowRestart(status, cardHistory, stepId)
  const resolvedAnswer = resolveAnswer(answer, entry?.answer, entry?.stateSnapshot)

  return (
    <div
      className={cn(
        'cn-single-pane-stepper-v2-card',
        {
          'cn-single-pane-stepper-v2-card-active': status === 'active',
          'cn-single-pane-stepper-v2-card-completed': status === 'completed',
          'cn-single-pane-stepper-v2-card-error': status === 'error',
          'cn-single-pane-stepper-v2-card-skipped': status === 'skipped'
        },
        className
      )}
    >
      <div className="cn-single-pane-stepper-v2-card-copy">
        <div className="cn-single-pane-stepper-v2-card-title-row">
          <Text as="h3" variant="body-strong" color="foreground-1" className="cn-single-pane-stepper-v2-card-title">
            {title}
          </Text>
          {showStepBadge && stepNumber > 0 && totalSteps > 0 ? (
            <span className="cn-single-pane-stepper-v2-step-badge">
              Step {stepNumber}/{totalSteps}
            </span>
          ) : null}
        </div>
        {description ? (
          <Text
            as="p"
            variant="body-normal"
            color="foreground-3"
            className="cn-single-pane-stepper-v2-card-description"
          >
            {description}
          </Text>
        ) : null}
      </div>

      {status === 'completed' ? (
        resolvedAnswer ? (
          <SinglePaneStepperV2Answer
            stepId={stepId}
            answer={resolvedAnswer}
            completedAt={entry?.completedAt}
            showRestart={showRestart}
          />
        ) : null
      ) : status === 'skipped' ? (
        <div className="cn-single-pane-stepper-v2-card-content">
          <Text as="p" variant="body-normal" color="foreground-3">
            Skipped
          </Text>
          <FlowStepperRestartButton stepId={stepId} status={status} />
        </div>
      ) : (
        <div className="cn-single-pane-stepper-v2-card-content">{children}</div>
      )}
    </div>
  )
}
