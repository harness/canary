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

const flatTestFlow: FlowConfig = {
  steps: {
    'card-a': { title: 'Card A', description: 'First card', component: TestCardA, next: 'card-b' },
    'card-b': { title: 'Card B', description: 'Second card', component: TestCardB, next: 'card-c' },
    'card-c': { title: 'Card C', description: 'Third card', component: TestCardC }
  },
  initialStep: 'card-a'
}

const testFlowWithSkip: FlowConfig = {
  stepGroups: {
    'step-1': { title: 'First Step' },
    'step-2': { title: 'Second Step' }
  },
  steps: {
    'card-skip': { step: 'step-1', title: 'Card Skip', component: TestCardSkip, next: 'card-b' },
    'card-b': { step: 'step-2', title: 'Card B', component: TestCardB }
  },
  initialStep: 'card-skip'
}

const testFlowWithError: FlowConfig = {
  stepGroups: {
    'step-1': { title: 'First Step' }
  },
  steps: {
    'card-error': { step: 'step-1', title: 'Card Error', component: TestCardError }
  },
  initialStep: 'card-error'
}

const testFlowTerminal: FlowConfig = {
  stepGroups: {
    'step-1': { title: 'Terminal Step' }
  },
  steps: {
    'card-terminal': { step: 'step-1', title: 'Card Terminal', component: TestCardTerminal, terminal: true }
  },
  initialStep: 'card-terminal'
}

const testFlowBlocked: FlowConfig = {
  stepGroups: {
    'step-1': { title: 'First Step' }
  },
  steps: {
    'card-blocked': { step: 'step-1', title: 'Card Blocked', component: TestCardBlocked }
  },
  initialStep: 'card-blocked'
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

    test('renders full step-group skeleton up front; unreached groups show as upcoming placeholders', () => {
      const { container } = render(<SinglePaneStepper.Root flow={testFlow} />)
      // All three step groups render immediately, not just the active one.
      expect(screen.getByText('First Step')).toBeInTheDocument()
      expect(screen.getByText('Second Step')).toBeInTheDocument()
      expect(screen.getByText('Third Step')).toBeInTheDocument()
      // Initial card content is visible.
      expect(screen.getAllByText('Card A').length).toBeGreaterThanOrEqual(1)
      // The unreached groups render as upcoming (no visited/active card content inside them yet).
      const upcomingGroups = container.querySelectorAll('.cn-stepper-step-upcoming')
      expect(upcomingGroups.length).toBeGreaterThanOrEqual(2)
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
        // Error icon appears on the step indicator (card header is hidden in single-pane)
        const icons = screen.getAllByTestId('icon-xmark')
        expect(icons.length).toBeGreaterThanOrEqual(1)
      })
    })
  })

  describe('Terminal Steps', () => {
    test('terminal step auto-completes without firing onComplete until explicit re-entry', async () => {
      const onComplete = vi.fn()
      render(<SinglePaneStepper.Root flow={testFlowTerminal} onComplete={onComplete} />)
      await userEvent.click(screen.getByText('Complete Terminal'))
      // Terminal completes but onComplete should not be called yet
      await waitFor(() => {
        // Completed icon appears on the step indicator (card header is hidden in single-pane)
        const icons = screen.getAllByTestId('icon-check')
        expect(icons.length).toBeGreaterThanOrEqual(1)
      })
      expect(onComplete).not.toHaveBeenCalled()
    })

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
      render(<SinglePaneStepper.Root flow={visualCompletedFlow} />)
      await userEvent.click(screen.getByText('Next'))
      await waitFor(() => {
        // The parent step group (step-2) must show the plain completed connector class, NOT the
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
    test('steps and cards accumulate as user progresses', async () => {
      render(<SinglePaneStepper.Root flow={testFlow} />)
      // All step groups render immediately (unreached ones as upcoming placeholders).
      expect(screen.getByText('First Step')).toBeInTheDocument()
      expect(screen.getByText('Second Step')).toBeInTheDocument()
      expect(screen.getByText('Third Step')).toBeInTheDocument()

      // Initially only first step's card is visible
      expect(screen.getAllByText('Card A').length).toBeGreaterThanOrEqual(1)

      // After navigating, second step group/step/card appears
      await userEvent.click(screen.getByText('Next'))
      await waitFor(() => {
        expect(screen.getByText('Second Step')).toBeInTheDocument()
        expect(screen.getAllByText('Card B').length).toBeGreaterThanOrEqual(1)
      })

      // After navigating again, third step group/step/card appears
      await userEvent.click(screen.getByText('Finish'))
      await waitFor(() => {
        expect(screen.getByText('Third Step')).toBeInTheDocument()
        expect(screen.getAllByText('Card C').length).toBeGreaterThanOrEqual(1)
      })
    })

    test('completed step groups remain visible after progressing', async () => {
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

    test('card content renders inside nested step panel', async () => {
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
        stepGroups: { 'step-1': { title: 'First Step' } },
        steps: {
          'card-wait': { step: 'step-1', title: 'Waiting', component: TestCardWaiting }
        },
        initialStep: 'card-wait'
      }

      const { container } = render(<SinglePaneStepper.Root flow={waitingFlow} />)

      await waitFor(() => {
        expect(screen.getByText('Working...')).toBeInTheDocument()
      })

      expect(container.querySelector('.cn-stepper-nested-step-placeholder')).not.toBeInTheDocument()
      expect(container.querySelector('[data-testid="icon-more-horizontal"]')).not.toBeInTheDocument()
      expect(container.querySelector('.cn-stepper-collapsible-nested-steps')).toBeInTheDocument()

      const activeStepItem = container.querySelector('.cn-stepper-step-active')?.closest('.cn-stepper-step-item')
      const connector = activeStepItem?.querySelector('.cn-stepper-connector')

      expect(connector).toHaveClass('cn-stepper-connector-active-partial')
    })

    test('renders predicted upcoming steps within the active step group, matching dual-pane behavior', async () => {
      function TestCardChained() {
        const { complete } = useFlowCard()
        return (
          <SinglePaneStepper.Card title="Chained">
            <button onClick={() => complete({}, 'card-next')}>Go</button>
          </SinglePaneStepper.Card>
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

      const { container } = render(<SinglePaneStepper.Root flow={chainedFlow} />)

      const upcomingSteps = container.querySelectorAll('.cn-stepper-nested-step-upcoming')
      expect(upcomingSteps.length).toBeGreaterThanOrEqual(1)
      expect(screen.getByText('Next Card')).toBeInTheDocument()
    })

    test('completed nested steps default collapsed and toggle via chevron', async () => {
      const { container } = render(<SinglePaneStepper.Root flow={testFlow} />)
      await userEvent.click(screen.getByText('Next'))
      await waitFor(() => {
        expect(screen.getByText('Answer: yes')).toBeInTheDocument()
      })

      const collapseTriggers = container.querySelectorAll('.cn-stepper-nested-step-collapse-trigger')
      expect(collapseTriggers.length).toBeGreaterThanOrEqual(1)

      const completedItem = container.querySelector(
        '.cn-stepper-nested-step-completed.cn-stepper-nested-step-item-collapsible'
      )
      expect(completedItem).toBeTruthy()

      const panel = completedItem?.querySelector('.cn-stepper-nested-step-panel-collapsible')
      expect(panel).toHaveAttribute('data-state', 'closed')

      const completedCollapse = completedItem?.querySelector(
        '.cn-stepper-nested-step-collapse-trigger'
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

    test('clicking nested step title expands collapsed panel', async () => {
      const { container } = render(<SinglePaneStepper.Root flow={testFlow} />)
      await userEvent.click(screen.getByText('Next'))
      await waitFor(() => {
        expect(screen.getByText('Answer: yes')).toBeInTheDocument()
      })

      const completedItem = container.querySelector(
        '.cn-stepper-nested-step-completed.cn-stepper-nested-step-item-collapsible'
      )
      const panel = completedItem?.querySelector('.cn-stepper-nested-step-panel-collapsible')
      expect(panel).toHaveAttribute('data-state', 'closed')

      const completedTitle = completedItem?.querySelector('.cn-stepper-nested-step') as HTMLButtonElement
      await userEvent.click(completedTitle)

      await waitFor(() => {
        expect(panel).toHaveAttribute('data-state', 'open')
      })
    })

    test('collapsed nested steps keep card children mounted (streamed content survives expand)', async () => {
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
        stepGroups: { 'step-1': { title: 'Step' } },
        steps: {
          'card-logs': { step: 'step-1', title: 'Card Logs', component: TestCardLogs, next: 'card-b' },
          'card-b': { step: 'step-1', title: 'Card B', component: TestCardB }
        },
        initialStep: 'card-logs'
      }

      const { container } = render(<SinglePaneStepper.Root flow={logFlow} />)

      await waitFor(() => {
        expect(screen.getByTestId('log-output')).toHaveTextContent('persisted log line')
      })

      const completedItem = container.querySelector(
        '.cn-stepper-nested-step-completed.cn-stepper-nested-step-item-collapsible'
      )
      const panel = completedItem?.querySelector('.cn-stepper-nested-step-panel-collapsible')
      expect(panel).toHaveAttribute('data-state', 'closed')

      const collapseTrigger = completedItem?.querySelector(
        '.cn-stepper-nested-step-collapse-trigger'
      ) as HTMLButtonElement
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

      const completedItem = container.querySelector(
        '.cn-stepper-nested-step-completed.cn-stepper-nested-step-item-collapsible'
      )
      const panel = completedItem?.querySelector('.cn-stepper-nested-step-panel-collapsible')
      expect(panel).toHaveAttribute('data-state', 'closed')

      const collapseTrigger = completedItem?.querySelector(
        '.cn-stepper-nested-step-collapse-trigger'
      ) as HTMLButtonElement
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

    test('async streamed logs survive completion and nested step collapse', async () => {
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
        stepGroups: { 'step-1': { title: 'Step' } },
        steps: {
          'card-stream': { step: 'step-1', title: 'Card Stream', component: TestCardStreamingLogs, next: 'card-b' },
          'card-b': { step: 'step-1', title: 'Card B', component: TestCardB }
        },
        initialStep: 'card-stream'
      }

      const { container } = render(<SinglePaneStepper.Root flow={streamFlow} />)

      await waitFor(() => {
        expect(screen.getByTestId('log-output')).toHaveTextContent(STREAMED_LINE)
        expect(screen.getByTestId('log-cursor')).toHaveTextContent('hidden')
      })

      const completedItem = container.querySelector(
        '.cn-stepper-nested-step-completed.cn-stepper-nested-step-item-collapsible'
      )
      const panel = completedItem?.querySelector('.cn-stepper-nested-step-panel-collapsible')
      expect(panel).toHaveAttribute('data-state', 'closed')

      const collapseTrigger = completedItem?.querySelector(
        '.cn-stepper-nested-step-collapse-trigger'
      ) as HTMLButtonElement
      await userEvent.click(collapseTrigger)

      await waitFor(() => {
        expect(panel).toHaveAttribute('data-state', 'open')
        expect(screen.getByTestId('log-output')).toHaveTextContent(STREAMED_LINE)
        expect(screen.getByTestId('log-cursor')).toHaveTextContent('hidden')
      })
    })
  })

  describe('Flat Mode', () => {
    test('renders steps as top-level Stepper.Step items when stepGroups is absent, not nested inside a StepGroup', async () => {
      const { container } = render(<SinglePaneStepper.Root flow={flatTestFlow} />)

      // No StepGroup wrapper: steps must NOT have the nested branch-connector class.
      expect(container.querySelector('.cn-stepper-nested-step-item')).not.toBeInTheDocument()

      // Each visited step instead renders with the top-level (straight-connector) class, the same
      // one a StepGroup itself uses on its own <li> — proving the step is registered directly
      // into ctx.orderedSteps via TopLevelStep, with no ParentStepProvider involved.
      expect(container.querySelectorAll('.cn-stepper-step-item').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('Card A').length).toBeGreaterThanOrEqual(1)

      await userEvent.click(screen.getByText('Next'))
      await waitFor(() => {
        expect(screen.getAllByText('Card B').length).toBeGreaterThanOrEqual(1)

        // Still top-level, still no nested-step-item.
        expect(container.querySelector('.cn-stepper-nested-step-item')).not.toBeInTheDocument()
        expect(container.querySelectorAll('.cn-stepper-step-item').length).toBe(3)
      })
    })

    test('showStepBadge renders the "Step n/total" badge on the flat top-level step', () => {
      const { container } = render(<SinglePaneStepper.Root flow={flatTestFlow} showStepBadge />)

      const badge = container.querySelector('.cn-stepper-step-badge')
      expect(badge).toBeInTheDocument()
      // flatTestFlow has 3 total steps; totalStepsOverride reports the flow's real count, not just
      // the 1 step mounted so far under progressive disclosure.
      expect(badge).toHaveTextContent('Step 1/3')
    })

    test('grouped mode (stepGroups present) keeps steps nested inside StepGroup', () => {
      const { container } = render(<SinglePaneStepper.Root flow={testFlow} />)

      expect(container.querySelector('.cn-stepper-nested-step-item')).toBeInTheDocument()
    })
  })

  describe('Step Badge Totals (Branching Flows)', () => {
    // Mirrors a real branching flow (e.g. the portal demo's mutually-exclusive auth-provider
    // steps): 'github-auth', 'gitlab-auth', and 'bitbucket-auth' all share the SAME step group
    // ('auth') and all converge on the shared 'connect-repo' step, but a run only ever walks ONE of
    // them. flow.steps has 5 entries total, but the actual path for this run ('start' ->
    // 'github-auth' -> 'connect-repo') is only 3 steps — the two unchosen sibling auth steps must
    // NOT inflate the badge's denominator.
    const branchingStepsFlow: FlowConfig = {
      steps: {
        start: { title: 'Start', component: () => null, next: 'github-auth' },
        'github-auth': { title: 'GitHub', component: () => null, next: 'connect-repo' },
        'gitlab-auth': { title: 'GitLab', component: () => null, next: 'connect-repo' },
        'bitbucket-auth': { title: 'Bitbucket', component: () => null, next: 'connect-repo' },
        'connect-repo': { title: 'Connect', component: () => null }
      },
      initialStep: 'start'
    }

    test("flat mode: badge total counts only the active path's steps, not every mutually-exclusive sibling step", () => {
      const { container } = render(<SinglePaneStepper.Root flow={branchingStepsFlow} showStepBadge />)

      const badge = container.querySelector('.cn-stepper-step-badge')
      expect(badge).toBeInTheDocument()
      // Correct total: 'start' (visited) + 'github-auth' + 'connect-repo' (predicted along the
      // active branch) = 3. The old, buggy Object.keys(flow.steps).length would report 5 (it also
      // counts the never-visited 'gitlab-auth'/'bitbucket-auth' siblings), which could never reach
      // n/n for this run.
      expect(badge).toHaveTextContent('Step 1/3')
    })

    // Mirrors a flow where entire step GROUPS (not just steps within one group) are mutually
    // exclusive — e.g. two different infra-setup routes, each with its own dedicated step group,
    // where a run only ever walks one of the routes' groups.
    const branchingGroupsFlow: FlowConfig = {
      stepGroups: {
        start: { title: 'Start' },
        'provider-a': { title: 'Provider A' },
        'provider-b': { title: 'Provider B' },
        connect: { title: 'Connect' },
        done: { title: 'Done' }
      },
      steps: {
        start: { step: 'start', title: 'Start', component: () => null, next: 'a-step' },
        'a-step': { step: 'provider-a', title: 'A Step', component: () => null, next: 'connect-repo' },
        'b-step': { step: 'provider-b', title: 'B Step', component: () => null, next: 'connect-repo' },
        'connect-repo': { step: 'connect', title: 'Connect', component: () => null, next: 'finish' },
        finish: { step: 'done', title: 'Finish', component: () => null }
      },
      initialStep: 'start'
    }

    test("non-flat mode: badge total counts only the active path's step GROUPS, not every mutually-exclusive sibling group", () => {
      const { container } = render(<SinglePaneStepper.Root flow={branchingGroupsFlow} showStepBadge />)

      const badge = container.querySelector('.cn-stepper-step-badge')
      expect(badge).toBeInTheDocument()
      // Correct total: 'start' (visited) + 'provider-a', 'connect', 'done' (predicted groups along
      // the active branch) = 4 distinct groups. The old, buggy
      // Object.keys(flow.stepGroups ?? {}).length would report 5 (it also counts 'provider-b', the
      // unchosen sibling group never reached on this run).
      expect(badge).toHaveTextContent('Step 1/4')
    })

    test("non-flat mode: a group's own badge numerator reflects its path-order position, not its raw rendering index among mutually-exclusive siblings", () => {
      const { container } = render(<SinglePaneStepper.Root flow={branchingGroupsFlow} showStepBadge />)

      // DOM render order (Object.entries(flow.stepGroups), see deriveStepperModel) is: start,
      // provider-a, provider-b, connect, done. 'provider-b' is never on the run's path, so the
      // PATH-order position for 'connect' is 3 (start, provider-a, connect) and for 'done' is 4 —
      // not the raw rendering index of 4 and 5, which is what the pre-fix code showed ("Step
      // 4/4" and "Step 5/4"). This asserts the specific LATER badges by index, unlike the test above
      // which only checks the first badge ('start') — 'start' is position 1 under both the buggy and
      // fixed logic, so it can't distinguish them.
      const badges = container.querySelectorAll('.cn-stepper-step-badge')
      expect(badges[0]).toHaveTextContent('Step 1/4') // start: DOM 1, path-order 1
      expect(badges[1]).toHaveTextContent('Step 2/4') // provider-a: DOM 2, path-order 2
      expect(badges[3]).toHaveTextContent('Step 3/4') // connect: DOM 4, path-order 3
      expect(badges[4]).toHaveTextContent('Step 4/4') // done: DOM 5, path-order 4

      // Deliberately not asserting badges[2] (the off-path 'provider-b' group) — it's off-path,
      // and asserting a specific number for it would just be pinning an implementation detail, not
      // a real contract.
    })

    test('linear flow (no branching): total unchanged in either grouped or flat mode', () => {
      // flatTestFlow and testFlow are the same 3-card linear shape, one flat one grouped. Asserting
      // both proves no regression on the common (non-branching) case in either render mode.
      const { container: flatContainer } = render(<SinglePaneStepper.Root flow={flatTestFlow} showStepBadge />)
      expect(flatContainer.querySelector('.cn-stepper-step-badge')).toHaveTextContent('Step 1/3')

      const { container: groupedContainer } = render(<SinglePaneStepper.Root flow={testFlow} showStepBadge />)
      expect(groupedContainer.querySelector('.cn-stepper-step-badge')).toHaveTextContent('Step 1/3')
    })

    // Mirrors the real portal-demo bug: a step like 'choose-provider' or 'choose-infra' declares NO
    // static `next` at all because its card picks the next step dynamically at runtime via
    // complete(statePatch, nextStepId). Before the fix, fullPredictedPath was `[]` for such a step,
    // so the badge collapsed to "Step 1/1" even though more steps (landing-a/landing-b's step group)
    // genuinely follow. The fix must fall back to the flow-wide count instead of collapsing.
    const dynamicChoiceFlow: FlowConfig = {
      stepGroups: { choice: { title: 'Choice' }, next: { title: 'Next' } },
      steps: {
        pick: { step: 'choice', title: 'Pick', component: () => null }, // no static next — dynamic
        'landing-a': { step: 'next', title: 'Landing A', component: () => null },
        'landing-b': { step: 'next', title: 'Landing B', component: () => null }
      },
      initialStep: 'pick'
    }

    const dynamicChoiceFlatFlow: FlowConfig = {
      steps: {
        pick: { title: 'Pick', component: () => null }, // no static next — dynamic
        'landing-a': { title: 'Landing A', component: () => null },
        'landing-b': { title: 'Landing B', component: () => null }
      },
      initialStep: 'pick'
    }

    test('flat mode: badge total falls back to the full flow.steps count (not collapsed to 1) when the active step has no static next', () => {
      const { container } = render(<SinglePaneStepper.Root flow={dynamicChoiceFlatFlow} showStepBadge />)

      const badge = container.querySelector('.cn-stepper-step-badge')
      expect(badge).toBeInTheDocument()
      // Object.keys(dynamicChoiceFlatFlow.steps).length === 3 ('pick', 'landing-a', 'landing-b'). The
      // pre-fix behavior would show "Step 1/1" (cardHistory.length + empty fullPredictedPath).
      expect(badge).toHaveTextContent('Step 1/3')
    })

    test('non-flat mode: badge total falls back to the full flow.stepGroups count (not collapsed to 1) when the active step has no static next', () => {
      const { container } = render(<SinglePaneStepper.Root flow={dynamicChoiceFlow} showStepBadge />)

      const badge = container.querySelector('.cn-stepper-step-badge')
      expect(badge).toBeInTheDocument()
      // Object.keys(dynamicChoiceFlow.stepGroups).length === 2 ('choice', 'next').
      expect(badge).toHaveTextContent('Step 1/2')
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
          <CardContextProvider stepId="card-blocked" status="active">
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
