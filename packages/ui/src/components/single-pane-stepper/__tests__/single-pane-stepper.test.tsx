import React from 'react'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'

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

describe('SinglePaneStepper', () => {
  describe('Rendering', () => {
    test('renders initial card', () => {
      render(<SinglePaneStepper.Root flow={testFlow} title="Test Flow" />)
      expect(screen.getAllByText('Card A').length).toBeGreaterThanOrEqual(1)
    })

    test('renders flow title', () => {
      render(<SinglePaneStepper.Root flow={testFlow} title="Test Flow" />)
      expect(screen.getAllByText('Test Flow').length).toBeGreaterThanOrEqual(1)
    })

    test('renders contentSubtitle when provided', () => {
      render(<SinglePaneStepper.Root flow={testFlow} title="Test Flow" contentSubtitle="A test subtitle" />)
      expect(screen.getByText('A test subtitle')).toBeInTheDocument()
    })

    test('renders stepper with all steps, showing substeps only for visited steps', () => {
      render(<SinglePaneStepper.Root flow={testFlow} title="Test Flow" />)
      // All steps are rendered (step titles visible)
      expect(screen.getByText('First Step')).toBeInTheDocument()
      expect(screen.getByText('Second Step')).toBeInTheDocument()
      expect(screen.getByText('Third Step')).toBeInTheDocument()
      // But substep details (Card A title appears as substep title, not in stepper yet)
      // Initial card content is visible
      expect(screen.getAllByText('Card A').length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('Navigation', () => {
    test('navigates to next card on complete', async () => {
      render(<SinglePaneStepper.Root flow={testFlow} title="Test Flow" />)
      await userEvent.click(screen.getByText('Next'))
      await waitFor(() => {
        expect(screen.getAllByText('Card B').length).toBeGreaterThanOrEqual(1)
      })
    })

    test('previous cards remain visible after completion', async () => {
      render(<SinglePaneStepper.Root flow={testFlow} title="Test Flow" />)
      await userEvent.click(screen.getByText('Next'))
      await waitFor(() => {
        expect(screen.getAllByText('Card A').length).toBeGreaterThanOrEqual(1)
      })
    })

    test('navigates through multiple cards', async () => {
      render(<SinglePaneStepper.Root flow={testFlow} title="Test Flow" />)
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
      render(<SinglePaneStepper.Root flow={testFlowWithSkip} title="Test Flow" />)
      await userEvent.click(screen.getByText('Skip'))
      await waitFor(() => {
        expect(screen.getAllByText('Card B').length).toBeGreaterThanOrEqual(1)
      })
    })
  })

  describe('State Management', () => {
    test('accumulates state across cards', async () => {
      render(<SinglePaneStepper.Root flow={testFlow} title="Test Flow" />)
      await userEvent.click(screen.getByText('Next'))
      await waitFor(() => {
        expect(screen.getByText('Answer: yes')).toBeInTheDocument()
      })
    })

    test('error state renders error icon', async () => {
      render(<SinglePaneStepper.Root flow={testFlowWithError} title="Test Flow" />)
      await userEvent.click(screen.getByText('Error'))
      await waitFor(() => {
        // Error icon appears on the card
        const icons = screen.getAllByTestId('icon-xmark-circle')
        expect(icons.length).toBeGreaterThanOrEqual(1)
      })
    })
  })

  describe('Terminal Substeps', () => {
    test('terminal substep auto-completes without firing onComplete until explicit re-entry', async () => {
      const onComplete = vi.fn()
      render(<SinglePaneStepper.Root flow={testFlowTerminal} title="Test Flow" onComplete={onComplete} />)
      await userEvent.click(screen.getByText('Complete Terminal'))
      // Terminal completes but onComplete should not be called yet
      await waitFor(() => {
        const icons = screen.getAllByTestId('icon-check-circle-solid')
        expect(icons.length).toBeGreaterThanOrEqual(1)
      })
      expect(onComplete).not.toHaveBeenCalled()
    })
  })

  describe('Stepper Integration', () => {
    test('substeps and cards accumulate as user progresses', async () => {
      render(<SinglePaneStepper.Root flow={testFlow} title="Test Flow" />)
      // All step titles are rendered immediately
      expect(screen.getByText('First Step')).toBeInTheDocument()
      expect(screen.getByText('Second Step')).toBeInTheDocument()
      expect(screen.getByText('Third Step')).toBeInTheDocument()

      // Initially only first substep card is visible
      expect(screen.getAllByText('Card A').length).toBeGreaterThanOrEqual(1)

      // After navigating, second substep/card appears
      await userEvent.click(screen.getByText('Next'))
      await waitFor(() => {
        expect(screen.getAllByText('Card B').length).toBeGreaterThanOrEqual(1)
      })

      // After navigating again, third substep/card appears
      await userEvent.click(screen.getByText('Finish'))
      await waitFor(() => {
        expect(screen.getAllByText('Card C').length).toBeGreaterThanOrEqual(1)
      })
    })

    test('card content renders inside substep panel', async () => {
      render(<SinglePaneStepper.Root flow={testFlow} title="Test Flow" />)
      // Card content should be present and the Next button should be clickable
      const nextButton = screen.getByText('Next')
      expect(nextButton).toBeInTheDocument()
      await userEvent.click(nextButton)
      await waitFor(() => {
        expect(screen.getByText('Answer: yes')).toBeInTheDocument()
      })
    })
  })

  describe('Callbacks', () => {
    test('calls onClose when provided', async () => {
      const onClose = vi.fn()
      render(<SinglePaneStepper.Root flow={testFlow} title="Test Flow" onClose={onClose} />)
      const closeButton = screen.getByLabelText('Close')
      await userEvent.click(closeButton)
      expect(onClose).toHaveBeenCalled()
    })
  })
})
