import { useEffect, useLayoutEffect, useRef, type CSSProperties } from 'react'

import { IconV2 } from '@components/icon-v2'
import { Text } from '@components/text'
import { cn } from '@utils/cn'

import { ParentStepProvider, useStepperContext } from './stepper-context'
import { StepperGroupProps } from './stepper-types'

// Branch wire ::before box height = size-5/2 + rounded-5; elbow radius = rounded-5 (12px, same as
// DualPaneStepper step cards). Keep in sync with stepper.ts BRANCH_ELBOW_RADIUS.
const BRANCH_ELBOW_RADIUS_PX = 12
const BRANCH_MASK_VIEWBOX_HEIGHT = 22
const BRANCH_MASK_ELBOW_Y = BRANCH_MASK_VIEWBOX_HEIGHT - BRANCH_ELBOW_RADIUS_PX
const TRUNK_SEGMENT_OVERLAP_PX = 1

function getBranchWireElbowY(branchEl: Element, connectorTop: number): number {
  const rect = branchEl.getBoundingClientRect()
  const branchCenterY = rect.top + rect.height / 2

  const styleSource = branchEl instanceof HTMLElement ? branchEl : document.documentElement
  const styles = getComputedStyle(styleSource)
  const size5 = parseFloat(styles.getPropertyValue('--cn-size-5'))
  const rounded5 = parseFloat(styles.getPropertyValue('--cn-rounded-5'))

  if (!Number.isFinite(size5) || !Number.isFinite(rounded5)) {
    return branchCenterY - connectorTop
  }

  const maskHeight = size5 / 2 + rounded5
  const elbowOffsetAboveCenter =
    ((BRANCH_MASK_VIEWBOX_HEIGHT - BRANCH_MASK_ELBOW_Y) / BRANCH_MASK_VIEWBOX_HEIGHT) * maskHeight

  return branchCenterY - elbowOffsetAboveCenter - connectorTop
}

function measureStepContentOverflow(stepItem: HTMLElement): number {
  const stepButton = stepItem.querySelector('.cn-stepper-step')
  const indicator = stepItem.querySelector('.cn-stepper-indicator')
  if (!stepButton || !indicator) return 0
  return Math.max(0, stepButton.getBoundingClientRect().height - indicator.getBoundingClientRect().height)
}

function measureTrunkSegmentEnds(stepItem: HTMLElement): { greenEnd: number; accentEnd: number } | null {
  const connector = stepItem.querySelector('.cn-stepper-connector')
  if (!connector) return null

  const connectorTop = connector.getBoundingClientRect().top

  // Use rendered state classes so explicit `state` props (e.g. DualPaneStepper) match trunk colors.
  const completedBranches = stepItem.querySelectorAll(
    '.cn-stepper-nested-step-list > .cn-stepper-nested-step-item.cn-stepper-nested-step-completed .cn-stepper-nested-step-branch, ' +
      '.cn-stepper-nested-step-list > .cn-stepper-nested-step-item.cn-stepper-nested-step-skipped .cn-stepper-nested-step-branch'
  )

  const activeBranch = stepItem.querySelector(
    '.cn-stepper-nested-step-list > .cn-stepper-nested-step-item.cn-stepper-nested-step-active .cn-stepper-nested-step-branch'
  )

  const errorBranch = stepItem.querySelector(
    '.cn-stepper-nested-step-list > .cn-stepper-nested-step-item.cn-stepper-nested-step-error .cn-stepper-nested-step-branch'
  )

  let greenEnd = 0
  if (completedBranches.length > 0) {
    greenEnd = getBranchWireElbowY(completedBranches[completedBranches.length - 1], connectorTop)
  }

  let accentEnd: number | null = null
  if (activeBranch) {
    accentEnd = getBranchWireElbowY(activeBranch, connectorTop)
  } else if (errorBranch) {
    accentEnd = getBranchWireElbowY(errorBranch, connectorTop)
  } else {
    const fallbackBranch =
      stepItem.querySelector(
        '.cn-stepper-nested-step-list > .cn-stepper-nested-step-item .cn-stepper-nested-step-branch'
      ) ??
      stepItem.querySelector(
        ':scope > .cn-stepper-nested-step-placeholder .cn-stepper-nested-step-placeholder-branch, .cn-stepper-nested-step-list .cn-stepper-nested-step-placeholder-branch'
      )
    if (fallbackBranch) {
      accentEnd = getBranchWireElbowY(fallbackBranch, connectorTop)
    }
  }

  if (accentEnd == null || accentEnd <= 0) {
    return null
  }

  return { greenEnd, accentEnd }
}

// For a completed last step, cap the connector's height at the last completed branch elbow so the
// trunk ends at the final nested-step indicator instead of running into the embedded card panel
// below it. Returns the height in px, or null if it can't be measured.
function measureCompletedTrunkEnd(stepItem: HTMLElement): number | null {
  const connector = stepItem.querySelector('.cn-stepper-connector')
  if (!connector) return null
  const connectorTop = connector.getBoundingClientRect().top
  const branches = stepItem.querySelectorAll(
    '.cn-stepper-nested-step-list > .cn-stepper-nested-step-item .cn-stepper-nested-step-branch'
  )
  const lastBranch = branches[branches.length - 1]
  if (!lastBranch) return null
  const end = getBranchWireElbowY(lastBranch, connectorTop)
  return end > 0 ? end : null
}

function applyTrunkSegmentVars(stepItem: HTMLElement, greenEnd: string, blueEnd: string) {
  stepItem.style.setProperty('--cn-stepper-trunk-green-end', greenEnd)
  stepItem.style.setProperty('--cn-stepper-trunk-blue-end', blueEnd)

  const connector = stepItem.querySelector('.cn-stepper-connector')
  if (connector instanceof HTMLElement) {
    connector.style.setProperty('--cn-stepper-trunk-green-end', greenEnd)
    connector.style.setProperty('--cn-stepper-trunk-blue-end', blueEnd)
  }
}

function branchElbowOffset(index: number) {
  // Row pitch = nested-step vertical padding + indicator row + padding (spacing-2 + size-5 + spacing-2).
  // --cn-stepper-step-content-overflow covers step description height below the indicator.
  // Subtract branch elbow offset so trunk color stops at the bend, not below the horizontal arm.
  return `calc(var(--cn-stepper-step-content-overflow, 0px) + var(--cn-spacing-3) + ${index} * (var(--cn-spacing-2) * 2 + var(--cn-size-5)) + var(--cn-spacing-2) + var(--cn-size-5) / 2 - (${BRANCH_ELBOW_RADIUS_PX} / ${BRANCH_MASK_VIEWBOX_HEIGHT}) * (var(--cn-size-5) / 2 + var(--cn-rounded-5)))`
}

type TrunkConnectorStyle = CSSProperties & {
  '--cn-stepper-trunk-green-end': string
  '--cn-stepper-trunk-blue-end': string
}

function calcTrunkConnectorStyle(
  lastCompletedNestedStepIndex: number,
  accentNestedStepIndex: number
): TrunkConnectorStyle {
  return {
    '--cn-stepper-trunk-green-end':
      lastCompletedNestedStepIndex >= 0 ? branchElbowOffset(lastCompletedNestedStepIndex) : '0px',
    '--cn-stepper-trunk-blue-end': branchElbowOffset(Math.max(accentNestedStepIndex, 0))
  }
}

export function StepperGroup({
  value,
  title,
  description,
  state,
  loading,
  blocking,
  hasNestedSteps,
  disabled,
  showStepBadge,
  totalStepsOverride,
  stepNumberOverride,
  className,
  children
}: StepperGroupProps) {
  const ctx = useStepperContext()
  const stepItemRef = useRef<HTMLLIElement>(null)

  // Register step on mount
  useEffect(() => {
    const cleanup = ctx.registerStep(value)
    return cleanup
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  // Register metadata
  useEffect(() => {
    ctx.registerStepMeta(value, { disabled, blocking, state, loading, totalStepsOverride })
  }, [value, disabled, blocking, state, loading, totalStepsOverride]) // eslint-disable-line react-hooks/exhaustive-deps

  const derivedState = state || ctx.getStepState(value)
  const stepDisabled = ctx.isStepDisabled(value)
  const stepIndex = ctx.orderedSteps.indexOf(value)
  // Only apply the override when the badge is actually shown — otherwise a consumer that never
  // opts into showStepBadge would silently get different indicator-circle numbers/aria-labels than
  // before this override existed, breaking this component's own "opt-in, no rendering change"
  // contract for showStepBadge.
  const stepNumber = showStepBadge ? (stepNumberOverride ?? stepIndex + 1) : stepIndex + 1
  // ctx.orderedSteps only contains groups that have mounted so far under progressive disclosure —
  // totalStepsOverride lets a non-flat-mode consumer (e.g. SinglePaneStepperCardStack) supply the
  // flow's real step-group count instead of that currently-registered count (mirrors
  // StepperStepProps.totalStepsOverride in stepper-step.tsx).
  const totalSteps = totalStepsOverride ?? ctx.orderedSteps.length

  const isActive = derivedState === 'active'
  const isLoading = isActive && loading

  // Only color the step title blue when the step itself is the current position. When the active
  // position is one of its nested steps, the nested step's title gets the blue instead (the parent
  // stays neutral).
  const isStepTitleActive = isActive && ctx.value === value

  // Render children if active, completed, OR if the current value is unresolved (not known as any
  // registered step or nested step). This allows nested steps to register on the first render
  // when the root value is a nested-step value that hasn't been registered yet.
  // Completed steps also render children so that visited nested steps remain visible.
  const isValueUnresolved =
    ctx.orderedSteps.indexOf(ctx.value) < 0 &&
    !Array.from(ctx.nestedSteps.values()).some(subs => subs.includes(ctx.value))
  const shouldRenderChildren = isActive || derivedState === 'completed' || derivedState === 'error' || isValueUnresolved

  const stateClass = `cn-stepper-step-${derivedState}`
  const loadingClass = isLoading ? 'cn-stepper-step-loading' : ''

  const handleClick = () => {
    if (stepDisabled) return
    ctx.selectStep(value)
  }

  const isTransitionSource = ctx.transitioning?.sourceIndex === stepIndex
  const isTransitionTarget = ctx.transitioning?.targetIndex === stepIndex

  const showPlaceholder =
    hasNestedSteps && derivedState !== 'completed' && !(ctx.collapsibleNestedSteps && derivedState === 'active')

  const nestedStepValues = ctx.nestedSteps.get(value) ?? []
  let lastCompletedNestedStepIndex = -1
  let activeNestedStepIndex = -1
  let errorNestedStepIndex = -1

  for (let i = 0; i < nestedStepValues.length; i++) {
    const subState = ctx.getNestedStepState(value, nestedStepValues[i])
    if (subState === 'completed' || subState === 'skipped') {
      lastCompletedNestedStepIndex = i
    }
    if (subState === 'active') {
      activeNestedStepIndex = i
    }
    if (subState === 'error') {
      errorNestedStepIndex = i
    }
  }

  if (activeNestedStepIndex < 0 && derivedState === 'active' && nestedStepValues.length > 0 && ctx.value === value) {
    activeNestedStepIndex = 0
  }

  const hasNestedStepsContent = nestedStepValues.length > 0 || Boolean(hasNestedSteps && showPlaceholder)
  const hasActiveNestedStepTrunk = derivedState === 'active' && hasNestedStepsContent
  const hasErrorNestedStepTrunk = derivedState === 'error' && errorNestedStepIndex >= 0 && hasNestedStepsContent
  const hasNestedStepTrunk = hasActiveNestedStepTrunk || hasErrorNestedStepTrunk

  // A step whose nested steps embed content (SinglePaneStepper renders each card inside its nested
  // step row) grows tall to fit that content. The connector's CSS `bottom` is relative to the
  // step-item, so on the LAST such step the trunk would run down past the last nested-step
  // indicator into the embedded panel's height (visible overhang). When this is the last step and
  // the flow has SETTLED on it (no further nested step to advance to), we measure the last branch
  // elbow and cap the connector height there, so the trunk ends at the final indicator regardless
  // of panel height. Dual-pane nested steps have no panel, so their offset already lands at the
  // indicator and this is a no-op for them.
  //
  // Two settled cases: a fully completed last step, and a TERMINAL ERROR — the last nested step
  // errored with nothing active/predicted after it (a recoverable error, by contrast, keeps an
  // error-partial trunk running toward its predicted next, so it must NOT be capped).
  const isLastStep = stepIndex === ctx.orderedSteps.length - 1
  const isTerminalError =
    derivedState === 'error' && errorNestedStepIndex === nestedStepValues.length - 1 && activeNestedStepIndex < 0
  const capSettledTrunk = isLastStep && nestedStepValues.length > 0 && (derivedState === 'completed' || isTerminalError)

  const accentNestedStepIndex = derivedState === 'error' ? errorNestedStepIndex : Math.max(activeNestedStepIndex, 0)

  // When we cap the trunk (settled last step), the cap is authoritative — don't also apply the
  // partial-trunk color vars, which assume a continuing trunk toward an active/predicted next.
  const trunkConnectorStyle =
    hasNestedStepTrunk && !capSettledTrunk
      ? calcTrunkConnectorStyle(lastCompletedNestedStepIndex, accentNestedStepIndex)
      : undefined

  useLayoutEffect(() => {
    const stepItem = stepItemRef.current
    if (!stepItem || (!hasNestedStepTrunk && !capSettledTrunk)) return

    const applyTrunkMeasurements = () => {
      // Settled last step (completed or terminal error): cap the connector height at the last branch
      // elbow so the trunk ends at the final indicator (see capSettledTrunk).
      if (capSettledTrunk) {
        const contentOverflow = measureStepContentOverflow(stepItem)
        stepItem.style.setProperty('--cn-stepper-step-content-overflow', `${contentOverflow}px`)
        const end = measureCompletedTrunkEnd(stepItem)
        const connector = stepItem.querySelector('.cn-stepper-connector')
        if (connector instanceof HTMLElement) {
          if (end != null) {
            connector.style.height = `${end}px`
            connector.style.bottom = 'auto'
          } else {
            connector.style.removeProperty('height')
            connector.style.removeProperty('bottom')
          }
        }
        return
      }

      const contentOverflow = measureStepContentOverflow(stepItem)
      stepItem.style.setProperty('--cn-stepper-step-content-overflow', `${contentOverflow}px`)

      const measured = measureTrunkSegmentEnds(stepItem)

      if (measured) {
        // Overlap green into accent at the junction only; accent stops at the branch elbow (no bleed past bend).
        const greenEndPx = measured.greenEnd > 0 ? measured.greenEnd + TRUNK_SEGMENT_OVERLAP_PX : 0
        const accentEndPx = measured.accentEnd
        applyTrunkSegmentVars(stepItem, `${greenEndPx}px`, `${accentEndPx}px`)
        return
      }

      const fallback = calcTrunkConnectorStyle(lastCompletedNestedStepIndex, accentNestedStepIndex)
      applyTrunkSegmentVars(stepItem, fallback['--cn-stepper-trunk-green-end'], fallback['--cn-stepper-trunk-blue-end'])
    }

    applyTrunkMeasurements()

    const resizeObserver = new ResizeObserver(applyTrunkMeasurements)
    resizeObserver.observe(stepItem)

    const stepButton = stepItem.querySelector('.cn-stepper-step')
    if (stepButton) resizeObserver.observe(stepButton)

    const nestedStepList = stepItem.querySelector('.cn-stepper-nested-step-list')
    if (nestedStepList) resizeObserver.observe(nestedStepList)

    // Observe panels so trunk measurements update when card content changes height
    const panels = stepItem.querySelectorAll('.cn-stepper-nested-step-panel')
    panels.forEach(panel => resizeObserver.observe(panel))

    return () => {
      resizeObserver.disconnect()
      // Clear the inline height/bottom cap so a step leaving the completed-last-step case (e.g. a
      // reactivation that adds steps below) reverts to the default CSS-driven connector length.
      const connector = stepItem.querySelector('.cn-stepper-connector')
      if (connector instanceof HTMLElement) {
        connector.style.removeProperty('height')
        connector.style.removeProperty('bottom')
      }
    }
  }, [hasNestedStepTrunk, capSettledTrunk, nestedStepValues, lastCompletedNestedStepIndex, accentNestedStepIndex])

  const nestedStepPlaceholder = (
    <span className="cn-stepper-nested-step-placeholder" aria-hidden="true">
      <span className="cn-stepper-nested-step-placeholder-branch" />
      <span className="cn-stepper-nested-step-placeholder-indicator">
        <IconV2 name="more-horizontal" size="xs" />
      </span>
      <span className="cn-stepper-nested-step-placeholder-spacer">
        <span className="cn-stepper-nested-step-title" style={{ visibility: 'hidden' }}>
          &nbsp;
        </span>
        <span className="cn-stepper-nested-step-description" style={{ visibility: 'hidden' }}>
          &nbsp;
        </span>
      </span>
    </span>
  )

  return (
    <li
      ref={stepItemRef}
      className={cn('cn-stepper-step-item', {
        'cn-stepper-step-transitioning': isTransitionSource || isTransitionTarget,
        'cn-stepper-indicator-leaving': isTransitionSource,
        'cn-stepper-indicator-entering': isTransitionTarget
      })}
      style={trunkConnectorStyle}
    >
      <button
        type="button"
        className={cn('cn-stepper-step', stateClass, loadingClass, className)}
        disabled={stepDisabled}
        onClick={handleClick}
        aria-current={isActive ? 'step' : undefined}
        aria-label={`Step ${stepNumber} of ${totalSteps}: ${typeof title === 'string' ? title : value}`}
        aria-disabled={stepDisabled ? 'true' : undefined}
        tabIndex={stepDisabled ? undefined : isActive ? 0 : -1}
      >
        <span className="cn-stepper-indicator">
          {derivedState === 'completed' || derivedState === 'skipped' ? (
            <IconV2 name="check" size="xs" color={derivedState === 'completed' ? 'success' : 'neutral'} />
          ) : derivedState === 'error' ? (
            <IconV2 name="xmark" size="xs" color="danger" />
          ) : isLoading ? (
            <IconV2 name="loader" size="xs" className="animate-spin" />
          ) : (
            <span className="cn-stepper-indicator-number">{stepNumber}</span>
          )}
        </span>
        <span className="cn-stepper-step-content">
          {showStepBadge ? (
            // Grid auto-placement (see .cn-stepper-step gridTemplateColumns) puts each direct child
            // of this display:contents wrapper in its own cell — a plain sibling badge would land in
            // the NEXT row, not beside the title. Wrapping title + badge in a flex row keeps them as
            // a single grid item (same cell the title alone occupied) so they render side by side.
            // Only introduced when the prop is on, so default markup is byte-for-byte unchanged.
            <span className="cn-stepper-step-title-row">
              <Text
                as="span"
                variant="body-strong"
                color={isStepTitleActive ? 'brand' : 'foreground-1'}
                truncate
                className="cn-stepper-step-title"
              >
                {title}
              </Text>
              <span className="cn-stepper-step-badge">{`Step ${stepNumber}/${totalSteps}`}</span>
            </span>
          ) : (
            <Text
              as="span"
              variant="body-strong"
              color={isStepTitleActive ? 'brand' : 'foreground-1'}
              truncate
              className="cn-stepper-step-title"
            >
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
        <span
          className={cn(
            'cn-stepper-connector',
            hasNestedStepTrunk
              ? derivedState === 'error'
                ? 'cn-stepper-connector-error-partial'
                : 'cn-stepper-connector-active-partial'
              : `cn-stepper-connector-${derivedState}`
          )}
          aria-hidden="true"
        />
      )}

      {showPlaceholder && !children && nestedStepPlaceholder}

      {shouldRenderChildren && children && (
        <ol className="cn-stepper-nested-step-list">
          <ParentStepProvider value={value}>{children}</ParentStepProvider>
          {showPlaceholder && (
            <li className="cn-stepper-nested-step-item" aria-hidden="true">
              {nestedStepPlaceholder}
            </li>
          )}
        </ol>
      )}
    </li>
  )
}
