import React from 'react'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'

import { CardContextProvider, FlowEngineProvider } from '../../flow-stepper/engine'
import { FlowStepperCard } from '../../flow-stepper/flow-stepper-card'
import { SinglePaneStepper, useFlowCard } from '../index'
import type { FlowConfig } from '../single-pane-stepper-types'

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
    <SinglePaneStepper.Card title="Card A">
      <button onClick={() => complete({ answer: 'yes' }, 'card-b')}>Next</button>
    </SinglePaneStepper.Card>
  )
}

function TestCardB() {
  const { state, complete } = useFlowCard()
  return (
    <SinglePaneStepper.Card title="Card B">
      <span>Answer: {state.answer as string}</span>
      <button onClick={() => complete({ finished: true }, 'card-c')}>Finish</button>
    </SinglePaneStepper.Card>
  )
}

function TestCardC() {
  return (
    <SinglePaneStepper.Card title="Card C">
      <span>All done</span>
    </SinglePaneStepper.Card>
  )
}

function TestCardSkip() {
  const { skip } = useFlowCard()
  return (
    <SinglePaneStepper.Card title="Card Skip">
      <button onClick={() => skip('card-b')}>Skip</button>
    </SinglePaneStepper.Card>
  )
}

function TestCardError() {
  const { error } = useFlowCard()
  return (
    <SinglePaneStepper.Card title="Card Error">
      <button onClick={() => error()}>Error</button>
    </SinglePaneStepper.Card>
  )
}

function TestCardTerminal() {
  const { complete } = useFlowCard()
  return (
    <SinglePaneStepper.Card title="Card Terminal">
      <button onClick={() => complete({ done: true })}>Complete Terminal</button>
    </SinglePaneStepper.Card>
  )
}

function TestCardBlocked() {
  return (
    <SinglePaneStepper.Card title="Card Blocked" blockedMessage="Select an option to continue">
      <button disabled>Continue</button>
    </SinglePaneStepper.Card>
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

const testFlowWithSkip: FlowConfig = {
  steps: {
    'step-1': { title: 'First Step' },
    'step-2': { title: 'Second Step' }
  },
  subSteps: {
    'card-skip': { step: 'step-1', title: 'Card Skip', component: TestCardSkip, next: 'card-b' },
    'card-b': { step: 'step-2', title: 'Card B', component: TestCardB }
  },
  initialSubStep: 'card-skip'
}

const testFlowWithError: FlowConfig = {
  steps: {
    'step-1': { title: 'First Step' }
  },
  subSteps: {
    'card-error': { step: 'step-1', title: 'Card Error', component: TestCardError }
  },
  initialSubStep: 'card-error'
}

const testFlowTerminal: FlowConfig = {
  steps: {
    'step-1': { title: 'Terminal Step' }
  },
  subSteps: {
    'card-terminal': { step: 'step-1', title: 'Card Terminal', component: TestCardTerminal, terminal: true }
  },
  initialSubStep: 'card-terminal'
}

const testFlowBlocked: FlowConfig = {
  steps: {
    'step-1': { title: 'First Step' }
  },
  subSteps: {
    'card-blocked': { step: 'step-1', title: 'Card Blocked', component: TestCardBlocked }
  },
  initialSubStep: 'card-blocked'
}

describe('SinglePaneStepper', () => {
  describe('Rendering', () => {
    test('renders initial card', () => {
      render(<SinglePaneStepper.Root flow={testFlow} />)
      expect(screen.getAllByText('Card A').length).toBeGreaterThanOrEqual(1)
    })

    test('renders flow title', () => {
      render(<SinglePaneStepper.Root flow={testFlow} title="Test Flow" />)
      expect(screen.getAllByText('Test Flow').length).toBeGreaterThanOrEqual(1)
    })

    test('renders close button when onClose provided', async () => {
      const onClose = vi.fn()
      render(<SinglePaneStepper.Root flow={testFlow} onClose={onClose} />)
      const closeButton = screen.getByRole('button', { name: 'Close' })
      await userEvent.click(closeButton)
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    test('showRootHeader=false hides header even when title provided', () => {
      render(<SinglePaneStepper.Root flow={testFlow} title="Test Flow" showRootHeader={false} />)
      expect(screen.queryByText('Test Flow')).not.toBeInTheDocument()
    })

    test('hideHeader hides header as deprecated alias of showRootHeader={false}', () => {
      render(<SinglePaneStepper.Root flow={testFlow} title="Test Flow" hideHeader />)
      expect(screen.queryByText('Test Flow')).not.toBeInTheDocument()
    })

    test('showRootHeader takes precedence over hideHeader when both are provided', () => {
      render(<SinglePaneStepper.Root flow={testFlow} title="Test Flow" showRootHeader hideHeader />)
      expect(screen.getAllByText('Test Flow').length).toBeGreaterThanOrEqual(1)
    })

    test('renders contentSubtitle when provided', () => {
      render(<SinglePaneStepper.Root flow={testFlow} contentSubtitle="A test subtitle" />)
      expect(screen.getByText('A test subtitle')).toBeInTheDocument()
    })

    test('renders content header inside scroll container', () => {
      const { container } = render(
        <SinglePaneStepper.Root
          flow={testFlow}
          contentTitle="Pipeline Configuration"
          contentSubtitle="Connect your code"
        />
      )
      const root = container.querySelector('.cn-single-pane-stepper-root') as HTMLElement | null
      const scrollContainer = container.querySelector('.cn-single-pane-stepper-card-stack') as HTMLElement | null
      const contentHeader = container.querySelector('.cn-single-pane-stepper-content-header') as HTMLElement | null
      const stepper = container.querySelector('.cn-stepper') as HTMLElement | null

      expect(root).toContainElement(scrollContainer)
      expect(scrollContainer).toContainElement(contentHeader)
      expect(scrollContainer).toContainElement(stepper)
      expect(root?.querySelector(':scope > .cn-single-pane-stepper-content-header')).toBeNull()
      expect(screen.getByText('Pipeline Configuration')).toBeInTheDocument()
      expect(screen.getByText('Connect your code')).toBeInTheDocument()
    })

    test('does not render stepper header when stepperTitle provided without showStepperHeader', () => {
      const { container } = render(<SinglePaneStepper.Root flow={testFlow} stepperTitle="Setup Steps" />)
      expect(container.querySelector('.cn-stepper-header')).not.toBeInTheDocument()
    })

    test('renders stepper header when showStepperHeader and stepperTitle are provided', () => {
      const { container } = render(
        <SinglePaneStepper.Root flow={testFlow} stepperTitle="Setup Steps" showStepperHeader />
      )
      expect(container.querySelector('.cn-stepper-header')).toBeInTheDocument()
      expect(screen.getByText('Setup Steps')).toBeInTheDocument()
    })

    test('does not render stepper header when showStepperHeader without stepperTitle', () => {
      const { container } = render(<SinglePaneStepper.Root flow={testFlow} showStepperHeader />)
      expect(container.querySelector('.cn-stepper-header')).not.toBeInTheDocument()
    })

    test('renders stepper with visited steps only; future steps appear when active', () => {
      render(<SinglePaneStepper.Root flow={testFlow} />)
      // Only the active step is rendered initially
      expect(screen.getByText('First Step')).toBeInTheDocument()
      expect(screen.queryByText('Second Step')).not.toBeInTheDocument()
      expect(screen.queryByText('Third Step')).not.toBeInTheDocument()
      // Initial card content is visible
      expect(screen.getAllByText('Card A').length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('Navigation', () => {
    test('navigates to next card on complete', async () => {
      render(<SinglePaneStepper.Root flow={testFlow} />)
      await userEvent.click(screen.getByText('Next'))
      await waitFor(() => {
        expect(screen.getAllByText('Card B').length).toBeGreaterThanOrEqual(1)
      })
    })

    test('previous cards remain visible after completion', async () => {
      render(<SinglePaneStepper.Root flow={testFlow} />)
      await userEvent.click(screen.getByText('Next'))
      await waitFor(() => {
        expect(screen.getAllByText('Card A').length).toBeGreaterThanOrEqual(1)
      })
    })

    test('navigates through multiple cards', async () => {
      render(<SinglePaneStepper.Root flow={testFlow} />)
      await userEvent.click(screen.getByText('Next'))
      await waitFor(() => {
        expect(screen.getAllByText('Card B').length).toBeGreaterThanOrEqual(1)
      })
      await userEvent.click(screen.getByText('Finish'))
      await waitFor(() => {
        expect(screen.getAllByText('Card C').length).toBeGreaterThanOrEqual(1)
      })
    })

    test('skip advances to next card with skipped status', async () => {
      render(<SinglePaneStepper.Root flow={testFlowWithSkip} />)
      await userEvent.click(screen.getByText('Skip'))
      await waitFor(() => {
        expect(screen.getAllByText('Card B').length).toBeGreaterThanOrEqual(1)
      })
    })
  })

  describe('State Management', () => {
    test('accumulates state across cards', async () => {
      render(<SinglePaneStepper.Root flow={testFlow} />)
      await userEvent.click(screen.getByText('Next'))
      await waitFor(() => {
        expect(screen.getByText('Answer: yes')).toBeInTheDocument()
      })
    })

    test('error state renders error icon', async () => {
      render(<SinglePaneStepper.Root flow={testFlowWithError} />)
      await userEvent.click(screen.getByText('Error'))
      await waitFor(() => {
        // Error icon appears on the substep indicator (card header is hidden in single-pane)
        const icons = screen.getAllByTestId('icon-xmark')
        expect(icons.length).toBeGreaterThanOrEqual(1)
      })
    })
  })

  describe('Terminal Substeps', () => {
    test('terminal substep auto-completes without firing onComplete until explicit re-entry', async () => {
      const onComplete = vi.fn()
      render(<SinglePaneStepper.Root flow={testFlowTerminal} onComplete={onComplete} />)
      await userEvent.click(screen.getByText('Complete Terminal'))
      // Terminal completes but onComplete should not be called yet
      await waitFor(() => {
        // Completed icon appears on the substep indicator (card header is hidden in single-pane)
        const icons = screen.getAllByTestId('icon-check')
        expect(icons.length).toBeGreaterThanOrEqual(1)
      })
      expect(onComplete).not.toHaveBeenCalled()
    })

    test('visualCompleted terminal substep renders parent step as completed (green), not active', async () => {
      const visualCompletedFlow: FlowConfig = {
        steps: { 'step-1': { title: 'First' }, 'step-2': { title: 'Second' } },
        subSteps: {
          // TestCardA/TestCardB hard-code their transition targets ('card-b'/'card-c') rather
          // than reading `next` from the flow config, so the substep ids here must match those
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
        initialSubStep: 'card-a'
      }
      render(<SinglePaneStepper.Root flow={visualCompletedFlow} />)
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

  describe('Stepper Integration', () => {
    test('substeps and cards accumulate as user progresses', async () => {
      render(<SinglePaneStepper.Root flow={testFlow} />)
      // Only the first step is rendered initially
      expect(screen.getByText('First Step')).toBeInTheDocument()
      expect(screen.queryByText('Second Step')).not.toBeInTheDocument()
      expect(screen.queryByText('Third Step')).not.toBeInTheDocument()

      // Initially only first substep card is visible
      expect(screen.getAllByText('Card A').length).toBeGreaterThanOrEqual(1)

      // After navigating, second step/substep/card appears
      await userEvent.click(screen.getByText('Next'))
      await waitFor(() => {
        expect(screen.getByText('Second Step')).toBeInTheDocument()
        expect(screen.getAllByText('Card B').length).toBeGreaterThanOrEqual(1)
      })

      // After navigating again, third step/substep/card appears
      await userEvent.click(screen.getByText('Finish'))
      await waitFor(() => {
        expect(screen.getByText('Third Step')).toBeInTheDocument()
        expect(screen.getAllByText('Card C').length).toBeGreaterThanOrEqual(1)
      })
    })

    test('completed steps remain visible after progressing', async () => {
      render(<SinglePaneStepper.Root flow={testFlow} />)
      await userEvent.click(screen.getByText('Next'))
      await waitFor(() => {
        expect(screen.getByText('First Step')).toBeInTheDocument()
        expect(screen.getByText('Second Step')).toBeInTheDocument()
      })

      await userEvent.click(screen.getByText('Finish'))
      await waitFor(() => {
        expect(screen.getByText('First Step')).toBeInTheDocument()
        expect(screen.getByText('Second Step')).toBeInTheDocument()
        expect(screen.getByText('Third Step')).toBeInTheDocument()
      })
    })

    test('card content renders inside substep panel', async () => {
      render(<SinglePaneStepper.Root flow={testFlow} />)
      // Card content should be present and the Next button should be clickable
      const nextButton = screen.getByText('Next')
      expect(nextButton).toBeInTheDocument()
      await userEvent.click(nextButton)
      await waitFor(() => {
        expect(screen.getByText('Answer: yes')).toBeInTheDocument()
      })
    })

    test('active step hides indeterminate placeholder and caps connector trunk', async () => {
      function TestCardWaiting() {
        return (
          <SinglePaneStepper.Card title="Waiting Card">
            <span>Working...</span>
          </SinglePaneStepper.Card>
        )
      }

      const waitingFlow: FlowConfig = {
        steps: { 'step-1': { title: 'First Step' } },
        subSteps: {
          'card-wait': { step: 'step-1', title: 'Waiting', component: TestCardWaiting }
        },
        initialSubStep: 'card-wait'
      }

      const { container } = render(<SinglePaneStepper.Root flow={waitingFlow} />)

      await waitFor(() => {
        expect(screen.getByText('Working...')).toBeInTheDocument()
      })

      expect(container.querySelector('.cn-stepper-substep-placeholder')).not.toBeInTheDocument()
      expect(container.querySelector('[data-testid="icon-more-horizontal"]')).not.toBeInTheDocument()
      expect(container.querySelector('.cn-stepper-collapsible-substeps')).toBeInTheDocument()

      const activeStepItem = container.querySelector('.cn-stepper-step-active')?.closest('.cn-stepper-step-item')
      const connector = activeStepItem?.querySelector('.cn-stepper-connector')

      expect(connector).toHaveClass('cn-stepper-connector-active-partial')
    })

    test('completed substeps default collapsed and toggle via chevron', async () => {
      const { container } = render(<SinglePaneStepper.Root flow={testFlow} />)
      await userEvent.click(screen.getByText('Next'))
      await waitFor(() => {
        expect(screen.getByText('Answer: yes')).toBeInTheDocument()
      })

      const collapseTriggers = container.querySelectorAll('.cn-stepper-substep-collapse-trigger')
      expect(collapseTriggers.length).toBeGreaterThanOrEqual(1)

      const completedItem = container.querySelector('.cn-stepper-substep-completed.cn-stepper-substep-item-collapsible')
      expect(completedItem).toBeTruthy()

      const panel = completedItem?.querySelector('.cn-stepper-substep-panel-collapsible')
      expect(panel).toHaveAttribute('data-state', 'closed')

      const completedCollapse = completedItem?.querySelector(
        '.cn-stepper-substep-collapse-trigger'
      ) as HTMLButtonElement
      await userEvent.click(completedCollapse)

      await waitFor(() => {
        expect(panel).toHaveAttribute('data-state', 'open')
      })

      await userEvent.click(completedCollapse)

      await waitFor(() => {
        expect(panel).toHaveAttribute('data-state', 'closed')
      })
    })

    test('clicking substep title expands collapsed panel', async () => {
      const { container } = render(<SinglePaneStepper.Root flow={testFlow} />)
      await userEvent.click(screen.getByText('Next'))
      await waitFor(() => {
        expect(screen.getByText('Answer: yes')).toBeInTheDocument()
      })

      const completedItem = container.querySelector('.cn-stepper-substep-completed.cn-stepper-substep-item-collapsible')
      const panel = completedItem?.querySelector('.cn-stepper-substep-panel-collapsible')
      expect(panel).toHaveAttribute('data-state', 'closed')

      const completedTitle = completedItem?.querySelector('.cn-stepper-substep') as HTMLButtonElement
      await userEvent.click(completedTitle)

      await waitFor(() => {
        expect(panel).toHaveAttribute('data-state', 'open')
      })
    })

    test('collapsed substeps keep card children mounted (streamed content survives expand)', async () => {
      function TestCardLogs() {
        const { status, complete } = useFlowCard()
        const [logs, setLogs] = React.useState<string[]>([])

        React.useEffect(() => {
          if (status !== 'active') return
          setLogs(['✓ persisted log line'])
          complete()
        }, [status, complete])

        return (
          <SinglePaneStepper.Card title="Card Logs">
            <span data-testid="log-output">{logs.join(',')}</span>
          </SinglePaneStepper.Card>
        )
      }

      const logFlow: FlowConfig = {
        steps: { 'step-1': { title: 'Step' } },
        subSteps: {
          'card-logs': { step: 'step-1', title: 'Card Logs', component: TestCardLogs, next: 'card-b' },
          'card-b': { step: 'step-1', title: 'Card B', component: TestCardB }
        },
        initialSubStep: 'card-logs'
      }

      const { container } = render(<SinglePaneStepper.Root flow={logFlow} />)

      await waitFor(() => {
        expect(screen.getByTestId('log-output')).toHaveTextContent('persisted log line')
      })

      const completedItem = container.querySelector('.cn-stepper-substep-completed.cn-stepper-substep-item-collapsible')
      const panel = completedItem?.querySelector('.cn-stepper-substep-panel-collapsible')
      expect(panel).toHaveAttribute('data-state', 'closed')

      const collapseTrigger = completedItem?.querySelector('.cn-stepper-substep-collapse-trigger') as HTMLButtonElement
      await userEvent.click(collapseTrigger)

      await waitFor(() => {
        expect(panel).toHaveAttribute('data-state', 'open')
        expect(screen.getByTestId('log-output')).toHaveTextContent('persisted log line')
      })
    })

    test('completed contentOnly card restart button is outside inert wrapper and clickable', async () => {
      const { container } = render(<SinglePaneStepper.Root flow={testFlow} />)
      await userEvent.click(screen.getByText('Next'))
      await waitFor(() => {
        expect(screen.getByText('Answer: yes')).toBeInTheDocument()
      })

      const completedItem = container.querySelector('.cn-stepper-substep-completed.cn-stepper-substep-item-collapsible')
      const panel = completedItem?.querySelector('.cn-stepper-substep-panel-collapsible')
      expect(panel).toHaveAttribute('data-state', 'closed')

      const collapseTrigger = completedItem?.querySelector('.cn-stepper-substep-collapse-trigger') as HTMLButtonElement
      await userEvent.click(collapseTrigger)

      await waitFor(() => {
        expect(panel).toHaveAttribute('data-state', 'open')
      })

      const restartButton = screen.getByRole('button', { name: 'Redo this step' })
      expect(restartButton.closest('[inert]')).toBeNull()

      await userEvent.click(restartButton)

      await waitFor(() => {
        expect(screen.getByText('Go back?')).toBeInTheDocument()
      })
    })

    test('async streamed logs survive completion and substep collapse', async () => {
      const STREAMED_LINE = '✓ endpoint reachable'

      function TestCardStreamingLogs() {
        const { status, complete } = useFlowCard()
        const [logs, setLogs] = React.useState<string[]>([])
        const [done, setDone] = React.useState(false)
        const isInactive = status !== 'active'
        const sequence = ['→ testing connection...', STREAMED_LINE]
        const displayLogs = isInactive ? sequence : logs
        const displayDone = isInactive || done

        React.useEffect(() => {
          if (status !== 'active') return

          setLogs([])
          setDone(false)
          let cancelled = false
          let index = 0

          const tick = () => {
            if (cancelled || index >= sequence.length) {
              if (!cancelled) {
                setDone(true)
                complete()
              }
              return
            }
            setLogs(prev => [...prev, sequence[index++]])
            setTimeout(tick, 20)
          }

          tick()

          return () => {
            cancelled = true
          }
        }, [status, complete])

        return (
          <SinglePaneStepper.Card title="Card Stream">
            <span data-testid="log-output">{displayLogs.join('|')}</span>
            <span data-testid="log-cursor">{displayDone ? 'hidden' : 'visible'}</span>
          </SinglePaneStepper.Card>
        )
      }

      const streamFlow: FlowConfig = {
        steps: { 'step-1': { title: 'Step' } },
        subSteps: {
          'card-stream': { step: 'step-1', title: 'Card Stream', component: TestCardStreamingLogs, next: 'card-b' },
          'card-b': { step: 'step-1', title: 'Card B', component: TestCardB }
        },
        initialSubStep: 'card-stream'
      }

      const { container } = render(<SinglePaneStepper.Root flow={streamFlow} />)

      await waitFor(() => {
        expect(screen.getByTestId('log-output')).toHaveTextContent(STREAMED_LINE)
        expect(screen.getByTestId('log-cursor')).toHaveTextContent('hidden')
      })

      const completedItem = container.querySelector('.cn-stepper-substep-completed.cn-stepper-substep-item-collapsible')
      const panel = completedItem?.querySelector('.cn-stepper-substep-panel-collapsible')
      expect(panel).toHaveAttribute('data-state', 'closed')

      const collapseTrigger = completedItem?.querySelector('.cn-stepper-substep-collapse-trigger') as HTMLButtonElement
      await userEvent.click(collapseTrigger)

      await waitFor(() => {
        expect(panel).toHaveAttribute('data-state', 'open')
        expect(screen.getByTestId('log-output')).toHaveTextContent(STREAMED_LINE)
        expect(screen.getByTestId('log-cursor')).toHaveTextContent('hidden')
      })
    })
  })

  describe('Blocked Message', () => {
    test('renders warning icon and message when blockedMessage is passed (contentOnly)', () => {
      render(<SinglePaneStepper.Root flow={testFlowBlocked} />)

      expect(screen.getByTestId('icon-warning-triangle')).toBeInTheDocument()
      expect(screen.getByText('Select an option to continue')).toBeInTheDocument()
      expect(document.querySelector('.cn-flow-stepper-card-blocked-message')).toBeInTheDocument()
    })

    test('renders blocked message in standard card mode (non-contentOnly)', () => {
      render(
        <FlowEngineProvider flow={testFlowBlocked}>
          <CardContextProvider subStepId="card-blocked" status="active">
            <FlowStepperCard title="Card Blocked" blockedMessage="Select an option to continue">
              <button>Continue</button>
            </FlowStepperCard>
          </CardContextProvider>
        </FlowEngineProvider>
      )

      expect(screen.getByTestId('icon-warning-triangle')).toBeInTheDocument()
      expect(screen.getByText('Select an option to continue')).toBeInTheDocument()
      expect(screen.getByText('Card Blocked')).toBeInTheDocument()
    })
  })
})
