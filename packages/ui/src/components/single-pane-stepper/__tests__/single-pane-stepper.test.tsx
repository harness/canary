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
        // Flagged terminal: this flow's genuine, designed end — required for reachedKnownEnd to
        // correctly report true once the walk reaches it (a step with no `next` that isn't flagged
        // terminal is ambiguous — its real continuation may be decided dynamically at runtime).
        'connect-repo': { title: 'Connect', component: () => null, terminal: true }
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
        // Flagged terminal: this flow's genuine, designed end — required for reachedKnownEnd to
        // correctly report true once the walk reaches it (a step with no `next` that isn't flagged
        // terminal is ambiguous — its real continuation may be decided dynamically at runtime).
        finish: { step: 'done', title: 'Finish', component: () => null, terminal: true }
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

    test("non-flat mode: each group's own badge numerator reflects its path-order position, and off-path sibling groups render no badge at all", () => {
      const { container } = render(<SinglePaneStepper.Root flow={branchingGroupsFlow} showStepBadge />)

      // DOM render order (Object.entries(flow.stepGroups), see deriveStepperModel) is: start,
      // provider-a, provider-b, connect, done. 'provider-b' is never on this run's path, so it gets
      // NO badge at all (a badge for a path this run never walks would be misleading — it could
      // duplicate or exceed an on-path group's number). The remaining 4 badges reflect PATH-order
      // position: start=1, provider-a=2, connect=3, done=4 — not their raw rendering index (which
      // would give connect=4, done=5, the original pre-fix bug).
      const badges = container.querySelectorAll('.cn-stepper-step-badge')
      expect(badges).toHaveLength(4)
      expect(badges[0]).toHaveTextContent('Step 1/4') // start
      expect(badges[1]).toHaveTextContent('Step 2/4') // provider-a
      expect(badges[2]).toHaveTextContent('Step 3/4') // connect
      expect(badges[3]).toHaveTextContent('Step 4/4') // done

      // 'provider-b' itself renders (Task 6 always renders every group), just with no badge.
      expect(screen.getByText('Provider B')).toBeInTheDocument()

      // The off-path row's indicator circle and accessible name must ALSO not claim a step
      // number that could collide with or exceed an on-path group's real number — round 2 only
      // fixed the badge pill; this locks in that the circle number and aria-label got the same
      // treatment.
      const providerBRow = screen.getByText('Provider B').closest('.cn-stepper-step')
      expect(providerBRow).not.toBeNull()
      expect(providerBRow?.querySelector('.cn-stepper-indicator-number')).not.toBeInTheDocument()
      expect(providerBRow).toHaveAttribute('aria-label', 'Provider B')
    })

    // Mirrors a flow where the ACTIVE step has no static `next` — its real destination is decided
    // dynamically at runtime (e.g. a choice made on the step's own card), exactly how platformUI's
    // CDv2 deployment-pipeline-v2 flow behaves. `dynamicNext: true` is the explicit opt-in for this
    // (round 6) — without it, a step with no `next` that also isn't `terminal` is now treated as a
    // genuine, designed end (see single-pane-stepper-card-stack.tsx's pathWalkComplete), not an
    // unresolved one. With it set, deriveFullPredictedPath still can't walk past 'step-one' the same
    // way it always has, but the caller now KNOWS that's because the continuation is dynamic, not
    // because the flow author forgot `terminal`. StepGroups structurally beyond the active one are
    // absent from stepNumberOverrides for that reason — nothing to do with being an off-path sibling
    // — just because the walk hasn't reached them yet. This is the real-world case round 4 fixes:
    // those groups must still show their real sequential number, not the off-path placeholder.
    const dynamicNextFlow: FlowConfig = {
      stepGroups: {
        'group-one': { title: 'Group One' },
        'group-two': { title: 'Group Two' },
        'group-three': { title: 'Group Three' }
      },
      steps: {
        'step-one': { step: 'group-one', title: 'Step One', component: () => null, dynamicNext: true },
        'step-two': { step: 'group-two', title: 'Step Two', component: () => null, next: 'step-three' },
        'step-three': { step: 'group-three', title: 'Step Three', component: () => null }
      },
      initialStep: 'step-one'
    }

    test('non-flat mode: groups beyond an unresolved dynamic-next step keep their real number, not the off-path placeholder', () => {
      render(<SinglePaneStepper.Root flow={dynamicNextFlow} showStepBadge />)

      // 'step-one' (the active step) has no static `next`, so reachedKnownEnd is false and the
      // predicted-path walk never runs past it — stepNumberOverrides only contains 'group-one'.
      // 'group-two' and 'group-three' are absent from the map for reasons that have nothing to do
      // with being off-path siblings (this flow has none), so they must still render a real,
      // sequential circle-number badge — not the empty-circle "no identity" placeholder a
      // genuinely off-path group gets.
      const groupOneRow = screen.getByText('Group One').closest('.cn-stepper-step')
      const groupTwoRow = screen.getByText('Group Two').closest('.cn-stepper-step')
      const groupThreeRow = screen.getByText('Group Three').closest('.cn-stepper-step')

      expect(groupOneRow?.querySelector('.cn-stepper-indicator-number')).toHaveTextContent('1')
      expect(groupTwoRow?.querySelector('.cn-stepper-indicator-number')).toHaveTextContent('2')
      expect(groupThreeRow?.querySelector('.cn-stepper-indicator-number')).toHaveTextContent('3')

      expect(groupOneRow?.querySelector('.cn-stepper-step-badge')).toHaveTextContent('Step 1/3')
      expect(groupTwoRow?.querySelector('.cn-stepper-step-badge')).toHaveTextContent('Step 2/3')
      expect(groupThreeRow?.querySelector('.cn-stepper-step-badge')).toHaveTextContent('Step 3/3')

      expect(groupOneRow).toHaveAttribute('aria-label', 'Step 1 of 3: Group One')
    })

    // Same root cause as dynamicNextFlow above, but the unresolved dynamic-next step is ONE HOP
    // DOWNSTREAM of the active step instead of being the active step itself. 'step-one' (active)
    // DOES have a static `next` ('step-two'), so a predicate that only checks the active step's own
    // `next` (the pre-fix bug) would wrongly conclude reachedKnownEnd: true — even though the walk
    // actually stops at 'step-two' (no static `next`, not terminal) and never confirms 'group-three'
    // is really on the path. reachedKnownEnd must reflect where the WHOLE walk stopped, not just
    // whether the active step's own first hop was static, so 'group-three' must keep its real
    // number here exactly like 'group-two'/'group-three' do in dynamicNextFlow above. `dynamicNext:
    // true` on 'step-two' (round 6) is what marks that stopping point as genuinely unresolved rather
    // than a designed end — see single-pane-stepper-card-stack.tsx's pathWalkComplete.
    const downstreamDynamicNextFlow: FlowConfig = {
      stepGroups: {
        'group-one': { title: 'Group One' },
        'group-two': { title: 'Group Two' },
        'group-three': { title: 'Group Three' }
      },
      steps: {
        'step-one': { step: 'group-one', title: 'Step One', component: () => null, next: 'step-two' },
        'step-two': { step: 'group-two', title: 'Step Two', component: () => null, dynamicNext: true },
        'step-three': { step: 'group-three', title: 'Step Three', component: () => null }
      },
      initialStep: 'step-one'
    }

    test('non-flat mode: a downstream (not active) unresolved dynamic-next step also keeps later groups’ real numbers', () => {
      render(<SinglePaneStepper.Root flow={downstreamDynamicNextFlow} showStepBadge />)

      // 'step-one' (active) has a static next into 'step-two', which itself has no static next —
      // the walk advances one hop then stops there. stepNumberOverrides only contains
      // 'group-one'/'group-two'; 'group-three' is absent for the same "not yet known" reason as
      // dynamicNextFlow's groups, not because it's a genuinely off-path sibling (this flow has
      // none), so it must still render its real, sequential circle-number badge.
      const groupOneRow = screen.getByText('Group One').closest('.cn-stepper-step')
      const groupTwoRow = screen.getByText('Group Two').closest('.cn-stepper-step')
      const groupThreeRow = screen.getByText('Group Three').closest('.cn-stepper-step')

      expect(groupOneRow?.querySelector('.cn-stepper-indicator-number')).toHaveTextContent('1')
      expect(groupTwoRow?.querySelector('.cn-stepper-indicator-number')).toHaveTextContent('2')
      expect(groupThreeRow?.querySelector('.cn-stepper-indicator-number')).toHaveTextContent('3')

      expect(groupOneRow?.querySelector('.cn-stepper-step-badge')).toHaveTextContent('Step 1/3')
      expect(groupTwoRow?.querySelector('.cn-stepper-step-badge')).toHaveTextContent('Step 2/3')
      expect(groupThreeRow?.querySelector('.cn-stepper-step-badge')).toHaveTextContent('Step 3/3')

      expect(groupThreeRow).toHaveAttribute('aria-label', 'Step 3 of 3: Group Three')
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
    // complete(statePatch, nextStepId) — hence `dynamicNext: true` (round 6's explicit opt-in;
    // without it, this would now read as a genuine designed end and tighten instead of falling
    // back — see single-pane-stepper-card-stack.tsx's pathWalkComplete). Before the original fix,
    // fullPredictedPath was `[]` for such a step, so the badge collapsed to "Step 1/1" even though
    // more steps (landing-a/landing-b's step group) genuinely follow. The fix must fall back to the
    // flow-wide count instead of collapsing.
    const dynamicChoiceFlow: FlowConfig = {
      stepGroups: { choice: { title: 'Choice' }, next: { title: 'Next' } },
      steps: {
        pick: { step: 'choice', title: 'Pick', component: () => null, dynamicNext: true }, // no static next — dynamic
        'landing-a': { step: 'next', title: 'Landing A', component: () => null },
        'landing-b': { step: 'next', title: 'Landing B', component: () => null }
      },
      initialStep: 'pick'
    }

    const dynamicChoiceFlatFlow: FlowConfig = {
      steps: {
        pick: { title: 'Pick', component: () => null, dynamicNext: true }, // no static next — dynamic
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

    // Round 6 regression: branchingStepsFlow above but WITHOUT `terminal: true` on the end step —
    // a flow author simply forgot the flag (or never needed it before `dynamicNext` existed).
    // `pathWalkComplete` must still treat this as a genuine, designed end (the stopping step isn't
    // flagged `dynamicNext` either), so the total must stay tight at the real path length — NOT
    // inflate to Object.keys(flow.steps).length like the pre-round-6 bug did.
    const branchingStepsFlowNoTerminal: FlowConfig = {
      steps: {
        start: { title: 'Start', component: () => null, next: 'github-auth' },
        'github-auth': { title: 'GitHub', component: () => null, next: 'connect-repo' },
        'gitlab-auth': { title: 'GitLab', component: () => null, next: 'connect-repo' },
        'bitbucket-auth': { title: 'Bitbucket', component: () => null, next: 'connect-repo' },
        'connect-repo': { title: 'Connect', component: () => null } // no terminal, no dynamicNext
      },
      initialStep: 'start'
    }

    test('flat mode: an unflagged (no terminal) dead end still counts as a genuine end, not an inflated fallback', () => {
      const { container } = render(<SinglePaneStepper.Root flow={branchingStepsFlowNoTerminal} showStepBadge />)

      const badge = container.querySelector('.cn-stepper-step-badge')
      expect(badge).toBeInTheDocument()
      // Same real path length as branchingStepsFlow (3) — omitting `terminal` must not resurrect
      // the "Step 1/5" inflation bug now that `dynamicNext` (not "terminal is missing") is the
      // signal for genuine ambiguity.
      expect(badge).toHaveTextContent('Step 1/3')
    })

    // Round 6 regression: branchingGroupsFlow above but WITHOUT `terminal: true` on 'finish'. Same
    // reasoning as branchingStepsFlowNoTerminal — 'provider-b' must stay hidden (a confirmed
    // off-path sibling, exactly like the terminal:true case) and the total must stay at 4, not
    // inflate to 5 or produce a numerator collision.
    const branchingGroupsFlowNoTerminal: FlowConfig = {
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
        finish: { step: 'done', title: 'Finish', component: () => null } // no terminal, no dynamicNext
      },
      initialStep: 'start'
    }

    test('non-flat mode: an unflagged (no terminal) dead end resolves the map completely — off-path sibling stays hidden, no collision, no inflation', () => {
      const { container } = render(<SinglePaneStepper.Root flow={branchingGroupsFlowNoTerminal} showStepBadge />)

      const badges = container.querySelectorAll('.cn-stepper-step-badge')
      expect(badges).toHaveLength(4)
      expect(badges[0]).toHaveTextContent('Step 1/4') // start
      expect(badges[1]).toHaveTextContent('Step 2/4') // provider-a
      expect(badges[2]).toHaveTextContent('Step 3/4') // connect
      expect(badges[3]).toHaveTextContent('Step 4/4') // done

      // 'provider-b' still renders as a row, just with no badge/number — identical to the
      // terminal:true case, proving omitting `terminal` doesn't resurrect the off-path collision.
      const providerBRow = screen.getByText('Provider B').closest('.cn-stepper-step')
      expect(providerBRow?.querySelector('.cn-stepper-step-badge')).not.toBeInTheDocument()
      expect(providerBRow?.querySelector('.cn-stepper-indicator-number')).not.toBeInTheDocument()
    })

    // Defense-in-depth for the round-6 numerator fix in flow-stepper-rail.tsx (the "global max"
    // fallback), isolated from the dynamicNext/pathWalkComplete fix above. Here the walk genuinely
    // STAYS unresolved (the active step is flagged `dynamicNext`, same as dynamicNextFlow), AND a
    // genuinely off-path sibling group ('group-off-path') renders BETWEEN a group with a real
    // override (group-one=1) and a later group that also lacks one (group-two, group-three).
    // stepNumberOverrides only contains group-one(1) and group-two(2) (from the one static hop
    // 'step-one' -> 'step-two' before the walk stops at 'step-two', which is flagged dynamicNext).
    // The OLD raw-stepIndex+1 fallback would give 'group-off-path' (rendered at index 1) the number
    // 2 — colliding with 'group-two's REAL override, also 2. The fix must give it a number strictly
    // above the highest real override instead.
    const dynamicWithOffPathSiblingFlow: FlowConfig = {
      stepGroups: {
        'group-one': { title: 'Group One' },
        'group-off-path': { title: 'Off Path' },
        'group-two': { title: 'Group Two' },
        'group-three': { title: 'Group Three' }
      },
      steps: {
        'step-one': { step: 'group-one', title: 'Step One', component: () => null, next: 'step-two' },
        'step-off-path': { step: 'group-off-path', title: 'Off Path Step', component: () => null },
        'step-two': { step: 'group-two', title: 'Step Two', component: () => null, dynamicNext: true },
        'step-three': { step: 'group-three', title: 'Step Three', component: () => null }
      },
      initialStep: 'step-one'
    }

    test('non-flat mode: a genuinely off-path sibling rendered between resolved and still-unresolved groups gets a collision-free fallback number', () => {
      render(<SinglePaneStepper.Root flow={dynamicWithOffPathSiblingFlow} showStepBadge />)

      // Real overrides: group-one=1 (cardHistory), group-two=2 (fullPredictedPath's one hop). Both
      // 'group-off-path' and 'group-three' are absent from the map (the walk stopped at 'step-two',
      // flagged dynamicNext, so the map stays incomplete) and must get SYNTHESIZED numbers strictly
      // above the highest real override (2) — group-off-path=3, group-three=4 — never colliding
      // with group-two's real 2, and never repeating 1-4.
      const groupOneRow = screen.getByText('Group One').closest('.cn-stepper-step')
      const offPathRow = screen.getByText('Off Path').closest('.cn-stepper-step')
      const groupTwoRow = screen.getByText('Group Two').closest('.cn-stepper-step')
      const groupThreeRow = screen.getByText('Group Three').closest('.cn-stepper-step')

      expect(groupOneRow?.querySelector('.cn-stepper-step-badge')).toHaveTextContent('Step 1/4')
      expect(offPathRow?.querySelector('.cn-stepper-step-badge')).toHaveTextContent('Step 3/4')
      expect(groupTwoRow?.querySelector('.cn-stepper-step-badge')).toHaveTextContent('Step 2/4')
      expect(groupThreeRow?.querySelector('.cn-stepper-step-badge')).toHaveTextContent('Step 4/4')

      // All four numerators must be distinct — the collision this test guards against.
      const numerators = [groupOneRow, offPathRow, groupTwoRow, groupThreeRow].map(
        row => row?.querySelector('.cn-stepper-step-badge')?.textContent
      )
      expect(new Set(numerators).size).toBe(4)
    })

    // Round 6 follow-up regression: a step can carry BOTH a static `next` (so the walk doesn't stop
    // there) AND `dynamicNext: true`. The old `pathWalkComplete` check only looked at the
    // STOPPED-AT step's own `dynamicNext` flag — here that's 'step-two', a dead end (no `next`, not
    // `terminal`) that lacks the flag — and silently walked straight past 'step-one's flag via its
    // static `next`, as if 'step-one's continuation were fully known. The fix must check
    // `dynamicNext` along the WHOLE walked-plus-predicted path (`[activeStepId, ...fullPredictedPath]`),
    // not just the final stopped-at step, so 'step-one's flag isn't silently ignored.
    const dynamicNextEarlierInPathFlow: FlowConfig = {
      steps: {
        'step-one': { title: 'Step One', component: () => null, next: 'step-two', dynamicNext: true },
        'step-two': { title: 'Step Two', component: () => null }, // dead end: no next, not terminal
        'step-three': { title: 'Step Three', component: () => null } // never reached on this run's path
      },
      initialStep: 'step-one'
    }

    test('flat mode: a static-next step earlier in the path that is ALSO flagged dynamicNext still forces the flow-wide fallback, not the tight walked total', () => {
      const { container } = render(<SinglePaneStepper.Root flow={dynamicNextEarlierInPathFlow} showStepBadge />)

      const badge = container.querySelector('.cn-stepper-step-badge')
      expect(badge).toBeInTheDocument()
      // Walked total: cardHistory (0, nothing completed yet) + fullPredictedPath (['step-two'], the
      // one static hop off 'step-one') = 1. The pre-fix code would report "Step 1/1" here — it only
      // checks 'step-two' (the stopped-at step, which has no dynamicNext), silently ignoring
      // 'step-one's flag because the walk continued past it via a static `next`. The fix must fall
      // back to Object.keys(flow.steps).length = 3 instead, proving the flag is honored wherever it
      // appears on the path, not only at the final stop.
      expect(badge).toHaveTextContent('Step 1/3')
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
