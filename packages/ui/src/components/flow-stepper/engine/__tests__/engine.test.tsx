import React, { useEffect } from 'react'

import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'

import {
  CardContextProvider,
  FlowEngineProvider,
  useEngineContext,
  useFlowCard,
  type FlowConfig,
  type InitialEngineState
} from '../index'

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
        const CardComponent = flow.steps[entry.stepId]?.component
        if (!CardComponent) return null
        return (
          <CardContextProvider
            key={`${entry.stepId}-${entry.mountGeneration ?? 0}`}
            stepId={entry.stepId}
            status={entry.status}
          >
            <div data-testid={`card-${entry.stepId}`} data-status={entry.status}>
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
      <button onClick={() => error()}>Trigger Error</button>
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

// Restore test cards: report their own card status so a restored snapshot's per-entry status
// can be asserted without colliding testids when two of these render side by side.
function RestoreErrorCard() {
  const { status } = useFlowCard()
  return <span data-testid="restore-status">{status}</span>
}

// Engine-level probe that can target ANY stepId (not just the card it's mounted on) — used to
// exercise complete()/error() against a restored, non-active step (e.g. a restored 'completed' or
// 'error' entry that is not the current activeStepId).
function EngineStepProbe({ stepId }: { stepId: string }) {
  const { complete, error } = useEngineContext()
  return (
    <div>
      <button data-testid={`probe-complete-${stepId}`} onClick={() => complete(stepId, { probed: true })}>
        probe-complete-{stepId}
      </button>
      <button data-testid={`probe-error-${stepId}`} onClick={() => error(stepId)}>
        probe-error-{stepId}
      </button>
    </div>
  )
}

// Probe from the task brief: exercises complete() on the current activeStepId and surfaces
// engine-level state for assertions.
function CompleteProbe() {
  const { complete, activeStepId, cardHistory, state } = useEngineContext()
  return (
    <div>
      <span data-testid="active">{activeStepId}</span>
      <span data-testid="history-len">{cardHistory.length}</span>
      <span data-testid="state-answer">{String(state.answer ?? '')}</span>
      <button onClick={() => complete(activeStepId, { probed: true })}>probe-complete</button>
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
      {/* Fires two closeDrawer calls synchronously in one handler — the second must be a no-op
          (idempotent close), so the awaiting openDrawer promise resolves with the FIRST result. */}
      <button
        onClick={() => {
          closeDrawer({ success: true })
          closeDrawer({ success: false })
        }}
      >
        Double Close
      </button>
    </div>
  )
}

// Card that completes to a step id that does not exist in the flow config — exercises the
// unknown-nextStepId guard.
function BadRouteCard() {
  const { complete } = useFlowCard()
  return (
    <div>
      <h3>Bad Route Card</h3>
      <button onClick={() => complete({}, 'does-not-exist')}>Go Nowhere</button>
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

function RemountCardA() {
  const { complete } = useFlowCard()
  return (
    <div>
      <h3>Remount Card A</h3>
      <button onClick={() => complete({ step1: 'done' }, 'remount-b')}>Next</button>
    </div>
  )
}

function RemountCardB() {
  const { complete } = useFlowCard()
  const [count, setCount] = React.useState(0)
  return (
    <div>
      <h3>Remount Card B</h3>
      <span data-testid="remount-counter">{count}</span>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <button onClick={() => complete({ step2: 'done' }, 'remount-c')}>Next</button>
    </div>
  )
}

function RemountCardC() {
  const { requestReactivation } = useEngineContext()
  return (
    <div>
      <h3>Remount Card C</h3>
      <button onClick={() => requestReactivation('remount-b')}>Edit Previous</button>
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

const terminalFlow: FlowConfig = {
  stepGroups: {
    'step-1': { title: 'First Step' },
    'step-2': { title: 'Second Step' }
  },
  steps: {
    'terminal-a': { step: 'step-1', title: 'Terminal A', component: TerminalCardA, next: 'terminal-b' },
    'terminal-b': { step: 'step-2', title: 'Terminal B', component: TerminalCardB, terminal: true }
  },
  initialStep: 'terminal-a'
}

const skipFlow: FlowConfig = {
  stepGroups: {
    'step-1': { title: 'First Step' },
    'step-2': { title: 'Second Step' }
  },
  steps: {
    'skip-a': { step: 'step-1', title: 'Skip A', component: SkipCardA, next: 'skip-b' },
    'skip-b': { step: 'step-2', title: 'Skip B', component: SkipCardB }
  },
  initialStep: 'skip-a'
}

const errorFlow: FlowConfig = {
  stepGroups: {
    'step-1': { title: 'First Step' }
  },
  steps: {
    'error-a': { step: 'step-1', title: 'Error A', component: ErrorCardA }
  },
  initialStep: 'error-a'
}

const errorRecoveryFlow: FlowConfig = {
  stepGroups: {
    'step-1': { title: 'First Step' }
  },
  steps: {
    'error-recovery': { step: 'step-1', title: 'Error Recovery', component: ErrorRecoveryCard },
    // Extra steps used only by initialEngineState restore tests (terminalRef rebuild around
    // 'error' entries). Not part of the 'error-recovery' initialStep path above.
    'error-a': { step: 'step-1', title: 'Error A', component: RestoreErrorCard, next: 'error-b' },
    'error-b': { step: 'step-1', title: 'Error B', component: RestoreErrorCard }
  },
  initialStep: 'error-recovery'
}

const drawerFlow: FlowConfig = {
  stepGroups: {
    'step-1': { title: 'First Step' }
  },
  steps: {
    'drawer-a': { step: 'step-1', title: 'Drawer A', component: DrawerCardA }
  },
  initialStep: 'drawer-a'
}

const badRouteFlow: FlowConfig = {
  stepGroups: {
    'step-1': { title: 'First Step' }
  },
  steps: {
    'bad-route': { step: 'step-1', title: 'Bad Route', component: BadRouteCard }
  },
  initialStep: 'bad-route'
}

const reactivateFlow: FlowConfig = {
  stepGroups: {
    'step-1': { title: 'First Step' },
    'step-2': { title: 'Second Step' },
    'step-3': { title: 'Third Step' }
  },
  steps: {
    'reactivate-a': { step: 'step-1', title: 'Reactivate A', component: ReactivateCardA, next: 'reactivate-b' },
    'reactivate-b': { step: 'step-2', title: 'Reactivate B', component: ReactivateCardB, next: 'reactivate-c' },
    'reactivate-c': { step: 'step-3', title: 'Reactivate C', component: ReactivateCardC }
  },
  initialStep: 'reactivate-a'
}

const remountFlow: FlowConfig = {
  stepGroups: {
    'step-1': { title: 'First Step' },
    'step-2': { title: 'Second Step' },
    'step-3': { title: 'Third Step' }
  },
  steps: {
    'remount-a': { step: 'step-1', title: 'Remount A', component: RemountCardA, next: 'remount-b' },
    'remount-b': { step: 'step-2', title: 'Remount B', component: RemountCardB, next: 'remount-c' },
    'remount-c': { step: 'step-3', title: 'Remount C', component: RemountCardC }
  },
  initialStep: 'remount-a'
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

  describe('Terminal Steps', () => {
    test('terminal step enters as active (not auto-completed)', async () => {
      render(
        <FlowEngineProvider flow={terminalFlow}>
          <TestHarness>
            <CardStack />
          </TestHarness>
        </FlowEngineProvider>
      )
      await userEvent.click(screen.getByText('Next'))
      await waitFor(() => {
        expect(screen.getByTestId('terminal-status')).toHaveTextContent('active')
      })
    })

    test('terminal step calls onComplete on user action', async () => {
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
        expect(screen.getByTestId('terminal-status')).toHaveTextContent('active')
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

    test('error-and-continue: errored step stays red in history while the flow advances', async () => {
      function ErrorContinueHarness() {
        const { error } = useEngineContext()
        useEffect(() => {
          // Error card-a AND advance to card-b — card-a must remain 'error', card-b becomes active.
          error('card-a', 'card-b')
        }, [error])
        return <CardStack />
      }

      render(
        <FlowEngineProvider flow={testFlow}>
          <TestHarness>
            <ErrorContinueHarness />
          </TestHarness>
        </FlowEngineProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('card-card-a')).toHaveAttribute('data-status', 'error')
        expect(screen.getByTestId('card-card-b')).toHaveAttribute('data-status', 'active')
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

    test('closeDrawer is idempotent — a second synchronous call is a no-op', async () => {
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

      // Fires closeDrawer twice in one handler: { success: true } then { success: false }.
      // The promise must resolve with the FIRST result (success) — the second call is ignored.
      await userEvent.click(screen.getByText('Double Close'))
      await waitFor(() => {
        expect(screen.getByTestId('drawer-result')).toHaveTextContent('success')
      })
      // The drawer closes exactly once and stays closed (no reopen from the second call).
      expect(screen.queryByTestId('test-drawer')).not.toBeInTheDocument()
    })
  })

  describe('Invalid transitions', () => {
    test('complete() to an unknown step is ignored and logs an error (no phantom card)', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      render(
        <FlowEngineProvider flow={badRouteFlow}>
          <TestHarness>
            <CardStack />
          </TestHarness>
        </FlowEngineProvider>
      )

      expect(screen.getByTestId('card-bad-route')).toBeInTheDocument()

      await userEvent.click(screen.getByText('Go Nowhere'))

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith(expect.stringContaining('does-not-exist'))
      })
      // No card was pushed for the unknown target — the stack still holds only the origin card.
      // (The origin card carries a data-status; the card-stack container does not, so filtering by
      // it counts only real step cards, excluding the wrapping container.)
      expect(screen.queryByTestId('card-does-not-exist')).not.toBeInTheDocument()
      const renderedCards = screen.getAllByTestId(/^card-/).filter(el => el.hasAttribute('data-status'))
      expect(renderedCards).toHaveLength(1)
      expect(renderedCards[0]).toHaveAttribute('data-testid', 'card-bad-route')

      consoleError.mockRestore()
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

    test('remounts the reactivated card so local state resets', async () => {
      render(
        <FlowEngineProvider flow={remountFlow}>
          <TestHarness>
            <CardStack />
            <ReactivationDialog />
          </TestHarness>
        </FlowEngineProvider>
      )

      await userEvent.click(screen.getAllByText('Next')[0])
      await waitFor(() => {
        expect(screen.getByText('Remount Card B')).toBeInTheDocument()
      })

      expect(screen.getByTestId('remount-counter')).toHaveTextContent('0')
      await userEvent.click(screen.getByText('Increment'))
      expect(screen.getByTestId('remount-counter')).toHaveTextContent('1')

      const cardB = screen.getByTestId('card-remount-b')
      const nextButton = cardB.querySelector('button:last-of-type')
      expect(nextButton).toBeTruthy()
      await userEvent.click(nextButton as HTMLElement)

      await waitFor(() => {
        expect(screen.getByText('Remount Card C')).toBeInTheDocument()
      })

      await userEvent.click(screen.getByText('Edit Previous'))
      await waitFor(() => {
        expect(screen.getByTestId('reactivation-dialog')).toBeInTheDocument()
      })
      await userEvent.click(screen.getByText('Confirm'))

      await waitFor(() => {
        expect(screen.getByTestId('card-remount-b')).toHaveAttribute('data-status', 'active')
        expect(screen.queryByTestId('card-remount-c')).not.toBeInTheDocument()
      })

      expect(screen.getByTestId('remount-counter')).toHaveTextContent('0')
    })

    test('calls onReactivate with the restarted step id after confirm', async () => {
      const onReactivate = vi.fn()
      render(
        <FlowEngineProvider flow={reactivateFlow} onReactivate={onReactivate}>
          <TestHarness>
            <CardStack />
            <ReactivationDialog />
          </TestHarness>
        </FlowEngineProvider>
      )

      await userEvent.click(screen.getAllByText('Next')[0])
      await waitFor(() => {
        expect(screen.getByText('Reactivate Card B')).toBeInTheDocument()
      })
      const cardB = screen.getByTestId('card-reactivate-b')
      const nextButton = cardB.querySelector('button')
      expect(nextButton).toBeTruthy()
      await userEvent.click(nextButton as HTMLElement)
      await waitFor(() => {
        expect(screen.getByText('Reactivate Card C')).toBeInTheDocument()
      })

      await userEvent.click(screen.getByText('Edit Previous'))
      await waitFor(() => {
        expect(screen.getByTestId('reactivation-dialog')).toBeInTheDocument()
      })
      await userEvent.click(screen.getByText('Confirm'))

      await waitFor(() => {
        expect(onReactivate).toHaveBeenCalledTimes(1)
        expect(onReactivate).toHaveBeenCalledWith('reactivate-b')
      })
    })

    test('does not call onReactivate when reactivation is cancelled', async () => {
      const onReactivate = vi.fn()
      render(
        <FlowEngineProvider flow={reactivateFlow} onReactivate={onReactivate}>
          <TestHarness>
            <CardStack />
            <ReactivationDialog />
          </TestHarness>
        </FlowEngineProvider>
      )

      await userEvent.click(screen.getAllByText('Next')[0])
      await waitFor(() => {
        expect(screen.getByText('Reactivate Card B')).toBeInTheDocument()
      })
      const cardB = screen.getByTestId('card-reactivate-b')
      const nextButton = cardB.querySelector('button')
      expect(nextButton).toBeTruthy()
      await userEvent.click(nextButton as HTMLElement)
      await waitFor(() => {
        expect(screen.getByText('Reactivate Card C')).toBeInTheDocument()
      })

      await userEvent.click(screen.getByText('Edit Previous'))
      await waitFor(() => {
        expect(screen.getByTestId('reactivation-dialog')).toBeInTheDocument()
      })
      await userEvent.click(screen.getByText('Cancel'))

      expect(onReactivate).not.toHaveBeenCalled()
    })
  })

  describe('initialEngineState', () => {
    test('present snapshot seeds cardHistory and state; active is the restored active step', () => {
      const initialEngineState: InitialEngineState = {
        state: { answer: 'yes' },
        cardHistory: [
          { stepId: 'card-a', status: 'completed', stateSnapshot: {} },
          { stepId: 'card-b', status: 'active', stateSnapshot: {} }
        ]
      }

      render(
        <FlowEngineProvider flow={testFlow} initialEngineState={initialEngineState}>
          <TestHarness>
            <CardStack />
            <CompleteProbe />
          </TestHarness>
        </FlowEngineProvider>
      )

      expect(screen.getByTestId('active')).toHaveTextContent('card-b')
      expect(screen.getByTestId('history-len')).toHaveTextContent('2')
      expect(screen.getByTestId('state-answer')).toHaveTextContent('yes')
      expect(screen.getByTestId('card-card-a')).toHaveAttribute('data-status', 'completed')
      expect(screen.getByTestId('card-card-b')).toHaveAttribute('data-status', 'active')
    })

    test('restored completed step: re-completing it does not push a duplicate completed entry', async () => {
      const initialEngineState: InitialEngineState = {
        state: { answer: 'yes' },
        cardHistory: [
          { stepId: 'card-a', status: 'completed', stateSnapshot: {} },
          { stepId: 'card-b', status: 'active', stateSnapshot: {} }
        ]
      }

      render(
        <FlowEngineProvider flow={testFlow} initialEngineState={initialEngineState}>
          <TestHarness>
            <CardStack />
            <CompleteProbe />
            <EngineStepProbe stepId="card-a" />
          </TestHarness>
        </FlowEngineProvider>
      )

      expect(screen.getByTestId('history-len')).toHaveTextContent('2')

      await userEvent.click(screen.getByTestId('probe-complete-card-a'))

      // No duplicate 'card-b' pushed, card-a stays completed, and its state patch was NOT merged
      // in (terminalRef guarded re-entry before setState ran).
      await waitFor(() => {
        expect(screen.getByTestId('history-len')).toHaveTextContent('2')
        expect(screen.getByTestId('card-card-a')).toHaveAttribute('data-status', 'completed')
        expect(screen.getByTestId('card-card-b')).toHaveAttribute('data-status', 'active')
        expect(screen.getByTestId('state-answer')).toHaveTextContent('yes')
      })
    })

    test("history [{error-a: 'error'}, {error-b: 'active'}]: complete('error-a') is a no-op (error not last is terminal)", async () => {
      const initialEngineState: InitialEngineState = {
        state: {},
        cardHistory: [
          { stepId: 'error-a', status: 'error', stateSnapshot: {} },
          { stepId: 'error-b', status: 'active', stateSnapshot: {} }
        ]
      }

      render(
        <FlowEngineProvider flow={errorRecoveryFlow} initialEngineState={initialEngineState}>
          <TestHarness>
            <CardStack />
            <CompleteProbe />
            <EngineStepProbe stepId="error-a" />
          </TestHarness>
        </FlowEngineProvider>
      )

      expect(screen.getByTestId('history-len')).toHaveTextContent('2')
      expect(within(screen.getByTestId('card-error-a')).getByTestId('restore-status')).toHaveTextContent('error')

      await userEvent.click(screen.getByTestId('probe-complete-error-a'))

      // Swallowed: still 2 entries, error-a still 'error'.
      await waitFor(() => {
        expect(screen.getByTestId('history-len')).toHaveTextContent('2')
        expect(within(screen.getByTestId('card-error-a')).getByTestId('restore-status')).toHaveTextContent('error')
      })
    })

    test("history [{error-a: 'error'}] (last entry): complete('error-a') is NOT swallowed by terminalRef (retry works)", async () => {
      const initialEngineState: InitialEngineState = {
        state: {},
        cardHistory: [{ stepId: 'error-a', status: 'error', stateSnapshot: {} }]
      }

      render(
        <FlowEngineProvider flow={errorRecoveryFlow} initialEngineState={initialEngineState}>
          <TestHarness>
            <CardStack />
            <CompleteProbe />
            <EngineStepProbe stepId="error-a" />
          </TestHarness>
        </FlowEngineProvider>
      )

      expect(screen.getByTestId('history-len')).toHaveTextContent('1')
      expect(within(screen.getByTestId('card-error-a')).getByTestId('restore-status')).toHaveTextContent('error')

      await userEvent.click(screen.getByTestId('probe-complete-error-a'))

      // Not swallowed: transitions to 'completed' and advances to 'error-b'.
      await waitFor(() => {
        expect(within(screen.getByTestId('card-error-a')).getByTestId('restore-status')).toHaveTextContent('completed')
        expect(screen.getByTestId('history-len')).toHaveTextContent('2')
      })
    })

    test('empty cardHistory is treated as omitted: seeds initialStep active with empty state', () => {
      const initialEngineState: InitialEngineState = {
        state: { foo: 'bar' },
        cardHistory: []
      }

      render(
        <FlowEngineProvider flow={testFlow} initialEngineState={initialEngineState}>
          <TestHarness>
            <CardStack />
            <CompleteProbe />
          </TestHarness>
        </FlowEngineProvider>
      )

      expect(screen.getByTestId('active')).toHaveTextContent('card-a')
      expect(screen.getByTestId('history-len')).toHaveTextContent('1')
      expect(screen.getByTestId('state-answer')).toHaveTextContent('')
    })

    test('unknown stepId in cardHistory is treated as omitted: seeds initialStep active', () => {
      const initialEngineState: InitialEngineState = {
        state: { foo: 'bar' },
        cardHistory: [{ stepId: 'not-a-real-step', status: 'active', stateSnapshot: {} }]
      }

      render(
        <FlowEngineProvider flow={testFlow} initialEngineState={initialEngineState}>
          <TestHarness>
            <CardStack />
            <CompleteProbe />
          </TestHarness>
        </FlowEngineProvider>
      )

      expect(screen.getByTestId('active')).toHaveTextContent('card-a')
      expect(screen.getByTestId('history-len')).toHaveTextContent('1')
      expect(screen.getByTestId('state-answer')).toHaveTextContent('')
    })

    test('drawerState and pendingReactivation stay null after hydrate', () => {
      function DrawerAndReactivationProbe() {
        const { drawerState, pendingReactivation } = useEngineContext()
        return (
          <div>
            <span data-testid="drawer-state">{drawerState === null ? 'null' : 'non-null'}</span>
            <span data-testid="pending-reactivation">{pendingReactivation === null ? 'null' : 'non-null'}</span>
          </div>
        )
      }

      const initialEngineState: InitialEngineState = {
        state: { answer: 'yes' },
        cardHistory: [
          { stepId: 'card-a', status: 'completed', stateSnapshot: {} },
          { stepId: 'card-b', status: 'active', stateSnapshot: {} }
        ]
      }

      render(
        <FlowEngineProvider flow={testFlow} initialEngineState={initialEngineState}>
          <TestHarness>
            <CardStack />
            <DrawerAndReactivationProbe />
          </TestHarness>
        </FlowEngineProvider>
      )

      expect(screen.getByTestId('drawer-state')).toHaveTextContent('null')
      expect(screen.getByTestId('pending-reactivation')).toHaveTextContent('null')
    })
  })
})
