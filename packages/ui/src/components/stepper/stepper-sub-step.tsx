import { useEffect, useRef, useState, type KeyboardEvent } from 'react'

import { IconV2 } from '@components/icon-v2'
import { Text } from '@components/text'
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'
import { cn } from '@utils/cn'

import { useParentStep, useStepperContext } from './stepper-context'
import { StepperSubStepProps, type StepState } from './stepper-types'

function isSubStepExpandedByDefault(state: StepState): boolean {
  return state === 'active' || state === 'error'
}

export function StepperSubStep({
  value,
  title,
  description,
  state: explicitState,
  visualCompleted = false,
  contentOnly = false,
  className,
  children
}: StepperSubStepProps) {
  const parentValue = useParentStep()
  const ctx = useStepperContext()

  // Always register substep so the progress counter can resolve substep → parent step
  useEffect(() => {
    const cleanup = ctx.registerSubStep(parentValue, value)
    return cleanup
  }, [parentValue, value]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!explicitState) return
    return ctx.registerSubStepState(parentValue, value, explicitState)
  }, [parentValue, value, explicitState]) // eslint-disable-line react-hooks/exhaustive-deps

  const derivedState = explicitState ?? ctx.getSubStepState(parentValue, value)
  // Display-only override: visualCompleted renders as finished regardless of the real
  // derivedState. Accordion-open behavior below (isSubStepExpandedByDefault, and the sync
  // effect) intentionally keeps reading derivedState, not this — that's what fixes the
  // accordion-collapse bug for a visualCompleted substep that is genuinely still active.
  const displayState = visualCompleted ? 'completed' : derivedState
  const isActive = derivedState === 'active'
  const isCollapsible = ctx.collapsibleSubSteps && Boolean(children)

  const [expanded, setExpanded] = useState(() => isSubStepExpandedByDefault(derivedState))
  const prevDerivedStateRef = useRef(derivedState)

  useEffect(() => {
    if (prevDerivedStateRef.current === derivedState) return
    prevDerivedStateRef.current = derivedState

    if (derivedState === 'active' || derivedState === 'error') {
      setExpanded(true)
    } else if (derivedState === 'completed' || derivedState === 'skipped') {
      setExpanded(false)
    }
  }, [derivedState])

  // Ordinal is handled via CSS counter (cn-stepper-substep-list increments)

  const stateClass = `cn-stepper-substep-${displayState}`

  const handleClick = () => {
    ctx.selectSubStep(value)
    if (isCollapsible) {
      setExpanded(true)
    }
  }

  const handleSubStepKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    handleClick()
  }

  const handleCollapseTriggerKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    event.currentTarget.click()
  }

  // Title color mirrors the icon/stateClass split above: once visualCompleted overrides the
  // display to 'completed', the title must not stay brand/blue while the icon shows green — it
  // should render like any other completed substep's title. A genuinely active, non-overridden
  // substep is unaffected.
  const titleContent = (
    <Text
      as="span"
      variant="body-strong"
      color={isActive && displayState !== 'completed' ? 'brand' : 'foreground-1'}
      truncate
      className="cn-stepper-substep-title"
    >
      {title}
    </Text>
  )

  const substepRowClassName = cn(
    'cn-stepper-substep',
    stateClass,
    isCollapsible && 'cn-stepper-substep-with-collapse',
    className
  )
  const substepRowLabel = typeof title === 'string' ? title : value

  const substepRowContent = (
    <>
      <span className="cn-stepper-substep-branch" aria-hidden="true" />
      <span className="cn-stepper-substep-indicator">
        {displayState === 'completed' ? (
          <IconV2 name="check" size="xs" color="success" />
        ) : displayState === 'skipped' ? (
          <IconV2 name="arrow-right" size="xs" color="neutral" />
        ) : displayState === 'error' ? (
          <IconV2 name="xmark" size="xs" color="danger" />
        ) : displayState === 'active' ? (
          <span className="cn-stepper-substep-dot" />
        ) : (
          <span className="cn-stepper-substep-ordinal" />
        )}
      </span>
      <span className="cn-stepper-substep-content">
        {titleContent}
        {description && (
          <Text as="span" variant="body-normal" color="foreground-3" className="cn-stepper-substep-description">
            {description}
          </Text>
        )}
      </span>
    </>
  )

  // Collapsible rows use div/span role=button so the chevron trigger never nests a <button>
  // inside the substep row — invalid HTML that breaks clicks and triggers validateDOMNesting.
  const substepRow = isCollapsible ? (
    <div
      role="button"
      className={substepRowClassName}
      onClick={handleClick}
      onKeyDown={handleSubStepKeyDown}
      aria-current={isActive ? 'step' : undefined}
      aria-label={substepRowLabel}
      tabIndex={isActive ? 0 : -1}
    >
      {substepRowContent}
    </div>
  ) : (
    <button
      type="button"
      className={substepRowClassName}
      onClick={handleClick}
      aria-current={isActive ? 'step' : undefined}
      aria-label={substepRowLabel}
      tabIndex={isActive ? 0 : -1}
    >
      {substepRowContent}
    </button>
  )

  if (contentOnly) {
    return (
      <li className={cn('cn-stepper-substep-item', stateClass, 'cn-stepper-substep-content-only')}>
        <span className="cn-stepper-substep-branch" aria-hidden="true" />
        {children && <div className="cn-stepper-substep-panel">{children}</div>}
      </li>
    )
  }

  if (!isCollapsible) {
    return (
      <li className={cn('cn-stepper-substep-item', stateClass)}>
        {substepRow}
        {children && <div className="cn-stepper-substep-panel">{children}</div>}
      </li>
    )
  }

  return (
    <CollapsiblePrimitive.Root open={expanded} onOpenChange={setExpanded} asChild>
      <li className={cn('cn-stepper-substep-item', stateClass, 'cn-stepper-substep-item-collapsible')}>
        <div className="cn-stepper-substep-header">
          {substepRow}
          <CollapsiblePrimitive.Trigger asChild>
            <span
              role="button"
              tabIndex={0}
              className="cn-stepper-substep-collapse-trigger"
              aria-label={expanded ? 'Collapse step content' : 'Expand step content'}
              aria-expanded={expanded}
              onKeyDown={handleCollapseTriggerKeyDown}
            >
              <IconV2
                name="nav-arrow-down"
                size="xs"
                className={cn('cn-stepper-substep-collapse-icon', expanded && 'cn-stepper-substep-collapse-icon-open')}
              />
            </span>
          </CollapsiblePrimitive.Trigger>
        </div>
        <CollapsiblePrimitive.Content
          className="cn-stepper-substep-panel-collapsible"
          // Keep card children mounted while collapsed so local state (e.g. streamed logs) survives
          // expand/collapse. Radix Presence unmounts content by default when closed.
          forceMount
        >
          <div className="cn-stepper-substep-panel">{children}</div>
        </CollapsiblePrimitive.Content>
      </li>
    </CollapsiblePrimitive.Root>
  )
}
