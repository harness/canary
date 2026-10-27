import React, { useState } from 'react'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'

import { useEngineContext, useFlowCard, type DrawerComponentProps, type FlowConfig } from '../../flow-stepper/engine'
import { SinglePaneStepperV2 } from '../index'

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

vi.mock('@components/copy-button', () => ({
  CopyButton: ({ name }: { name: string }) => <button type="button">Copy {name}</button>
}))

function FlagGoalCard() {
  const { complete } = useFlowCard()
  return (
    <SinglePaneStepperV2.Card
      title="What do you want your first flag to do?"
      description="In a sentence or two, describe what functionality you want your first feature flag to control."
    >
      <button
        onClick={() =>
          complete({
            answer: 'Switch a Sign Up button from blue to green, or change its copy, for a subset of users.'
          })
        }
      >
        Continue
      </button>
    </SinglePaneStepperV2.Card>
  )
}

function TargetingCard() {
  const { state, complete } = useFlowCard()
  return (
    <SinglePaneStepperV2.Card title="Who should see the new experience?">
      <span>Previous: {state.answer as string}</span>
      <button onClick={() => complete({ audience: 'subset', answer: 'A subset of users' })}>Finish</button>
    </SinglePaneStepperV2.Card>
  )
}

function ReviewCard() {
  return (
    <SinglePaneStepperV2.Card title="Review and create">
      <span>All done</span>
    </SinglePaneStepperV2.Card>
  )
}

const testFlow: FlowConfig = {
  steps: {
    goal: {
      title: 'What do you want your first flag to do?',
      description: 'Describe the flag',
      component: FlagGoalCard,
      next: 'targeting'
    },
    targeting: {
      title: 'Who should see the new experience?',
      description: 'Choose audience',
      component: TargetingCard,
      next: 'review'
    },
    review: {
      title: 'Review and create',
      description: 'Confirm',
      component: ReviewCard
    }
  },
  initialStep: 'goal'
}

describe('SinglePaneStepperV2', () => {
  test('renders the active question and step badge', () => {
    render(<SinglePaneStepperV2.Root flow={testFlow} title="Create a feature flag" />)

    expect(screen.getByText('What do you want your first flag to do?')).toBeInTheDocument()
    expect(
      screen.getByText('In a sentence or two, describe what functionality you want your first feature flag to control.')
    ).toBeInTheDocument()
    expect(screen.getByText('Step 1/3')).toBeInTheDocument()
    expect(screen.getByText('Create a feature flag')).toBeInTheDocument()
    expect(screen.getByText('Continue')).toBeInTheDocument()
  })

  test('replaces the completed form with a chat message instead of an accordion', async () => {
    render(<SinglePaneStepperV2.Root flow={testFlow} />)

    await userEvent.click(screen.getByText('Continue'))

    await waitFor(() => {
      expect(
        screen.getByText('Switch a Sign Up button from blue to green, or change its copy, for a subset of users.')
      ).toBeInTheDocument()
    })

    expect(screen.queryByText('Continue')).not.toBeInTheDocument()
    expect(screen.getByText('What do you want your first flag to do?')).toBeInTheDocument()
    expect(screen.getByText('Who should see the new experience?')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Edit this answer' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: 'Copy Switch a Sign Up button from blue to green, or change its copy, for a subset of users.'
      })
    ).toBeInTheDocument()
  })

  test('does not render the form when a completed step has no answer', async () => {
    function SilentCard() {
      const { complete } = useFlowCard()
      return (
        <SinglePaneStepperV2.Card title="Name the flag">
          <button onClick={() => complete({ flagName: 'signup-color' })}>Save</button>
        </SinglePaneStepperV2.Card>
      )
    }

    const flow: FlowConfig = {
      steps: {
        name: {
          title: 'Name the flag',
          component: SilentCard
        }
      },
      initialStep: 'name'
    }

    render(<SinglePaneStepperV2.Root flow={flow} />)
    await userEvent.click(screen.getByText('Save'))

    await waitFor(() => {
      expect(screen.queryByText('Save')).not.toBeInTheDocument()
    })
    expect(screen.getByText('Name the flag')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Edit this answer' })).not.toBeInTheDocument()
  })

  test('does not repeat the previous answer when a later step completes without one', async () => {
    function FirstCard() {
      const { complete } = useFlowCard()
      return (
        <SinglePaneStepperV2.Card title="First">
          <button onClick={() => complete({ answer: 'from the first step' })}>Next</button>
        </SinglePaneStepperV2.Card>
      )
    }

    function SilentNextCard() {
      const { complete } = useFlowCard()
      return (
        <SinglePaneStepperV2.Card title="Second">
          <button onClick={() => complete({ flagName: 'signup-color' })}>Save</button>
        </SinglePaneStepperV2.Card>
      )
    }

    render(
      <SinglePaneStepperV2.Root
        flow={{
          steps: {
            first: { title: 'First', component: FirstCard, next: 'second' },
            second: { title: 'Second', component: SilentNextCard }
          },
          initialStep: 'first'
        }}
      />
    )

    await userEvent.click(screen.getByRole('button', { name: 'Next' }))
    await userEvent.click(await screen.findByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument()
    })
    expect(screen.getAllByText('from the first step')).toHaveLength(1)
    expect(screen.getAllByRole('button', { name: 'Edit this answer' })).toHaveLength(1)
    expect(screen.getByText('Second')).toBeInTheDocument()
  })

  test('does not render accordion collapse controls on completed steps', async () => {
    const { container } = render(<SinglePaneStepperV2.Root flow={testFlow} />)
    await userEvent.click(screen.getByText('Continue'))

    await waitFor(() => {
      expect(screen.getByText('Who should see the new experience?')).toBeInTheDocument()
    })

    expect(container.querySelector('[data-state]')).not.toBeInTheDocument()
    expect(container.querySelector('.cn-accordion')).toBeNull()
  })

  test('passes accumulated state to the next card', async () => {
    render(<SinglePaneStepperV2.Root flow={testFlow} />)
    await userEvent.click(screen.getByText('Continue'))

    await waitFor(() => {
      expect(
        screen.getByText(
          'Previous: Switch a Sign Up button from blue to green, or change its copy, for a subset of users.'
        )
      ).toBeInTheDocument()
    })
  })

  test('remounts an edited step from its saved snapshot and clears the chat answer', async () => {
    function EditableCard() {
      const { complete } = useFlowCard()
      const { cardHistory } = useEngineContext()
      const entry = cardHistory.find(item => item.stepId === 'goal')
      const snapshotGoal = entry?.stateSnapshot.goal
      const saved = typeof snapshotGoal === 'string' ? snapshotGoal : 'default'
      const [value] = useState(saved)

      return (
        <>
          <span data-testid="goal-answer">{entry?.answer ?? ''}</span>
          <span data-testid="goal-completed-at">{entry?.completedAt ?? ''}</span>
          <SinglePaneStepperV2.Card title="Goal">
            <span data-testid="goal-value">{value}</span>
            <button onClick={() => complete({ goal: 'edited answer', answer: 'edited answer' })}>Continue</button>
          </SinglePaneStepperV2.Card>
        </>
      )
    }

    function NextCard() {
      return (
        <SinglePaneStepperV2.Card title="Next">
          <span>Next form</span>
        </SinglePaneStepperV2.Card>
      )
    }

    const flow: FlowConfig = {
      steps: {
        goal: { title: 'Goal', component: EditableCard, next: 'next' },
        next: { title: 'Next', component: NextCard }
      },
      initialStep: 'goal'
    }

    render(<SinglePaneStepperV2.Root flow={flow} />)
    expect(screen.getByTestId('goal-value')).toHaveTextContent('default')

    await userEvent.click(screen.getByRole('button', { name: 'Continue' }))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Edit this answer' })).toBeInTheDocument()
    })
    expect(screen.getByTestId('goal-answer')).toHaveTextContent('edited answer')
    expect(screen.getByTestId('goal-completed-at').textContent).not.toBe('')

    await userEvent.click(screen.getByRole('button', { name: 'Edit this answer' }))
    await userEvent.click(screen.getByRole('button', { name: 'Confirm' }))

    await waitFor(() => {
      expect(screen.getByTestId('goal-value')).toHaveTextContent('edited answer')
    })
    expect(screen.getByTestId('goal-answer')).toHaveTextContent('')
    expect(screen.getByTestId('goal-completed-at')).toHaveTextContent('')
    expect(screen.queryByRole('button', { name: 'Edit this answer' })).not.toBeInTheDocument()
  })

  test('can go back from a completed chat message and restore the form', async () => {
    render(<SinglePaneStepperV2.Root flow={testFlow} />)
    await userEvent.click(screen.getByText('Continue'))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Edit this answer' })).toBeInTheDocument()
    })

    await userEvent.click(screen.getByRole('button', { name: 'Edit this answer' }))
    await userEvent.click(screen.getByRole('button', { name: 'Confirm' }))

    await waitFor(() => {
      expect(screen.getByText('Continue')).toBeInTheDocument()
    })
    expect(
      screen.queryByText('Switch a Sign Up button from blue to green, or change its copy, for a subset of users.')
    ).not.toBeInTheDocument()
  })

  test('hides upcoming steps and fades the active connector when showInactiveSteps is false', () => {
    const { container } = render(<SinglePaneStepperV2.Root flow={testFlow} showInactiveSteps={false} />)

    expect(screen.queryByText('Who should see the new experience?')).not.toBeInTheDocument()
    expect(screen.queryByText('Review and create')).not.toBeInTheDocument()
    expect(container.querySelector('.cn-single-pane-stepper-v2-card-upcoming')).toBeNull()
    expect(container.querySelector('.cn-single-pane-stepper-v2-connector-fade')).toBeInTheDocument()
  })

  test('badge total follows this run, not every configured step', () => {
    function StartCard() {
      return (
        <SinglePaneStepperV2.Card title="Start">
          <span>Start form</span>
        </SinglePaneStepperV2.Card>
      )
    }
    function PathCard() {
      return <SinglePaneStepperV2.Card title="On the path">Path</SinglePaneStepperV2.Card>
    }
    function OtherCard() {
      return <SinglePaneStepperV2.Card title="Other branch">Other</SinglePaneStepperV2.Card>
    }

    const flow: FlowConfig = {
      steps: {
        start: { title: 'Start', component: StartCard, next: 'path' },
        path: { title: 'On the path', component: PathCard },
        other: { title: 'Other branch', component: OtherCard }
      },
      initialStep: 'start'
    }

    render(<SinglePaneStepperV2.Root flow={flow} />)
    expect(screen.getByText('Step 1/2')).toBeInTheDocument()
    expect(screen.queryByText('Other branch')).not.toBeInTheDocument()
  })

  test('resumes from initialEngineState', () => {
    render(
      <SinglePaneStepperV2.Root
        flow={testFlow}
        initialEngineState={{
          state: { answer: 'restored' },
          cardHistory: [
            {
              stepId: 'goal',
              status: 'completed',
              stateSnapshot: {
                answer: 'Switch a Sign Up button from blue to green, or change its copy, for a subset of users.'
              },
              answer: 'Switch a Sign Up button from blue to green, or change its copy, for a subset of users.'
            },
            { stepId: 'targeting', status: 'active', stateSnapshot: {} }
          ]
        }}
      />
    )
    expect(screen.getByText('Who should see the new experience?')).toBeInTheDocument()
    expect(screen.queryByText('Continue')).not.toBeInTheDocument()
  })

  test('calls onClose from the root header', async () => {
    const onClose = vi.fn()
    render(<SinglePaneStepperV2.Root flow={testFlow} title="Create a feature flag" onClose={onClose} />)
    await userEvent.click(screen.getByLabelText('Close'))
    expect(onClose).toHaveBeenCalled()
  })

  test('hides the step badge when showStepBadge is false', () => {
    render(<SinglePaneStepperV2.Root flow={testFlow} showStepBadge={false} />)
    expect(screen.queryByText('Step 1/3')).not.toBeInTheDocument()
  })

  test('resolves chat text from the card prop, then history, then the snapshot', () => {
    function Question({ answer }: { answer?: string }) {
      return (
        <SinglePaneStepperV2.Card title="Question" answer={answer}>
          <span>form</span>
        </SinglePaneStepperV2.Card>
      )
    }

    function flowFor(component: FlowConfig['steps'][string]['component']): FlowConfig {
      return { steps: { goal: { title: 'Question', component } }, initialStep: 'goal' }
    }

    const withHistory = {
      state: {},
      cardHistory: [
        {
          stepId: 'goal',
          status: 'completed' as const,
          stateSnapshot: { answer: 'from snapshot' },
          answer: 'from history'
        }
      ]
    }

    const { unmount } = render(
      <SinglePaneStepperV2.Root
        flow={flowFor(function PropCard() {
          return <Question answer="from prop" />
        })}
        initialEngineState={withHistory}
      />
    )
    expect(screen.getByText('from prop')).toBeInTheDocument()
    expect(screen.queryByText('from history')).not.toBeInTheDocument()
    unmount()

    const { unmount: unmountEmptyProp } = render(
      <SinglePaneStepperV2.Root
        flow={flowFor(function EmptyPropCard() {
          return <Question answer="" />
        })}
        initialEngineState={withHistory}
      />
    )
    expect(screen.getByText('from history')).toBeInTheDocument()
    unmountEmptyProp()

    const { unmount: unmountHistory } = render(
      <SinglePaneStepperV2.Root
        flow={flowFor(function HistoryCard() {
          return <Question />
        })}
        initialEngineState={withHistory}
      />
    )
    expect(screen.getByText('from history')).toBeInTheDocument()
    expect(screen.queryByText('from snapshot')).not.toBeInTheDocument()
    unmountHistory()

    render(
      <SinglePaneStepperV2.Root
        flow={flowFor(function SnapshotCard() {
          return <Question />
        })}
        initialEngineState={{
          state: {},
          cardHistory: [{ stepId: 'goal', status: 'completed', stateSnapshot: { answer: 'from snapshot' } }]
        }}
      />
    )
    expect(screen.getByText('from snapshot')).toBeInTheDocument()
  })

  test('does not render a chat message for an empty answer string', async () => {
    function EmptyCard() {
      const { complete } = useFlowCard()
      return (
        <SinglePaneStepperV2.Card title="Question">
          <span>Still a form</span>
          <button onClick={() => complete({ answer: '' })}>Save empty</button>
        </SinglePaneStepperV2.Card>
      )
    }

    render(
      <SinglePaneStepperV2.Root
        flow={{ steps: { goal: { title: 'Question', component: EmptyCard } }, initialStep: 'goal' }}
      />
    )
    await userEvent.click(screen.getByRole('button', { name: 'Save empty' }))

    await waitFor(() => {
      expect(screen.queryByText('Still a form')).not.toBeInTheDocument()
    })
    expect(screen.queryByRole('button', { name: 'Edit this answer' })).not.toBeInTheDocument()
  })

  test('keeps the form visible when a step errors', async () => {
    function ErrorCard() {
      const { error } = useFlowCard()
      return (
        <SinglePaneStepperV2.Card title="Risky">
          <span>Still editable</span>
          <button onClick={() => error()}>Fail</button>
        </SinglePaneStepperV2.Card>
      )
    }

    render(
      <SinglePaneStepperV2.Root
        flow={{ steps: { goal: { title: 'Risky', component: ErrorCard } }, initialStep: 'goal' }}
      />
    )
    await userEvent.click(screen.getByRole('button', { name: 'Fail' }))

    expect(screen.getByText('Still editable')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Edit this answer' })).not.toBeInTheDocument()
    expect(screen.getByTestId('icon-xmark-circle')).toBeInTheDocument()
  })

  test('shows a go-back control on a skipped step that is not the end of the thread', async () => {
    function SkipCard() {
      const { skip } = useFlowCard()
      return (
        <SinglePaneStepperV2.Card title="Optional">
          <button onClick={() => skip('after')}>Skip step</button>
        </SinglePaneStepperV2.Card>
      )
    }
    function AfterCard() {
      return (
        <SinglePaneStepperV2.Card title="After">
          <span>After form</span>
        </SinglePaneStepperV2.Card>
      )
    }

    render(
      <SinglePaneStepperV2.Root
        flow={{
          steps: {
            optional: { title: 'Optional', component: SkipCard, next: 'after' },
            after: { title: 'After', component: AfterCard }
          },
          initialStep: 'optional'
        }}
      />
    )
    await userEvent.click(screen.getByRole('button', { name: 'Skip step' }))

    expect(await screen.findByText('Skipped')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go back to this step' })).toBeInTheDocument()
  })

  test('calls onComplete only when complete() re-enters an already terminal step', async () => {
    const onComplete = vi.fn()

    function LastCard() {
      const { complete } = useFlowCard()
      return (
        <SinglePaneStepperV2.Card title="Last">
          <button onClick={() => complete({ answer: 'created' })}>Create</button>
        </SinglePaneStepperV2.Card>
      )
    }

    function Again() {
      const engine = useEngineContext()
      return <button onClick={() => engine.complete('last')}>Finish again</button>
    }

    render(
      <SinglePaneStepperV2.Root
        flow={{ steps: { last: { title: 'Last', component: LastCard } }, initialStep: 'last' }}
        onComplete={onComplete}
      >
        <Again />
      </SinglePaneStepperV2.Root>
    )

    await userEvent.click(screen.getByRole('button', { name: 'Create' }))
    expect(await screen.findByText('created')).toBeInTheDocument()
    expect(onComplete).not.toHaveBeenCalled()

    await userEvent.click(screen.getByRole('button', { name: 'Finish again' }))
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(screen.getByText('created')).toBeInTheDocument()
  })

  test('opens go-back from the timeline indicator and cancels it', async () => {
    render(<SinglePaneStepperV2.Root flow={testFlow} />)
    await userEvent.click(screen.getByText('Continue'))
    await userEvent.click(
      await screen.findByRole('button', { name: 'Go back to What do you want your first flag to do?' })
    )

    expect(screen.getByText('Go back?')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(screen.queryByText('Go back?')).not.toBeInTheDocument()
    expect(screen.getByText('Who should see the new experience?')).toBeInTheDocument()
  })

  test('uses a custom go-back prompt and renders the content header', async () => {
    render(
      <SinglePaneStepperV2.Root
        flow={testFlow}
        icon={<span>Flag</span>}
        onClose={() => undefined}
        contentTitle="Create your first flag"
        contentSubtitle="A short conversation"
        stepperTitle="Steps"
        showStepperHeader
        reactivationPrompt={{ title: 'Leave this answer?', description: 'Later answers will be dropped.' }}
        className="chat-root"
        style={{ minHeight: 12 }}
      />
    )

    expect(screen.getByText('Flag')).toBeInTheDocument()
    expect(screen.getByText('Create your first flag')).toBeInTheDocument()
    expect(screen.getByText('A short conversation')).toBeInTheDocument()
    expect(screen.getByText('Steps')).toBeInTheDocument()
    expect(document.querySelector('.chat-root')).toHaveStyle({ minHeight: '12px' })

    await userEvent.click(screen.getByText('Continue'))
    await userEvent.click(await screen.findByRole('button', { name: 'Edit this answer' }))
    expect(screen.getByText('Leave this answer?')).toBeInTheDocument()
    expect(screen.getByText('Later answers will be dropped.')).toBeInTheDocument()
  })

  test('hides the root header and mounts a registered drawer', async () => {
    function DrawerCard() {
      const { openDrawer } = useFlowCard()
      return (
        <SinglePaneStepperV2.Card title="Connect">
          <button onClick={() => openDrawer('missing')}>Missing drawer</button>
          <button onClick={() => openDrawer('edit', { id: '1' })}>Open drawer</button>
        </SinglePaneStepperV2.Card>
      )
    }
    function EditDrawer({ onClose, props }: DrawerComponentProps) {
      return (
        <div>
          <span>Drawer {String(props?.id)}</span>
          <button onClick={() => onClose({ success: true })}>Close drawer</button>
        </div>
      )
    }

    render(
      <SinglePaneStepperV2.Root
        flow={{ steps: { connect: { title: 'Connect', component: DrawerCard } }, initialStep: 'connect' }}
        title="Hidden title"
        hideHeader
        drawers={{ edit: EditDrawer }}
      />
    )

    expect(screen.queryByText('Hidden title')).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Missing drawer' }))
    expect(screen.queryByText('Drawer 1')).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Open drawer' }))
    expect(await screen.findByText('Drawer 1')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Close drawer' }))
    await waitFor(() => {
      expect(screen.queryByText('Drawer 1')).not.toBeInTheDocument()
    })
  })

  test('labels a completed step by its id when the flow title is empty', async () => {
    function GoalCard() {
      const { complete } = useFlowCard()
      return (
        <SinglePaneStepperV2.Card title="Question">
          <button onClick={() => complete({ answer: 'saved' }, 'next')}>Continue</button>
        </SinglePaneStepperV2.Card>
      )
    }
    function NextCard() {
      return (
        <SinglePaneStepperV2.Card title="Next">
          <span>Next form</span>
        </SinglePaneStepperV2.Card>
      )
    }

    render(
      <SinglePaneStepperV2.Root
        flow={{
          steps: {
            goal: { title: '', component: GoalCard, next: 'next' },
            next: { title: 'Next', component: NextCard }
          },
          initialStep: 'goal'
        }}
      />
    )
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }))
    expect(await screen.findByRole('button', { name: 'Go back to goal' })).toBeInTheDocument()
  })

  test('does not scroll when auto-scroll is disabled', async () => {
    const { container } = render(<SinglePaneStepperV2.Root flow={testFlow} disableAutoScroll />)
    const stack = container.querySelector('.cn-single-pane-stepper-v2-card-stack') as HTMLElement
    Object.defineProperty(stack, 'clientHeight', { configurable: true, value: 200 })

    await new Promise(resolve => setTimeout(resolve, 80))
    expect(stack.style.paddingTop).toBe('')
  })

  test('centers the active step in the stack and a scrolling ancestor', async () => {
    const { container } = render(<SinglePaneStepperV2.Root flow={testFlow} />)
    const stack = container.querySelector('.cn-single-pane-stepper-v2-card-stack') as HTMLElement
    const body = container.querySelector('.cn-single-pane-stepper-v2-body') as HTMLElement
    const card = container.querySelector('[data-card-id="goal"]') as HTMLElement
    const behaviors: Array<ScrollBehavior | undefined> = []

    const install = (el: HTMLElement, height: number, scrollHeight: number, top: number, useScrollTo: boolean) => {
      let scrollTop = 0
      Object.defineProperty(el, 'clientHeight', { configurable: true, get: () => height })
      Object.defineProperty(el, 'scrollHeight', { configurable: true, get: () => scrollHeight })
      Object.defineProperty(el, 'scrollTop', {
        configurable: true,
        get: () => scrollTop,
        set: value => {
          scrollTop = value
        }
      })
      if (useScrollTo) {
        el.scrollTo = ((options?: ScrollToOptions) => {
          behaviors.push(options?.behavior)
          if (typeof options?.top === 'number') scrollTop = options.top
        }) as HTMLElement['scrollTo']
      } else {
        Reflect.deleteProperty(el, 'scrollTo')
      }
      el.getBoundingClientRect = () =>
        ({
          top,
          left: 0,
          right: 100,
          bottom: top + height,
          width: 100,
          height,
          x: 0,
          y: top,
          toJSON: () => ({})
        }) as DOMRect
    }

    install(stack, 200, 800, 0, false)
    install(body, 40, 900, 0, true)
    card.getBoundingClientRect = () =>
      ({
        top: 400,
        left: 0,
        right: 100,
        bottom: 500,
        width: 100,
        height: 100,
        x: 0,
        y: 400,
        toJSON: () => ({})
      }) as DOMRect

    const originalGetComputedStyle = window.getComputedStyle.bind(window)
    const getComputedStyleSpy = vi.spyOn(window, 'getComputedStyle').mockImplementation(node => {
      if (node === body) return { overflowY: 'auto' } as CSSStyleDeclaration
      return originalGetComputedStyle(node)
    })

    await waitFor(() => {
      expect(stack.style.paddingTop).toBe('100px')
    })
    expect(behaviors).toContain('auto')
    expect(body.scrollTop).toBeGreaterThan(0)

    await userEvent.click(screen.getByText('Continue'))
    await waitFor(() => {
      expect(behaviors).toContain('smooth')
    })
    getComputedStyleSpy.mockRestore()
  })

  test('styles the go-back dialog body like v1', async () => {
    render(<SinglePaneStepperV2.Root flow={testFlow} />)
    await userEvent.click(screen.getByText('Continue'))
    await userEvent.click(await screen.findByRole('button', { name: 'Edit this answer' }))

    expect(
      screen.getByText('Going back to this step will discard your progress on subsequent steps. Are you sure?')
    ).toHaveClass('cn-stepper-go-back-body')
  })
})
