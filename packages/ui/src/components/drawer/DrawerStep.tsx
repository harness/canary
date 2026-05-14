import { ReactNode, useEffect } from 'react'

import { IconV2 } from '@/components'
import { cn } from '@/utils'

import { ParentStepProvider, useDrawerDualPaneContext } from './drawer-dual-pane-context'

export type DrawerStepProps = {
  value: string
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
}

export const DrawerStep = ({ value, title, description, children }: DrawerStepProps) => {
  const {
    value: activeValue,
    registerStep,
    getStepState,
    getStepIndex,
    isStepNavigable,
    selectStep
  } = useDrawerDualPaneContext()
  const state = getStepState(value)
  const navigable = isStepNavigable(value)
  const index = getStepIndex(value)
  const stepNumber = index >= 0 ? index + 1 : null
  const isExactlyActive = activeValue === value
  const hasSubsteps = children !== undefined && children !== null && children !== false

  useEffect(() => registerStep(value), [registerStep, value])

  const stepClassName = cn('cn-drawer-dual-pane-step', {
    'cn-drawer-dual-pane-step-active': state === 'active',
    'cn-drawer-dual-pane-step-completed': state === 'completed',
    'cn-drawer-dual-pane-step-upcoming': state === 'upcoming'
  })

  const indicator = (
    <span className="cn-drawer-dual-pane-step-indicator" aria-hidden="true">
      {state === 'completed' ? (
        <IconV2 className="cn-drawer-dual-pane-step-indicator-icon" name="check" size="xs" skipSize />
      ) : (
        <span className="cn-drawer-dual-pane-step-indicator-number">{stepNumber}</span>
      )}
    </span>
  )

  const content = (
    <>
      {indicator}
      <span className="cn-drawer-dual-pane-step-content">
        <span className="cn-drawer-dual-pane-step-title">{title}</span>
        {description ? <span className="cn-drawer-dual-pane-step-description">{description}</span> : null}
      </span>
    </>
  )

  return (
    <li className="cn-drawer-dual-pane-step-item">
      {navigable ? (
        <button
          type="button"
          className={stepClassName}
          aria-current={isExactlyActive ? 'step' : undefined}
          onClick={() => selectStep(value)}
        >
          {content}
        </button>
      ) : (
        <div className={stepClassName} aria-disabled="true">
          {content}
        </div>
      )}
      {hasSubsteps ? (
        <ParentStepProvider value={value}>
          <ol className="cn-drawer-dual-pane-substeps-list" data-state={state === 'active' ? 'expanded' : 'collapsed'}>
            {children}
          </ol>
        </ParentStepProvider>
      ) : null}
    </li>
  )
}
DrawerStep.displayName = 'DrawerStep'
