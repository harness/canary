import { useEffect, useLayoutEffect, useRef, type CSSProperties } from 'react'

import { IconV2 } from '@components/icon-v2'
import { Text } from '@components/text'
import { Tooltip } from '@components/tooltip'
import { cn } from '@utils/cn'

import { ParentStepProvider, useStepperContext } from './stepper-context'
import { StepperStepProps } from './stepper-types'

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
    '.cn-stepper-substep-list > .cn-stepper-substep-item.cn-stepper-substep-completed .cn-stepper-substep-branch, ' +
      '.cn-stepper-substep-list > .cn-stepper-substep-item.cn-stepper-substep-skipped .cn-stepper-substep-branch'
  )

  const activeBranch = stepItem.querySelector(
    '.cn-stepper-substep-list > .cn-stepper-substep-item.cn-stepper-substep-active .cn-stepper-substep-branch'
  )

  const errorBranch = stepItem.querySelector(
    '.cn-stepper-substep-list > .cn-stepper-substep-item.cn-stepper-substep-error .cn-stepper-substep-branch'
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
      stepItem.querySelector('.cn-stepper-substep-list > .cn-stepper-substep-item .cn-stepper-substep-branch') ??
      stepItem.querySelector(
        ':scope > .cn-stepper-substep-placeholder .cn-stepper-substep-placeholder-branch, .cn-stepper-substep-list .cn-stepper-substep-placeholder-branch'
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
  // Row pitch = substep vertical padding + indicator row + padding (spacing-2 + size-5 + spacing-2).
  // --cn-stepper-step-content-overflow covers step description height below the indicator.
  // Subtract branch elbow offset so trunk color stops at the bend, not below the horizontal arm.
  return `calc(var(--cn-stepper-step-content-overflow, 0px) + var(--cn-spacing-3) + ${index} * (var(--cn-spacing-2) * 2 + var(--cn-size-5)) + var(--cn-spacing-2) + var(--cn-size-5) / 2 - (${BRANCH_ELBOW_RADIUS_PX} / ${BRANCH_MASK_VIEWBOX_HEIGHT}) * (var(--cn-size-5) / 2 + var(--cn-rounded-5)))`
}

type TrunkConnectorStyle = CSSProperties & {
  '--cn-stepper-trunk-green-end': string
  '--cn-stepper-trunk-blue-end': string
}

function calcTrunkConnectorStyle(lastCompletedSubStepIndex: number, accentSubStepIndex: number): TrunkConnectorStyle {
  return {
    '--cn-stepper-trunk-green-end':
      lastCompletedSubStepIndex >= 0 ? branchElbowOffset(lastCompletedSubStepIndex) : '0px',
    '--cn-stepper-trunk-blue-end': branchElbowOffset(Math.max(accentSubStepIndex, 0))
  }
}

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
  const stepItemRef = useRef<HTMLLIElement>(null)

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

  // Only color the step title blue when the step itself is the current position. When the active
  // position is one of its substeps, the substep title gets the blue instead (the parent stays neutral).
  const isStepTitleActive = isActive && ctx.value === value

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

  const subStepValues = ctx.subSteps.get(value) ?? []
  let lastCompletedSubStepIndex = -1
  let activeSubStepIndex = -1
  let errorSubStepIndex = -1

  for (let i = 0; i < subStepValues.length; i++) {
    const subState = ctx.getSubStepState(value, subStepValues[i])
    if (subState === 'completed' || subState === 'skipped') {
      lastCompletedSubStepIndex = i
    }
    if (subState === 'active') {
      activeSubStepIndex = i
    }
    if (subState === 'error') {
      errorSubStepIndex = i
    }
  }

  if (activeSubStepIndex < 0 && derivedState === 'active' && subStepValues.length > 0 && ctx.value === value) {
    activeSubStepIndex = 0
  }

  const hasSubStepsContent = subStepValues.length > 0 || Boolean(hasSubSteps && showPlaceholder)
  const hasActiveSubStepTrunk = derivedState === 'active' && hasSubStepsContent
  const hasErrorSubStepTrunk = derivedState === 'error' && errorSubStepIndex >= 0 && hasSubStepsContent
  const hasSubStepTrunk = hasActiveSubStepTrunk || hasErrorSubStepTrunk

  const accentSubStepIndex = derivedState === 'error' ? errorSubStepIndex : Math.max(activeSubStepIndex, 0)

  const trunkConnectorStyle = hasSubStepTrunk
    ? calcTrunkConnectorStyle(lastCompletedSubStepIndex, accentSubStepIndex)
    : undefined

  useLayoutEffect(() => {
    const stepItem = stepItemRef.current
    if (!stepItem || !hasSubStepTrunk) return

    const applyTrunkMeasurements = () => {
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

      const fallback = calcTrunkConnectorStyle(lastCompletedSubStepIndex, accentSubStepIndex)
      applyTrunkSegmentVars(stepItem, fallback['--cn-stepper-trunk-green-end'], fallback['--cn-stepper-trunk-blue-end'])
    }

    applyTrunkMeasurements()

    const resizeObserver = new ResizeObserver(applyTrunkMeasurements)
    resizeObserver.observe(stepItem)

    const stepButton = stepItem.querySelector('.cn-stepper-step')
    if (stepButton) resizeObserver.observe(stepButton)

    const substepList = stepItem.querySelector('.cn-stepper-substep-list')
    if (substepList) resizeObserver.observe(substepList)

    // Observe panels so trunk measurements update when card content changes height
    const panels = stepItem.querySelectorAll('.cn-stepper-substep-panel')
    panels.forEach(panel => resizeObserver.observe(panel))

    return () => resizeObserver.disconnect()
  }, [hasSubStepTrunk, subStepValues, lastCompletedSubStepIndex, accentSubStepIndex])

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
        aria-label={`Step ${stepNumber} of ${ctx.orderedSteps.length}: ${typeof title === 'string' ? title : value}`}
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
          {typeof title === 'string' ? (
            <Tooltip content={title} delay={400}>
              <Text
                as="span"
                variant="body-strong"
                color={isStepTitleActive ? 'brand' : 'foreground-1'}
                truncate
                className="cn-stepper-step-title"
              >
                {title}
              </Text>
            </Tooltip>
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
            hasSubStepTrunk
              ? derivedState === 'error'
                ? 'cn-stepper-connector-error-partial'
                : 'cn-stepper-connector-active-partial'
              : `cn-stepper-connector-${derivedState}`
          )}
          aria-hidden="true"
        />
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
