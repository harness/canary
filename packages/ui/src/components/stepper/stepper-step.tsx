import { useEffect } from 'react'

import { IconV2 } from '@components/icon-v2'
import { Text } from '@components/text'
import { Tooltip } from '@components/tooltip'
import { cn } from '@utils/cn'

import { ParentStepProvider, useStepperContext } from './stepper-context'
import { StepperStepProps } from './stepper-types'

export function StepperStep({
  value,
  title,
  description,
  state,
  loading,
  blocking,
  hasSubSteps,
  disabled,
  className,
  children
}: StepperStepProps) {
  const ctx = useStepperContext()

  // Register step on mount
  useEffect(() => {
    const cleanup = ctx.registerStep(value)
    return cleanup
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  // Register metadata
  useEffect(() => {
    ctx.registerStepMeta(value, { disabled, blocking, state, loading })
  }, [value, disabled, blocking, state, loading]) // eslint-disable-line react-hooks/exhaustive-deps

  const derivedState = state || ctx.getStepState(value)
  const stepDisabled = ctx.isStepDisabled(value)
  const stepIndex = ctx.orderedSteps.indexOf(value)
  const stepNumber = stepIndex + 1

  const isActive = derivedState === 'active'
  const isLoading = isActive && loading

  // Render children if active, completed, OR if the current value is unresolved (not known as any
  // registered step or substep). This allows substeps to register on the first render
  // when the root value is a substep value that hasn't been registered yet.
  // Completed steps also render children so that visited substeps remain visible.
  const isValueUnresolved =
    ctx.orderedSteps.indexOf(ctx.value) < 0 && !Array.from(ctx.subSteps.values()).some(subs => subs.includes(ctx.value))
  const shouldRenderChildren = isActive || derivedState === 'completed' || derivedState === 'error' || isValueUnresolved

  const stateClass = `cn-stepper-step-${derivedState}`
  const loadingClass = isLoading ? 'cn-stepper-step-loading' : ''

  const handleClick = () => {
    if (stepDisabled) return
    ctx.selectStep(value)
  }

  const isTransitionSource = ctx.transitioning?.sourceIndex === stepIndex
  const isTransitionTarget = ctx.transitioning?.targetIndex === stepIndex

  const showPlaceholder = hasSubSteps && derivedState !== 'completed'

  const substepPlaceholder = (
    <span className="cn-stepper-substep-placeholder" aria-hidden="true">
      <span className="cn-stepper-substep-placeholder-branch" />
      <span className="cn-stepper-substep-placeholder-indicator">
        <IconV2 name="more-horizontal" size="xs" />
      </span>
      <span className="cn-stepper-substep-placeholder-spacer">
        <span className="cn-stepper-substep-title" style={{ visibility: 'hidden' }}>
          &nbsp;
        </span>
        <span className="cn-stepper-substep-description" style={{ visibility: 'hidden' }}>
          &nbsp;
        </span>
      </span>
    </span>
  )

  return (
    <li
      className={cn('cn-stepper-step-item', {
        'cn-stepper-step-transitioning': isTransitionSource || isTransitionTarget,
        'cn-stepper-indicator-leaving': isTransitionSource,
        'cn-stepper-indicator-entering': isTransitionTarget
      })}
    >
      <button
        type="button"
        className={cn('cn-stepper-step', stateClass, loadingClass, className)}
        disabled={stepDisabled}
        onClick={handleClick}
        aria-current={isActive ? 'step' : undefined}
        aria-label={`Step ${stepNumber} of ${ctx.orderedSteps.length}: ${typeof title === 'string' ? title : value}`}
        aria-disabled={stepDisabled ? 'true' : undefined}
        tabIndex={stepDisabled ? undefined : isActive ? 0 : -1}
      >
        <span className="cn-stepper-indicator">
          {derivedState === 'completed' || derivedState === 'skipped' ? (
            <IconV2 name="check" size="xs" />
          ) : derivedState === 'error' ? (
            <IconV2 name="xmark-circle" size="xs" />
          ) : isLoading ? (
            <IconV2 name="loader" size="xs" className="animate-spin" />
          ) : (
            <span>{stepNumber}</span>
          )}
        </span>
        <span className="cn-stepper-step-content">
          {typeof title === 'string' ? (
            <Tooltip content={title} delay={400}>
              <Text as="span" variant="body-strong" color="foreground-1" truncate className="cn-stepper-step-title">
                {title}
              </Text>
            </Tooltip>
          ) : (
            <Text as="span" variant="body-strong" color="foreground-1" truncate className="cn-stepper-step-title">
              {title}
            </Text>
          )}
          {description && (
            <Text as="span" variant="body-normal" color="foreground-3" className="cn-stepper-step-description">
              {description}
            </Text>
          )}
        </span>
      </button>

      {ctx.showConnectors && (
        <span className={cn('cn-stepper-connector', `cn-stepper-connector-${derivedState}`)} aria-hidden="true" />
      )}

      {showPlaceholder && !children && substepPlaceholder}

      {shouldRenderChildren && children && (
        <ol className="cn-stepper-substep-list">
          <ParentStepProvider value={value}>{children}</ParentStepProvider>
          {showPlaceholder && (
            <li className="cn-stepper-substep-item" aria-hidden="true">
              {substepPlaceholder}
            </li>
          )}
        </ol>
      )}
    </li>
  )
}
