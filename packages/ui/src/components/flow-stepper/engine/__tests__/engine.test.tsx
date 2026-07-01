import React, { useEffect } from 'react'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'

import { CardContextProvider, FlowEngineProvider, useEngineContext, useFlowCard, type FlowConfig } from '../index'

// Mocks
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

// Test harness: renders card stack from engine cardHistory
function TestHarness({ children }: { children: React.ReactNode }) {
  return <div data-testid="test-harness">{children}</div>
}

function CardStack() {
  const { cardHistory, flow } = useEngineContext()
  return (
    <div data-testid="card-stack">
      {cardHistory.map(entry => {
        const CardComponent = flow.subSteps[entry.subStepId]?.component
        if (!CardComponent) return null
        return (
          <CardContextProvider key={entry.subStepId} subStepId={entry.subStepId} status={entry.status}>
            <div data-testid={`card-${entry.subStepId}`} data-status={entry.status}>
              <CardComponent />
            </div>
          </CardContextProvider>
        )
      })}
    </div>
  )
}

// Test cards
function TestCardA() {
  const { complete } = useFlowCard()
  return (
    <div>
      <h3>Card A</h3>
      <button onClick={() => complete({ answer: 'yes' }, 'card-b')}>Next</button>
    </div>
  )
}

function TestCardB() {
  const { state, complete } = useFlowCard()
  return (
    <div>
      <h3>Card B</h3>
      <span>Answer: {state.answer as string}</span>
      <button onClick={() => complete({ finished: true }, 'card-c')}>Finish</button>
    </div>
  )
}

function TestCardC() {
  return (
    <div>
      <h3>Card C</h3>
      <span>All done</span>
    </div>
  )
}

// Terminal flow test cards
function TerminalCardA() {
  const { complete } = useFlowCard()
  return (
    <div>
      <h3>Terminal Card A</h3>
      <button onClick={() => complete({}, 'terminal-b')}>Next</button>
    </div>
  )
}

function TerminalCardB() {
  const { status, complete } = useFlowCard()
  return (
    <div>
      <h3>Terminal Card B</h3>
      <span data-testid="terminal-status">{status}</span>
      <button onClick={() => complete({})}>Done</button>
    </div>
  )
}

// Skip test cards
function SkipCardA() {
  const { skip } = useFlowCard()
  return (
    <div>
      <h3>Skip Card A</h3>
      <button onClick={() => skip('skip-b')}>Skip</button>
    </div>
  )
}

function SkipCardB() {
  return (
    <div>
      <h3>Skip Card B</h3>
      <span>Reached after skip</span>
    </div>
  )
}

// Error test cards
function ErrorCardA() {
  const { error } = useFlowCard()
  return (
    <div>
      <h3>Error Card A</h3>
      <button onClick={error}>Trigger Error</button>
    </div>
  )
}

function ErrorRecoveryCard() {
  const { status, complete } = useFlowCard()
  return (
    <div>
      <h3>Error Recovery Card</h3>
      <span data-testid="error-status">{status}</span>
      <button onClick={() => complete({})}>Recover</button>
    </div>
  )
}

// Drawer test cards
function DrawerCardA() {
  const { openDrawer } = useFlowCard()
  const [drawerResult, setDrawerResult] = React.useState<string | null>(null)

  const handleOpenDrawer = async () => {
    const result = await openDrawer('test-drawer', { context: 'test' })
    setDrawerResult(result.success ? 'success' : 'cancelled')
  }

  return (
    <div>
      <h3>Drawer Card A</h3>
      <button onClick={handleOpenDrawer}>Open Drawer</button>
      {drawerResult && <span data-testid="drawer-result">{drawerResult}</span>}
    </div>
  )
}

function DrawerComponent() {
  const { drawerState, closeDrawer } = useEngineContext()
  if (!drawerState) return null

  return (
    <div data-testid="test-drawer">
      <h3>Test Drawer</h3>
      <button onClick={() => closeDrawer({ success: true })}>Confirm</button>
      <button onClick={() => closeDrawer({ success: false })}>Cancel</button>
    </div>
  )
}

// Reactivation test cards
function ReactivateCardA() {
  const { complete } = useFlowCard()
  return (
    <div>
      <h3>Reactivate Card A</h3>
      <button onClick={() => complete({ step1: 'done' }, 'reactivate-b')}>Next</button>
    </div>
  )
}

function ReactivateCardB() {
  const { complete } = useFlowCard()
  return (
    <div>
      <h3>Reactivate Card B</h3>
      <button onClick={() => complete({ step2: 'done' }, 'reactivate-c')}>Next</button>
    </div>
  )
}

function ReactivateCardC() {
  const { requestReactivation } = useEngineContext()
  return (
    <div>
      <h3>Reactivate Card C</h3>
      <button onClick={() => requestReactivation('reactivate-b')}>Edit Previous</button>
    </div>
  )
}

function ReactivationDialog() {
  const { pendingReactivation, confirmReactivation, cancelReactivation } = useEngineContext()
  if (!pendingReactivation) return null

  return (
    <div data-testid="reactivation-dialog">
      <button onClick={confirmReactivation}>Confirm</button>
      <button onClick={cancelReactivation}>Cancel</button>
    </div>
  )
}

// Test flow configs
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

const terminalFlow: FlowConfig = {
  steps: {
    'step-1': { title: 'First Step' },
    'step-2': { title: 'Second Step' }
  },
  subSteps: {
    'terminal-a': { step: 'step-1', title: 'Terminal A', component: TerminalCardA, next: 'terminal-b' },
    'terminal-b': { step: 'step-2', title: 'Terminal B', component: TerminalCardB, terminal: true }
  },
  initialSubStep: 'terminal-a'
}

const skipFlow: FlowConfig = {
  steps: {
    'step-1': { title: 'First Step' },
    'step-2': { title: 'Second Step' }
  },
  subSteps: {
    'skip-a': { step: 'step-1', title: 'Skip A', component: SkipCardA, next: 'skip-b' },
    'skip-b': { step: 'step-2', title: 'Skip B', component: SkipCardB }
  },
  initialSubStep: 'skip-a'
}

const errorFlow: FlowConfig = {
  steps: {
    'step-1': { title: 'First Step' }
  },
  subSteps: {
    'error-a': { step: 'step-1', title: 'Error A', component: ErrorCardA }
  },
  initialSubStep: 'error-a'
}

const errorRecoveryFlow: FlowConfig = {
  steps: {
    'step-1': { title: 'First Step' }
  },
  subSteps: {
    'error-recovery': { step: 'step-1', title: 'Error Recovery', component: ErrorRecoveryCard }
  },
  initialSubStep: 'error-recovery'
}

const drawerFlow: FlowConfig = {
  steps: {
    'step-1': { title: 'First Step' }
  },
  subSteps: {
    'drawer-a': { step: 'step-1', title: 'Drawer A', component: DrawerCardA }
  },
  initialSubStep: 'drawer-a'
}

const reactivateFlow: FlowConfig = {
  steps: {
    'step-1': { title: 'First Step' },
    'step-2': { title: 'Second Step' },
    'step-3': { title: 'Third Step' }
  },
  subSteps: {
    'reactivate-a': { step: 'step-1', title: 'Reactivate A', component: ReactivateCardA, next: 'reactivate-b' },
    'reactivate-b': { step: 'step-2', title: 'Reactivate B', component: ReactivateCardB, next: 'reactivate-c' },
    'reactivate-c': { step: 'step-3', title: 'Reactivate C', component: ReactivateCardC }
  },
  initialSubStep: 'reactivate-a'
}

describe('Flow Engine', () => {
  describe('Basic Flow Navigation', () => {
    test('renders initial card', () => {
      render(
        <FlowEngineProvider flow={testFlow}>
          <TestHarness>
            <CardStack />
          </TestHarness>
        </FlowEngineProvider>
      )
      expect(screen.getByText('Card A')).toBeInTheDocument()
    })

    test('navigates to next card on complete', async () => {
      render(
        <FlowEngineProvider flow={testFlow}>
          <TestHarness>
            <CardStack />
          </TestHarness>
        </FlowEngineProvider>
      )
      await userEvent.click(screen.getByText('Next'))
      await waitFor(() => {
        expect(screen.getByText('Card B')).toBeInTheDocument()
      })
    })

    test('previous cards remain visible after completion', async () => {
      render(
        <FlowEngineProvider flow={testFlow}>
          <TestHarness>
            <CardStack />
          </TestHarness>
        </FlowEngineProvider>
      )
      await userEvent.click(screen.getByText('Next'))
      await waitFor(() => {
        expect(screen.getByText('Card A')).toBeInTheDocument()
        expect(screen.getByTestId('card-card-a')).toHaveAttribute('data-status', 'completed')
      })
    })

    test('navigates through multiple cards', async () => {
      render(
        <FlowEngineProvider flow={testFlow}>
          <TestHarness>
            <CardStack />
          </TestHarness>
        </FlowEngineProvider>
      )
      await userEvent.click(screen.getByText('Next'))
      await waitFor(() => {
        expect(screen.getByText('Card B')).toBeInTheDocument()
      })
      await userEvent.click(screen.getByText('Finish'))
      await waitFor(() => {
        expect(screen.getByText('Card C')).toBeInTheDocument()
      })
    })
  })

  describe('State Management', () => {
    test('accumulates state across cards', async () => {
      render(
        <FlowEngineProvider flow={testFlow}>
          <TestHarness>
            <CardStack />
          </TestHarness>
        </FlowEngineProvider>
      )
      await userEvent.click(screen.getByText('Next'))
      await waitFor(() => {
        expect(screen.getByText('Answer: yes')).toBeInTheDocument()
      })
    })
  })

  describe('Terminal Substeps', () => {
    test('terminal substep enters as completed', async () => {
      render(
        <FlowEngineProvider flow={terminalFlow}>
          <TestHarness>
            <CardStack />
          </TestHarness>
        </FlowEngineProvider>
      )
      await userEvent.click(screen.getByText('Next'))
      await waitFor(() => {
        expect(screen.getByTestId('terminal-status')).toHaveTextContent('completed')
      })
    })

    test('terminal substep calls onComplete on user action', async () => {
      const onComplete = vi.fn()
      render(
        <FlowEngineProvider flow={terminalFlow} onComplete={onComplete}>
          <TestHarness>
            <CardStack />
          </TestHarness>
        </FlowEngineProvider>
      )
      await userEvent.click(screen.getByText('Next'))
      await waitFor(() => {
        expect(screen.getByTestId('terminal-status')).toHaveTextContent('completed')
      })
      await userEvent.click(screen.getByText('Done'))
      await waitFor(() => {
        expect(onComplete).toHaveBeenCalled()
      })
    })
  })

  describe('Skip Behavior', () => {
    test('skips to next card', async () => {
      render(
        <FlowEngineProvider flow={skipFlow}>
          <TestHarness>
            <CardStack />
          </TestHarness>
        </FlowEngineProvider>
      )
      await userEvent.click(screen.getByText('Skip'))
      await waitFor(() => {
        expect(screen.getByText('Skip Card B')).toBeInTheDocument()
        expect(screen.getByTestId('card-skip-a')).toHaveAttribute('data-status', 'skipped')
      })
    })
  })

  describe('Error Handling', () => {
    test('sets card to error status', async () => {
      render(
        <FlowEngineProvider flow={errorFlow}>
          <TestHarness>
            <CardStack />
          </TestHarness>
        </FlowEngineProvider>
      )
      await userEvent.click(screen.getByText('Trigger Error'))
      await waitFor(() => {
        expect(screen.getByTestId('card-error-a')).toHaveAttribute('data-status', 'error')
      })
    })

    test('can recover from error state', async () => {
      function ErrorRecoveryHarness() {
        const { error } = useEngineContext()
        useEffect(() => {
          error('error-recovery')
        }, [error])
        return <CardStack />
      }

      render(
        <FlowEngineProvider flow={errorRecoveryFlow}>
          <TestHarness>
            <ErrorRecoveryHarness />
          </TestHarness>
        </FlowEngineProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('error-status')).toHaveTextContent('error')
      })

      await userEvent.click(screen.getByText('Recover'))
      await waitFor(() => {
        expect(screen.getByTestId('card-error-recovery')).toHaveAttribute('data-status', 'completed')
      })
    })
  })

  describe('Drawer Integration', () => {
    test('opens drawer and resolves with success', async () => {
      render(
        <FlowEngineProvider flow={drawerFlow}>
          <TestHarness>
            <CardStack />
            <DrawerComponent />
          </TestHarness>
        </FlowEngineProvider>
      )

      await userEvent.click(screen.getByText('Open Drawer'))
      await waitFor(() => {
        expect(screen.getByTestId('test-drawer')).toBeInTheDocument()
      })

      await userEvent.click(screen.getByText('Confirm'))
      await waitFor(() => {
        expect(screen.getByTestId('drawer-result')).toHaveTextContent('success')
      })
    })

    test('opens drawer and resolves with cancel', async () => {
      render(
        <FlowEngineProvider flow={drawerFlow}>
          <TestHarness>
            <CardStack />
            <DrawerComponent />
          </TestHarness>
        </FlowEngineProvider>
      )

      await userEvent.click(screen.getByText('Open Drawer'))
      await waitFor(() => {
        expect(screen.getByTestId('test-drawer')).toBeInTheDocument()
      })

      await userEvent.click(screen.getByText('Cancel'))
      await waitFor(() => {
        expect(screen.getByTestId('drawer-result')).toHaveTextContent('cancelled')
      })
    })
  })

  describe('Reactivation', () => {
    test('requests reactivation of a previous card', async () => {
      render(
        <FlowEngineProvider flow={reactivateFlow}>
          <TestHarness>
            <CardStack />
            <ReactivationDialog />
          </TestHarness>
        </FlowEngineProvider>
      )

      // Navigate to card C
      const firstNextButton = screen.getAllByText('Next')[0]
      await userEvent.click(firstNextButton)
      await waitFor(() => {
        expect(screen.getByText('Reactivate Card B')).toBeInTheDocument()
      })

      // Click the active card's Next button (Card B)
      await waitFor(() => {
        const cardB = screen.getByTestId('card-reactivate-b')
        const nextButton = cardB.querySelector('button')
        if (nextButton) {
          userEvent.click(nextButton)
        }
      })

      await waitFor(() => {
        expect(screen.getByText('Reactivate Card C')).toBeInTheDocument()
      })

      // Request reactivation
      await userEvent.click(screen.getByText('Edit Previous'))
      await waitFor(() => {
        expect(screen.getByTestId('reactivation-dialog')).toBeInTheDocument()
      })
    })

    test('confirms reactivation and restores state', async () => {
      render(
        <FlowEngineProvider flow={reactivateFlow}>
          <TestHarness>
            <CardStack />
            <ReactivationDialog />
          </TestHarness>
        </FlowEngineProvider>
      )

      // Navigate to card C
      const firstNextButton = screen.getAllByText('Next')[0]
      await userEvent.click(firstNextButton)
      await waitFor(() => {
        expect(screen.getByText('Reactivate Card B')).toBeInTheDocument()
      })

      // Click the active card's Next button (Card B)
      await waitFor(() => {
        const cardB = screen.getByTestId('card-reactivate-b')
        const nextButton = cardB.querySelector('button')
        if (nextButton) {
          userEvent.click(nextButton)
        }
      })

      await waitFor(() => {
        expect(screen.getByText('Reactivate Card C')).toBeInTheDocument()
      })

      // Request and confirm reactivation
      await userEvent.click(screen.getByText('Edit Previous'))
      await waitFor(() => {
        expect(screen.getByTestId('reactivation-dialog')).toBeInTheDocument()
      })
      await userEvent.click(screen.getByText('Confirm'))

      // Card B should be active again, Card C should be gone
      await waitFor(() => {
        expect(screen.getByTestId('card-reactivate-b')).toHaveAttribute('data-status', 'active')
        expect(screen.queryByTestId('card-reactivate-c')).not.toBeInTheDocument()
      })
    })

    test('cancels reactivation', async () => {
      render(
        <FlowEngineProvider flow={reactivateFlow}>
          <TestHarness>
            <CardStack />
            <ReactivationDialog />
          </TestHarness>
        </FlowEngineProvider>
      )

      // Navigate to card C
      const firstNextButton = screen.getAllByText('Next')[0]
      await userEvent.click(firstNextButton)
      await waitFor(() => {
        expect(screen.getByText('Reactivate Card B')).toBeInTheDocument()
      })

      // Click the active card's Next button (Card B)
      await waitFor(() => {
        const cardB = screen.getByTestId('card-reactivate-b')
        const nextButton = cardB.querySelector('button')
        if (nextButton) {
          userEvent.click(nextButton)
        }
      })

      await waitFor(() => {
        expect(screen.getByText('Reactivate Card C')).toBeInTheDocument()
      })

      // Request and cancel reactivation
      await userEvent.click(screen.getByText('Edit Previous'))
      await waitFor(() => {
        expect(screen.getByTestId('reactivation-dialog')).toBeInTheDocument()
      })
      await userEvent.click(screen.getByText('Cancel'))

      // Should stay on card C
      await waitFor(() => {
        expect(screen.queryByTestId('reactivation-dialog')).not.toBeInTheDocument()
        expect(screen.getByText('Reactivate Card C')).toBeInTheDocument()
      })
    })
  })
})
