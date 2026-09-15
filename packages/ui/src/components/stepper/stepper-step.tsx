import { useEffect, useRef, useState, type KeyboardEvent } from 'react'

import { IconV2 } from '@components/icon-v2'
import { Text } from '@components/text'
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'
import { cn } from '@utils/cn'

import { useParentStep, useStepperContext } from './stepper-context'
import { StepperStepProps, type StepState } from './stepper-types'

function isStepExpandedByDefault(state: StepState): boolean {
  return state === 'active' || state === 'error'
}

// Top-level Step: no ancestor StepGroup (ParentStepProvider). Registers/derives state exactly like
// StepGroup registers itself (ctx.orderedSteps via registerStep/registerStepMeta) and renders with
// StepGroup's own markup/classes (cn-stepper-step-item / cn-stepper-step / cn-stepper-connector) —
// this is what makes a flat list of ungrouped Steps look identical to a flat list of childless
// StepGroups, including getting the existing `.cn-stepper-step-item:last-child` connector-hiding
// rules "for free" with zero new CSS.
function TopLevelStep({
  value,
  title,
  description,
  state: explicitState,
  visualCompleted = false,
  disabled,
  showStepBadge,
  totalStepsOverride,
  headerActions,
  className,
  children
}: StepperStepProps) {
  const ctx = useStepperContext()

  useEffect(() => {
    const cleanup = ctx.registerStep(value)
    return cleanup
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    ctx.registerStepMeta(value, { disabled, state: explicitState, totalStepsOverride })
  }, [value, disabled, explicitState, totalStepsOverride]) // eslint-disable-line react-hooks/exhaustive-deps

  const derivedState = explicitState || ctx.getStepState(value)
  const stepDisabled = ctx.isStepDisabled(value)
  const stepIndex = ctx.orderedSteps.indexOf(value)
  const stepNumber = stepIndex + 1
  // ctx.orderedSteps only contains steps that have mounted so far under progressive disclosure —
  // totalStepsOverride lets a flat-mode consumer (e.g. SinglePaneStepperCardStack) supply the
  // flow's real nested-step count instead of that currently-registered count.
  const totalSteps = totalStepsOverride ?? ctx.orderedSteps.length

  // Presentation-only override, same convention as the nested Step below: renders as finished
  // regardless of the real derivedState.
  const displayState = visualCompleted ? 'completed' : derivedState
  const isActive = derivedState === 'active'
  const isCollapsible = ctx.collapsibleNestedSteps && Boolean(children)

  const [expanded, setExpanded] = useState(() => isStepExpandedByDefault(derivedState))
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

  const stateClass = `cn-stepper-step-${displayState}`

  const handleClick = () => {
    if (stepDisabled) return
    ctx.selectStep(value)
  }

  const handleCollapseTriggerKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    event.currentTarget.click()
  }

  // Same forward-navigation transition classes StepGroup applies — a top-level Step is registered
  // in the same ctx.orderedSteps list, so it participates in the shared transitioning state.
  const isTransitionSource = ctx.transitioning?.sourceIndex === stepIndex
  const isTransitionTarget = ctx.transitioning?.targetIndex === stepIndex

  const stepButton = (
    <button
      type="button"
      className={cn('cn-stepper-step', stateClass, className)}
      disabled={stepDisabled}
      onClick={handleClick}
      aria-current={isActive ? 'step' : undefined}
      aria-label={`Step ${stepNumber} of ${totalSteps}: ${typeof title === 'string' ? title : value}`}
      aria-disabled={stepDisabled ? 'true' : undefined}
      tabIndex={stepDisabled ? undefined : isActive ? 0 : -1}
    >
      <span className="cn-stepper-indicator">
        {displayState === 'completed' || displayState === 'skipped' ? (
          <IconV2 name="check" size="xs" color={displayState === 'completed' ? 'success' : 'neutral'} />
        ) : displayState === 'error' ? (
          <IconV2 name="xmark" size="xs" color="danger" />
        ) : (
          <span className="cn-stepper-indicator-number">{stepNumber}</span>
        )}
      </span>
      <span className="cn-stepper-step-content">
        {showStepBadge ? (
          <span className="cn-stepper-step-title-row">
            <Text as="span" variant="body-strong" color="foreground-1" truncate className="cn-stepper-step-title">
              {title}
            </Text>
            <span className="cn-stepper-step-badge">{`Step ${stepNumber}/${totalSteps}`}</span>
          </span>
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
  )

  const connector = ctx.showConnectors && (
    <span className={cn('cn-stepper-connector', `cn-stepper-connector-${derivedState}`)} aria-hidden="true" />
  )

  if (!isCollapsible) {
    return (
      <li
        className={cn('cn-stepper-step-item', {
          'cn-stepper-step-transitioning': isTransitionSource || isTransitionTarget,
          'cn-stepper-indicator-leaving': isTransitionSource,
          'cn-stepper-indicator-entering': isTransitionTarget
        })}
      >
        {stepButton}

        {connector}

        {/* No consumer currently passes children to a top-level Step (all real usages are flat, childless
            lists) and the rename spec doesn't define nested-step-under-a-flat-Step semantics — supporting
            arbitrary content here (rather than throwing it away) keeps the shared children prop meaningful
            without pulling in StepGroup's full trunk/branch machinery for an untested case. */}
        {children && <div className="cn-stepper-step-panel">{children}</div>}
      </li>
    )
  }

  return (
    <CollapsiblePrimitive.Root open={expanded} onOpenChange={setExpanded} asChild>
      <li
        className={cn('cn-stepper-step-item', {
          'cn-stepper-step-transitioning': isTransitionSource || isTransitionTarget,
          'cn-stepper-indicator-leaving': isTransitionSource,
          'cn-stepper-indicator-entering': isTransitionTarget
        })}
      >
        <div className="cn-stepper-step-header">
          {stepButton}
          {headerActions ? <span className="cn-stepper-header-actions">{headerActions}</span> : null}
          <CollapsiblePrimitive.Trigger asChild>
            <span
              role="button"
              tabIndex={0}
              className="cn-stepper-step-collapse-trigger"
              aria-label={expanded ? 'Collapse step content' : 'Expand step content'}
              aria-expanded={expanded}
              onKeyDown={handleCollapseTriggerKeyDown}
            >
              <IconV2
                name="nav-arrow-down"
                size="xs"
                className={cn('cn-stepper-step-collapse-icon', expanded && 'cn-stepper-step-collapse-icon-open')}
              />
            </span>
          </CollapsiblePrimitive.Trigger>
        </div>

        {connector}

        <CollapsiblePrimitive.Content
          className="cn-stepper-step-panel-collapsible"
          // Keep card children mounted while collapsed so local state (e.g. streamed logs) survives
          // expand/collapse. Radix Presence unmounts content by default when closed.
          forceMount
        >
          {children && <div className="cn-stepper-step-panel">{children}</div>}
        </CollapsiblePrimitive.Content>
      </li>
    </CollapsiblePrimitive.Root>
  )
}

// Nested Step: has an ancestor StepGroup (ParentStepProvider). Registers under the parent group
// (registerNestedStep/getNestedStepState) and renders the branch-arm connector off the parent's
// trunk.
function NestedStep({
  parentValue,
  value,
  title,
  description,
  state: explicitState,
  visualCompleted = false,
  contentOnly = false,
  headerActions,
  className,
  children
}: StepperStepProps & { parentValue: string }) {
  const ctx = useStepperContext()

  useEffect(() => {
    const cleanup = ctx.registerNestedStep(parentValue, value)
    return cleanup
  }, [parentValue, value]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!explicitState) return
    return ctx.registerNestedStepState(parentValue, value, explicitState)
  }, [parentValue, value, explicitState]) // eslint-disable-line react-hooks/exhaustive-deps

  const derivedState = explicitState ?? ctx.getNestedStepState(parentValue, value)
  const displayState = visualCompleted ? 'completed' : derivedState
  const isActive = derivedState === 'active'
  const isCollapsible = ctx.collapsibleNestedSteps && Boolean(children)

  const [expanded, setExpanded] = useState(() => isStepExpandedByDefault(derivedState))
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

  const stateClass = `cn-stepper-nested-step-${displayState}`

  const handleClick = () => {
    ctx.selectNestedStep(value)
    const isTerminal = derivedState === 'completed' || derivedState === 'skipped'
    if (isCollapsible && !isTerminal) {
      setExpanded(true)
    }
  }

  const handleStepKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    handleClick()
  }

  const handleCollapseTriggerKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    event.currentTarget.click()
  }

  const titleContent = (
    <Text
      as="span"
      variant="body-strong"
      color={isActive && displayState !== 'completed' ? 'brand' : 'foreground-1'}
      truncate
      className="cn-stepper-nested-step-title"
    >
      {title}
    </Text>
  )

  const nestedStepRowClassName = cn(
    'cn-stepper-nested-step',
    stateClass,
    isCollapsible && 'cn-stepper-nested-step-with-collapse',
    className
  )
  const nestedStepRowLabel = typeof title === 'string' ? title : value

  const nestedStepRowContent = (
    <>
      <span className="cn-stepper-nested-step-branch" aria-hidden="true" />
      <span className="cn-stepper-nested-step-indicator">
        {displayState === 'completed' ? (
          <IconV2 name="check" size="xs" color="success" />
        ) : displayState === 'skipped' ? (
          <IconV2 name="arrow-right" size="xs" color="neutral" />
        ) : displayState === 'error' ? (
          <IconV2 name="xmark" size="xs" color="danger" />
        ) : displayState === 'active' ? (
          <span className="cn-stepper-nested-step-dot" />
        ) : (
          <span className="cn-stepper-nested-step-ordinal" />
        )}
      </span>
      <span className="cn-stepper-nested-step-content">
        {titleContent}
        {description && (
          <Text as="span" variant="body-normal" color="foreground-3" className="cn-stepper-nested-step-description">
            {description}
          </Text>
        )}
      </span>
    </>
  )

  // Collapsible rows use div/span role=button so the chevron trigger never nests a <button>
  // inside the nested-step row — invalid HTML that breaks clicks and triggers validateDOMNesting.
  const nestedStepRow = isCollapsible ? (
    <div
      role="button"
      className={nestedStepRowClassName}
      onClick={handleClick}
      onKeyDown={handleStepKeyDown}
      aria-current={isActive ? 'step' : undefined}
      aria-label={nestedStepRowLabel}
      tabIndex={isActive ? 0 : -1}
    >
      {nestedStepRowContent}
    </div>
  ) : (
    <button
      type="button"
      className={nestedStepRowClassName}
      onClick={handleClick}
      aria-current={isActive ? 'step' : undefined}
      aria-label={nestedStepRowLabel}
      tabIndex={isActive ? 0 : -1}
    >
      {nestedStepRowContent}
    </button>
  )

  if (contentOnly) {
    return (
      <li className={cn('cn-stepper-nested-step-item', stateClass, 'cn-stepper-nested-step-content-only')}>
        <span className="cn-stepper-nested-step-branch" aria-hidden="true" />
        {children && <div className="cn-stepper-nested-step-panel">{children}</div>}
      </li>
    )
  }

  if (!isCollapsible) {
    return (
      <li className={cn('cn-stepper-nested-step-item', stateClass)}>
        {nestedStepRow}
        {children && <div className="cn-stepper-nested-step-panel">{children}</div>}
      </li>
    )
  }

  return (
    <CollapsiblePrimitive.Root open={expanded} onOpenChange={setExpanded} asChild>
      <li className={cn('cn-stepper-nested-step-item', stateClass, 'cn-stepper-nested-step-item-collapsible')}>
        <div className="cn-stepper-nested-step-header">
          {nestedStepRow}
          {headerActions ? <span className="cn-stepper-header-actions">{headerActions}</span> : null}
          <CollapsiblePrimitive.Trigger asChild>
            <span
              role="button"
              tabIndex={0}
              className="cn-stepper-nested-step-collapse-trigger"
              aria-label={expanded ? 'Collapse step content' : 'Expand step content'}
              aria-expanded={expanded}
              onKeyDown={handleCollapseTriggerKeyDown}
            >
              <IconV2
                name="nav-arrow-down"
                size="xs"
                className={cn(
                  'cn-stepper-nested-step-collapse-icon',
                  expanded && 'cn-stepper-nested-step-collapse-icon-open'
                )}
              />
            </span>
          </CollapsiblePrimitive.Trigger>
        </div>
        <CollapsiblePrimitive.Content
          className="cn-stepper-nested-step-panel-collapsible"
          // Keep card children mounted while collapsed so local state (e.g. streamed logs) survives
          // expand/collapse. Radix Presence unmounts content by default when closed.
          forceMount
        >
          <div className="cn-stepper-nested-step-panel">{children}</div>
        </CollapsiblePrimitive.Content>
      </li>
    </CollapsiblePrimitive.Root>
  )
}

// Dual-mode dispatch. `useParentStep()` returns null when there's no ancestor StepGroup — a normal,
// expected configuration (not an error) — so a Step rendered directly under Stepper.Root renders as
// TopLevelStep, and a Step nested inside a Stepper.StepGroup renders as NestedStep. Branching here
// (before any other hooks run) rather than inside a single component body keeps each render path's
// hook calls unconditional within their own function, per the rules of hooks.
export function StepperStep(props: StepperStepProps) {
  const parentValue = useParentStep()

  if (parentValue === null) {
    return <TopLevelStep {...props} />
  }

  return <NestedStep {...props} parentValue={parentValue} />
}
