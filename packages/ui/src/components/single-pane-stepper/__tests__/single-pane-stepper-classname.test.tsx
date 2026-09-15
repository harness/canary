import React from 'react'

import { render } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'

import type { FlowConfig } from '../../flow-stepper/engine'
import { SinglePaneStepper } from '../index'

vi.mock('@components/icon-v2', () => ({
  IconV2: ({ name }: { name: string }) => <span data-testid={`icon-${name}`}>{name}</span>,
  IconV2DisplayName: 'IconV2',
  IconNameMapV2: {}
}))

vi.mock('@components/tooltip', () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  TooltipProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  withTooltip: (Component: React.ComponentType<any>) => Component
}))

function EmptyCard() {
  return null
}

const flow: FlowConfig = {
  stepGroups: { s1: { title: 'Step 1' } },
  steps: { a: { step: 's1', title: 'A', component: EmptyCard } },
  initialStep: 'a'
}

describe('SinglePaneStepper.Root className', () => {
  test('forwards a passed className onto the root element alongside the base class', () => {
    const { container } = render(<SinglePaneStepper.Root flow={flow} className="max-w-[600px]" />)
    const root = container.querySelector('.cn-single-pane-stepper-root')
    expect(root).toBeInTheDocument()
    expect(root).toHaveClass('max-w-[600px]')
  })

  test('renders the base class alone when no className is passed', () => {
    const { container } = render(<SinglePaneStepper.Root flow={flow} />)
    const root = container.querySelector('.cn-single-pane-stepper-root')
    expect(root).toBeInTheDocument()
  })
})
