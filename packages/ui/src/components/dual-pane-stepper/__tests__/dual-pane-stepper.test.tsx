import React from 'react'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'

import { useEngineContext } from '../../flow-stepper/engine'
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

function EngineChildProbe() {
  const { activeStepId } = useEngineContext()
  return <span data-testid="bridge-child">{activeStepId}</span>
}

const testFlow: FlowConfig = {
  stepGroups: {
    'step-1': { title: 'First Step', description: 'Do first thing' },
    'step-2': { title: 'Second Step', description: 'Do second thing' },
    'step-3': { title: 'Third Step', description: 'Do third thing' }
  },
  steps: {
    'card-a': { step: 'step-1', title: 'Card A', description: 'First card', component: TestCardA, next: 'card-b' },
    'card-b': { step: 'step-2', title: 'Card B', description: 'Second card', component: TestCardB, next: 'card-c' },
    'card-c': { step: 'step-3', title: 'Card C', description: 'Third card', component: TestCardC }
  },
  initialStep: 'card-a'
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

    test('hideUpcomingGroups omits groups whose derived state is upcoming', () => {
      render(<DualPaneStepper.Root flow={testFlow} title="Test Flow" hideUpcomingGroups />)

      expect(screen.getByText('First Step')).toBeInTheDocument()
      expect(screen.queryByText('Second Step')).not.toBeInTheDocument()
      expect(screen.queryByText('Third Step')).not.toBeInTheDocument()
    })

    test('hidePredictedSteps omits predicted nested placeholders in grouped mode', () => {
      function TestCardChained() {
        const { complete } = useFlowCard()
        return (
          <DualPaneStepper.Card title="Chained">
            <button onClick={() => complete({}, 'card-next')}>Go</button>
          </DualPaneStepper.Card>
        )
      }

      const chainedFlow: FlowConfig = {
        stepGroups: { 'step-1': { title: 'Group' } },
        steps: {
          'card-chained': { step: 'step-1', title: 'Chained', component: TestCardChained, next: 'card-next' },
          'card-next': { step: 'step-1', title: 'Next Card', component: TestCardB }
        },
        initialStep: 'card-chained'
      }

      const { container } = render(<DualPaneStepper.Root flow={chainedFlow} title="Test Flow" hidePredictedSteps />)

      expect(container.querySelectorAll('.cn-stepper-nested-step-upcoming').length).toBe(0)
      expect(screen.queryByText('Next Card')).not.toBeInTheDocument()
      expect(screen.getAllByText('Chained').length).toBeGreaterThanOrEqual(1)
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

  describe('Root children', () => {
    test('Root children render inside FlowEngineProvider after visual content', () => {
      render(
        <DualPaneStepper.Root flow={testFlow}>
          <EngineChildProbe />
        </DualPaneStepper.Root>
      )
      expect(screen.getByTestId('bridge-child')).toHaveTextContent('card-a')
    })

    test('Root children are not forwarded onto Content DOM', () => {
      const { container } = render(
        <DualPaneStepper.Root flow={testFlow}>
          <EngineChildProbe />
        </DualPaneStepper.Root>
      )
      expect(container.querySelectorAll('[data-testid="bridge-child"]')).toHaveLength(1)
    })

    test('Root forwards initialEngineState into the engine', () => {
      render(
        <DualPaneStepper.Root
          flow={testFlow}
          initialEngineState={{
            state: { answer: 'restored' },
            cardHistory: [
              { stepId: 'card-a', status: 'completed', stateSnapshot: { answer: 'restored' } },
              { stepId: 'card-b', status: 'active', stateSnapshot: {} }
            ]
          }}
        />
      )
      expect(screen.getAllByText('Card B').length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('Terminal Steps', () => {
    test('visualCompleted terminal step renders parent step group as completed (green), not active', async () => {
      const visualCompletedFlow: FlowConfig = {
        stepGroups: { 'step-1': { title: 'First' }, 'step-2': { title: 'Second' } },
        steps: {
          // TestCardA/TestCardB hard-code their transition targets ('card-b'/'card-c') rather
          // than reading `next` from the flow config, so the step ids here must match those
          // literals to match this file's existing fixture convention.
          'card-a': { step: 'step-1', title: 'A', component: TestCardA, next: 'card-b' },
          'card-b': {
            step: 'step-2',
            title: 'B',
            component: TestCardB,
            terminal: true,
            visualCompleted: true
          }
        },
        initialStep: 'card-a'
      }
      render(<DualPaneStepper.Root flow={visualCompletedFlow} title="Test Flow" />)
      await userEvent.click(screen.getByText('Next'))
      await waitFor(() => {
        // The parent step (step-2) must show the plain completed connector class, NOT the
        // partial active-trunk class — proving stepper-step.tsx took the ordinary completed
        // path with zero code changes there, driven entirely by derive-stepper-model.ts.
        const connectors = document.querySelectorAll('.cn-stepper-connector')
        const step2Connector = connectors[connectors.length - 1]
        expect(step2Connector).toHaveClass('cn-stepper-connector-completed')
        expect(step2Connector).not.toHaveClass('cn-stepper-connector-active-partial')
      })
    })
  })

  describe('Flat Mode', () => {
    const flatTestFlow: FlowConfig = {
      steps: {
        'card-a': { title: 'Card A', component: TestCardA, next: 'card-b' },
        'card-b': { title: 'Card B', component: TestCardB, next: 'card-c' },
        'card-c': { title: 'Card C', component: TestCardC }
      },
      initialStep: 'card-a'
    }

    test('renders steps as top-level Stepper.Step items when stepGroups is absent', async () => {
      const { container } = render(<DualPaneStepper.Root flow={flatTestFlow} title="Test Flow" />)
      expect(container.querySelector('.cn-stepper-nested-step-item')).not.toBeInTheDocument()
      expect(container.querySelectorAll('.cn-stepper-step-item').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('Card A').length).toBeGreaterThanOrEqual(1)

      await userEvent.click(screen.getByText('Next'))
      await waitFor(() => {
        expect(screen.getAllByText('Card B').length).toBeGreaterThanOrEqual(1)
      })

      expect(container.querySelector('.cn-stepper-nested-step-item')).not.toBeInTheDocument()
    })

    test('hidePredictedSteps omits upcoming entries from the flat timeline', async () => {
      const { container } = render(<DualPaneStepper.Root flow={flatTestFlow} title="Test Flow" hidePredictedSteps />)

      await userEvent.click(screen.getByText('Next'))
      await waitFor(() => {
        expect(screen.getAllByText('Card B').length).toBeGreaterThanOrEqual(1)
      })

      expect(screen.queryByText('Card C')).not.toBeInTheDocument()
      expect(container.querySelectorAll('.cn-stepper-step-item').length).toBe(2)
    })
  })
})
