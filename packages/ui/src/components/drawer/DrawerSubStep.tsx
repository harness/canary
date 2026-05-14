import { ReactNode, useEffect } from 'react'

import { IconV2 } from '@/components'
import { cn } from '@/utils'

import { useDrawerDualPaneContext, useParentStepValue } from './drawer-dual-pane-context'

export type DrawerSubStepProps = {
  value: string
  title: ReactNode
}

export const DrawerSubStep = ({ value, title }: DrawerSubStepProps) => {
  const parentValue = useParentStepValue()
  const {
    value: activeValue,
    registerSubStep,
    getSubStepState,
    isSubStepNavigable,
    selectSubStep
  } = useDrawerDualPaneContext()

  if (parentValue === null) {
    throw new Error('Drawer.SubStep must be used inside a Drawer.Step')
  }

  const state = getSubStepState(parentValue, value)
  const navigable = isSubStepNavigable(parentValue, value)
  const isExactlyActive = activeValue === value

  useEffect(() => registerSubStep(parentValue, value), [registerSubStep, parentValue, value])

  const subStepClassName = cn('cn-drawer-dual-pane-substep', {
    'cn-drawer-dual-pane-substep-active': state === 'active',
    'cn-drawer-dual-pane-substep-completed': state === 'completed',
    'cn-drawer-dual-pane-substep-upcoming': state === 'upcoming'
  })

  const indicator = (
    <span className="cn-drawer-dual-pane-substep-indicator" aria-hidden="true">
      {state === 'completed' ? (
        <IconV2 className="cn-drawer-dual-pane-substep-indicator-icon" name="check" size="xs" skipSize />
      ) : state === 'active' ? (
        <span className="cn-drawer-dual-pane-substep-indicator-dot" />
      ) : (
        <IconV2 className="cn-drawer-dual-pane-substep-indicator-icon" name="minus" size="xs" skipSize />
      )}
    </span>
  )

  const content = (
    <>
      {indicator}
      <span className="cn-drawer-dual-pane-substep-title">{title}</span>
    </>
  )

  return (
    <li className="cn-drawer-dual-pane-substep-item">
      {navigable ? (
        <button
          type="button"
          className={subStepClassName}
          aria-current={isExactlyActive ? 'step' : undefined}
          onClick={() => selectSubStep(value)}
        >
          {content}
        </button>
      ) : (
        <div className={subStepClassName} aria-disabled="true">
          {content}
        </div>
      )}
    </li>
  )
}
DrawerSubStep.displayName = 'DrawerSubStep'
