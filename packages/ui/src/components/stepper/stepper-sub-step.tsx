import { useEffect } from 'react'

import { IconV2 } from '@components/icon-v2'
import { Text } from '@components/text'
import { Tooltip } from '@components/tooltip'
import { cn } from '@utils/cn'

import { useParentStep, useStepperContext } from './stepper-context'
import { StepperSubStepProps } from './stepper-types'

export function StepperSubStep({ value, title, description, className }: StepperSubStepProps) {
  const parentValue = useParentStep()
  const ctx = useStepperContext()

  // Register substep on mount
  useEffect(() => {
    const cleanup = ctx.registerSubStep(parentValue, value)
    return cleanup
  }, [parentValue, value]) // eslint-disable-line react-hooks/exhaustive-deps

  const derivedState = ctx.getSubStepState(parentValue, value)
  const isActive = derivedState === 'active'

  const subs = ctx.subSteps.get(parentValue) || []
  const subIndex = subs.indexOf(value)
  const ordinal = `.${subIndex + 1}`

  const stateClass = `cn-stepper-substep-${derivedState}`

  const handleClick = () => {
    ctx.selectSubStep(value)
  }

  return (
    <li className={cn('cn-stepper-substep-item', stateClass)}>
      <button
        type="button"
        className={cn('cn-stepper-substep', stateClass, className)}
        onClick={handleClick}
        aria-current={isActive ? 'step' : undefined}
        aria-label={typeof title === 'string' ? title : value}
        tabIndex={isActive ? 0 : -1}
      >
        <span className="cn-stepper-substep-branch" aria-hidden="true" />
        <span className="cn-stepper-substep-indicator">
          {derivedState === 'completed' ? (
            <IconV2 name="check" size="xs" />
          ) : derivedState === 'active' ? (
            <span className="cn-stepper-substep-dot" />
          ) : (
            <span className="cn-stepper-substep-ordinal">{ordinal}</span>
          )}
        </span>
        <span className="cn-stepper-substep-content">
          {typeof title === 'string' ? (
            <Tooltip content={title} delay={400}>
              <Text as="span" variant="body-strong" color="foreground-1" truncate className="cn-stepper-substep-title">
                {title}
              </Text>
            </Tooltip>
          ) : (
            <Text as="span" variant="body-strong" color="foreground-1" truncate className="cn-stepper-substep-title">
              {title}
            </Text>
          )}
          {description && (
            <Text as="span" variant="body-normal" color="foreground-3" className="cn-stepper-substep-description">
              {description}
            </Text>
          )}
        </span>
      </button>
    </li>
  )
}
