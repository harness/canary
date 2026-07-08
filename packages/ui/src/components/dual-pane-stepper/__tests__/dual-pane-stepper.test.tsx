import React from 'react'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'

import type { FlowConfig } from '../dual-pane-stepper-types'
import { DualPaneStepper, useFlowCard } from '../index'

// Mock react-resizable-panels
vi.mock('react-resizable-panels', () => ({
  PanelGroup: ({ children, ...props }: any) => (
    <div data-testid="panel-group" {...props}>
      {children}
    </div>
  ),
  Panel: ({ children, ...props }: any) => (
    <div data-testid="panel" {...props}>
      {children}
    </div>
  ),
  PanelResizeHandle: ({ children, ...props }: any) => (
    <div data-testid="resize-handle" {...props}>
      {children}
    </div>
  )
}))

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
  Tooltip: ({ children, content }: { children: React.ReactNode; content: React.ReactNode }) => (
    <span data-tooltip-content={typeof content === 'string' ? content : undefined}>{children}</span>
  ),
  TooltipProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  withTooltip: (Component: React.ComponentType<any>) => Component
}))

// Test cards
function TestCardA() {
  const { complete } = useFlowCard()
  return (
    <DualPaneStepper.Card title="Card A">
      <button onClick={() => complete({ answer: 'yes' }, 'card-b')}>Next</button>
    </DualPaneStepper.Card>
  )
}

function TestCardB() {
  const { state, complete } = useFlowCard()
  return (
    <DualPaneStepper.Card title="Card B">
      <span>Answer: {state.answer as string}</span>
      <button onClick={() => complete({ finished: true }, 'card-c')}>Finish</button>
    </DualPaneStepper.Card>
  )
}

function TestCardC() {
  return (
    <DualPaneStepper.Card title="Card C">
      <span>All done</span>
    </DualPaneStepper.Card>
  )
}

const testFlow: FlowConfig = {
  steps: {
    'step-1': { title: 'First Step', description: 'Do first thing' },
    'step-2': { title: 'Second Step', description: 'Do second thing' },
    'step-3': { title: 'Third Step', description: 'Do third thing' }
  },
  subSteps: {
    'card-a': { step: 'step-1', title: 'Card A', description: 'First card', component: TestCardA, next: 'card-b' },
    'card-b': { step: 'step-2', title: 'Card B', description: 'Second card', component: TestCardB, next: 'card-c' },
    'card-c': { step: 'step-3', title: 'Card C', description: 'Third card', component: TestCardC }
  },
  initialSubStep: 'card-a'
}

describe('DualPaneStepper', () => {
  describe('Rendering', () => {
    test('renders initial card', () => {
      render(<DualPaneStepper.Root flow={testFlow} title="Test Flow" />)
      expect(screen.getAllByText('Card A').length).toBeGreaterThanOrEqual(1)
    })

    test('renders flow title', () => {
      render(<DualPaneStepper.Root flow={testFlow} title="Test Flow" />)
      expect(screen.getAllByText('Test Flow').length).toBeGreaterThanOrEqual(1)
    })

    test('renders contentSubtitle when provided', () => {
      render(<DualPaneStepper.Root flow={testFlow} title="Test Flow" contentSubtitle="A test subtitle" />)
      expect(screen.getByText('A test subtitle')).toBeInTheDocument()
    })

    test('renders stepper with correct steps', () => {
      render(<DualPaneStepper.Root flow={testFlow} title="Test Flow" />)
      expect(screen.getByText('First Step')).toBeInTheDocument()
      expect(screen.getByText('Second Step')).toBeInTheDocument()
      expect(screen.getByText('Third Step')).toBeInTheDocument()
    })

    test('renders panel group for split pane layout', () => {
      render(<DualPaneStepper.Root flow={testFlow} title="Test Flow" />)
      expect(screen.getByTestId('panel-group')).toBeInTheDocument()
    })
  })

  describe('Navigation', () => {
    test('navigates to next card on complete', async () => {
      render(<DualPaneStepper.Root flow={testFlow} title="Test Flow" />)
      await userEvent.click(screen.getByText('Next'))
      await waitFor(() => {
        expect(screen.getAllByText('Card B').length).toBeGreaterThanOrEqual(1)
      })
    })

    test('previous cards remain visible after completion', async () => {
      render(<DualPaneStepper.Root flow={testFlow} title="Test Flow" />)
      await userEvent.click(screen.getByText('Next'))
      await waitFor(() => {
        expect(screen.getAllByText('Card A').length).toBeGreaterThanOrEqual(1)
      })
    })

    test('navigates through multiple cards', async () => {
      render(<DualPaneStepper.Root flow={testFlow} title="Test Flow" />)
      await userEvent.click(screen.getByText('Next'))
      await waitFor(() => {
        expect(screen.getAllByText('Card B').length).toBeGreaterThanOrEqual(1)
      })
      await userEvent.click(screen.getByText('Finish'))
      await waitFor(() => {
        expect(screen.getAllByText('Card C').length).toBeGreaterThanOrEqual(1)
      })
    })
  })

  describe('State Management', () => {
    test('accumulates state across cards', async () => {
      render(<DualPaneStepper.Root flow={testFlow} title="Test Flow" />)
      await userEvent.click(screen.getByText('Next'))
      await waitFor(() => {
        expect(screen.getByText('Answer: yes')).toBeInTheDocument()
      })
    })
  })

  describe('Stepper Integration', () => {
    test('stepper reflects active card step', () => {
      render(<DualPaneStepper.Root flow={testFlow} title="Test Flow" />)
      const stepButtons = screen.getAllByRole('button').filter(btn => {
        const ariaLabel = btn.getAttribute('aria-label')
        return ariaLabel && ariaLabel.includes('Step')
      })
      expect(stepButtons.length).toBeGreaterThan(0)
    })
  })

  describe('Callbacks', () => {
    test('calls onClose when provided', async () => {
      const onClose = vi.fn()
      render(<DualPaneStepper.Root flow={testFlow} title="Test Flow" onClose={onClose} />)
      const closeButton = screen.getByLabelText('Close')
      await userEvent.click(closeButton)
      expect(onClose).toHaveBeenCalled()
    })
  })

  describe('Left Pane', () => {
    test('renders custom left pane content when provided', () => {
      render(<DualPaneStepper.Root flow={testFlow} title="Test Flow" leftPane={<div>Custom Left</div>} />)
      expect(screen.getByText('Custom Left')).toBeInTheDocument()
    })
  })
})
