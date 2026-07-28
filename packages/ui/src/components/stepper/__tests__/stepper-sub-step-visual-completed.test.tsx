import React from 'react'

import { render, screen } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'

import { Stepper } from '../index'

vi.mock('@components/icon-v2', () => ({
  IconV2: ({ name, className }: { name: string; className?: string }) => (
    <span data-testid={`icon-${name}`} className={className}>
      {name}
    </span>
  ),
  IconV2DisplayName: 'IconV2',
  IconNameMapV2: {}
}))

vi.mock('@components/tooltip', () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  TooltipProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  withTooltip: (Component: React.ComponentType<any>) => Component
}))

describe('StepperSubStep visualCompleted', () => {
  test('renders completed icon/class when visualCompleted, even though state is active', () => {
    render(
      <Stepper.Root value="sub1" onValueChange={vi.fn()}>
        <Stepper.Step value="step1" title="Step 1">
          <Stepper.SubStep value="sub1" title="Sub 1" state="active" visualCompleted />
        </Stepper.Step>
      </Stepper.Root>
    )
    expect(screen.getByTestId('icon-check')).toBeInTheDocument()
    expect(document.querySelector('.cn-stepper-substep-completed')).toBeInTheDocument()
    // Title must not stay brand/blue once visualCompleted overrides display to 'completed' —
    // the whole row (icon + title) should read as uniformly finished.
    const title = document.querySelector('.cn-stepper-substep-title')
    expect(title).not.toHaveClass('text-cn-brand')
    expect(title).toHaveClass('text-cn-1')
  })

  test('accordion still defaults open for an active visualCompleted substep (real state wins)', () => {
    render(
      <Stepper.Root value="sub1" onValueChange={vi.fn()} collapsibleSubSteps>
        <Stepper.Step value="step1" title="Step 1">
          <Stepper.SubStep value="sub1" title="Sub 1" state="active" visualCompleted>
            <div data-testid="panel-content">Panel</div>
          </Stepper.SubStep>
        </Stepper.Step>
      </Stepper.Root>
    )
    // Collapsible substep panel content is kept mounted (forceMount) but visually expanded via
    // the Radix Collapsible's open state — assert via the expand trigger's aria-expanded.
    expect(screen.getByRole('button', { name: /collapse step content/i })).toHaveAttribute('aria-expanded', 'true')
  })

  test('without visualCompleted, active state renders the active dot (no regression)', () => {
    render(
      <Stepper.Root value="sub1" onValueChange={vi.fn()}>
        <Stepper.Step value="step1" title="Step 1">
          <Stepper.SubStep value="sub1" title="Sub 1" state="active" />
        </Stepper.Step>
      </Stepper.Root>
    )
    expect(document.querySelector('.cn-stepper-substep-dot')).toBeInTheDocument()
    expect(document.querySelector('.cn-stepper-substep-completed')).not.toBeInTheDocument()
    // Genuinely active (no visualCompleted override) still renders the brand/blue title — unchanged.
    const title = document.querySelector('.cn-stepper-substep-title')
    expect(title).toHaveClass('text-cn-brand')
  })
})
