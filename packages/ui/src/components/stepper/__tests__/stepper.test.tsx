import React from 'react'

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'

import { Stepper } from '../index'

// Mock IconV2 for testing
vi.mock('@components/icon-v2', () => ({
  IconV2: ({ name, className }: { name: string; className?: string }) => (
    <span data-testid={`icon-${name}`} className={className}>
      {name}
    </span>
  ),
  IconV2DisplayName: 'IconV2',
  IconNameMapV2: {}
}))

// Mock Tooltip to avoid context requirements
vi.mock('@components/tooltip', () => ({
  Tooltip: ({ children, content }: { children: React.ReactNode; content: React.ReactNode }) => (
    <span data-tooltip-content={typeof content === 'string' ? content : undefined}>{children}</span>
  ),
  TooltipProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  withTooltip: (Component: React.ComponentType<any>) => Component
}))

function BasicStepper({
  value = 'step1',
  onValueChange = vi.fn(),
  completed = false,
  showConnectors = false,
  title
}: {
  value?: string
  onValueChange?: (v: string) => void
  completed?: boolean
  showConnectors?: boolean
  title?: React.ReactNode
}) {
  return (
    <Stepper.Root
      value={value}
      onValueChange={onValueChange}
      completed={completed}
      showConnectors={showConnectors}
      title={title}
    >
      <Stepper.Step value="step1" title="First Step" />
      <Stepper.Step value="step2" title="Second Step" />
      <Stepper.Step value="step3" title="Third Step" />
    </Stepper.Root>
  )
}

describe('Stepper', () => {
  describe('Registration', () => {
    test('renders correct total count in progress counter', () => {
      render(<BasicStepper value="step1" title="Setup" />)
      expect(screen.getByText('Step 1/3')).toBeInTheDocument()
    })

    test('dynamic mount/unmount updates count', () => {
      function DynamicStepper() {
        const [showThird, setShowThird] = React.useState(true)
        return (
          <>
            <button data-testid="toggle" onClick={() => setShowThird(prev => !prev)}>
              Toggle
            </button>
            <Stepper.Root value="step1" onValueChange={vi.fn()} title="Setup">
              <Stepper.Step value="step1" title="First" />
              <Stepper.Step value="step2" title="Second" />
              {showThird && <Stepper.Step value="step3" title="Third" />}
            </Stepper.Root>
          </>
        )
      }

      render(<DynamicStepper />)
      expect(screen.getByText('Step 1/3')).toBeInTheDocument()

      userEvent.click(screen.getByTestId('toggle'))
      // After unmount, count should update
      return screen.findByText('Step 1/2').then(el => {
        expect(el).toBeInTheDocument()
      })
    })
  })

  describe('State derivation', () => {
    test('active step has active class', () => {
      render(<BasicStepper value="step2" title="Setup" />)
      const buttons = screen.getAllByRole('button')
      expect(buttons[1]).toHaveClass('cn-stepper-step-active')
    })

    test('steps before active have completed class', () => {
      render(<BasicStepper value="step2" title="Setup" />)
      const buttons = screen.getAllByRole('button')
      expect(buttons[0]).toHaveClass('cn-stepper-step-completed')
    })

    test('steps after active have upcoming class', () => {
      render(<BasicStepper value="step2" title="Setup" />)
      const buttons = screen.getAllByRole('button')
      expect(buttons[2]).toHaveClass('cn-stepper-step-upcoming')
    })

    test('explicit error state overrides derived state', () => {
      render(
        <Stepper.Root value="step2" onValueChange={vi.fn()} title="Setup">
          <Stepper.Step value="step1" title="First" state="error" />
          <Stepper.Step value="step2" title="Second" />
          <Stepper.Step value="step3" title="Third" />
        </Stepper.Root>
      )
      const buttons = screen.getAllByRole('button')
      expect(buttons[0]).toHaveClass('cn-stepper-step-error')
    })

    test('explicit skipped state overrides derived state', () => {
      render(
        <Stepper.Root value="step2" onValueChange={vi.fn()} title="Setup">
          <Stepper.Step value="step1" title="First" state="skipped" />
          <Stepper.Step value="step2" title="Second" />
          <Stepper.Step value="step3" title="Third" />
        </Stepper.Root>
      )
      const buttons = screen.getAllByRole('button')
      expect(buttons[0]).toHaveClass('cn-stepper-step-skipped')
    })

    test('completed prop marks all steps as completed', () => {
      render(<BasicStepper value="step1" completed title="Setup" />)
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toHaveClass('cn-stepper-step-completed')
      })
    })

    test('error state is preserved when completed prop is true', () => {
      render(
        <Stepper.Root value="step1" onValueChange={vi.fn()} completed title="Setup">
          <Stepper.Step value="step1" title="First" state="error" />
          <Stepper.Step value="step2" title="Second" />
        </Stepper.Root>
      )
      const buttons = screen.getAllByRole('button')
      expect(buttons[0]).toHaveClass('cn-stepper-step-error')
      expect(buttons[1]).toHaveClass('cn-stepper-step-completed')
    })

    test('skipped state is preserved when completed prop is true', () => {
      render(
        <Stepper.Root value="step1" onValueChange={vi.fn()} completed title="Setup">
          <Stepper.Step value="step1" title="First" state="skipped" />
          <Stepper.Step value="step2" title="Second" />
        </Stepper.Root>
      )
      const buttons = screen.getAllByRole('button')
      expect(buttons[0]).toHaveClass('cn-stepper-step-skipped')
      expect(buttons[1]).toHaveClass('cn-stepper-step-completed')
    })
  })

  describe('Disabled state', () => {
    test('upcoming steps are disabled', () => {
      render(<BasicStepper value="step1" />)
      const buttons = screen.getAllByRole('button')
      expect(buttons[0]).not.toBeDisabled()
      expect(buttons[1]).toBeDisabled()
      expect(buttons[2]).toBeDisabled()
    })

    test('explicit disabled prop disables a step', () => {
      render(
        <Stepper.Root value="step2" onValueChange={vi.fn()}>
          <Stepper.Step value="step1" title="First" disabled />
          <Stepper.Step value="step2" title="Second" />
          <Stepper.Step value="step3" title="Third" />
        </Stepper.Root>
      )
      const buttons = screen.getAllByRole('button')
      expect(buttons[0]).toBeDisabled()
    })
  })

  describe('Progress counter', () => {
    test('shows correct N/M', () => {
      render(<BasicStepper value="step2" title="Setup" />)
      expect(screen.getByText('Step 2/3')).toBeInTheDocument()
    })

    test('shows "Complete" when completed prop is true', () => {
      render(<BasicStepper value="step1" completed title="Setup" />)
      expect(screen.getByText('Complete')).toBeInTheDocument()
    })
  })

  describe('Indicators', () => {
    test('completed step shows check icon', () => {
      render(<BasicStepper value="step2" />)
      // First step is completed
      expect(screen.getByTestId('icon-check')).toBeInTheDocument()
    })

    test('active step shows step number', () => {
      render(<BasicStepper value="step2" />)
      expect(screen.getByText('2')).toBeInTheDocument()
    })

    test('upcoming step shows step number', () => {
      render(<BasicStepper value="step1" />)
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
    })

    test('error step shows xmark-circle icon', () => {
      render(
        <Stepper.Root value="step2" onValueChange={vi.fn()}>
          <Stepper.Step value="step1" title="First" state="error" />
          <Stepper.Step value="step2" title="Second" />
        </Stepper.Root>
      )
      expect(screen.getByTestId('icon-xmark-circle')).toBeInTheDocument()
    })

    test('active loading step shows spinner', () => {
      render(
        <Stepper.Root value="step1" onValueChange={vi.fn()}>
          <Stepper.Step value="step1" title="First" loading />
          <Stepper.Step value="step2" title="Second" />
        </Stepper.Root>
      )
      const loader = screen.getByTestId('icon-loader')
      expect(loader).toBeInTheDocument()
      expect(loader).toHaveClass('animate-spin')
    })
  })

  describe('Connectors', () => {
    test('rendered when showConnectors=true', () => {
      const { container } = render(<BasicStepper value="step1" showConnectors />)
      const connectors = container.querySelectorAll('.cn-stepper-connector')
      expect(connectors.length).toBe(3)
    })

    test('not rendered when showConnectors=false', () => {
      const { container } = render(<BasicStepper value="step1" showConnectors={false} />)
      const connectors = container.querySelectorAll('.cn-stepper-connector')
      expect(connectors.length).toBe(0)
    })

    test('connector has state class matching step state', () => {
      const { container } = render(<BasicStepper value="step2" showConnectors />)
      const connectors = container.querySelectorAll('.cn-stepper-connector')
      expect(connectors[0]).toHaveClass('cn-stepper-connector-completed')
      expect(connectors[1]).toHaveClass('cn-stepper-connector-active')
      expect(connectors[2]).toHaveClass('cn-stepper-connector-upcoming')
    })

    test('connector shows error state class', () => {
      const { container } = render(
        <Stepper.Root value="step2" onValueChange={vi.fn()}>
          <Stepper.Step value="step1" title="Step 1" state="error" />
          <Stepper.Step value="step2" title="Step 2" />
          <Stepper.Step value="step3" title="Step 3" state="skipped" />
        </Stepper.Root>
      )
      const connectors = container.querySelectorAll('.cn-stepper-connector')
      expect(connectors[0]).toHaveClass('cn-stepper-connector-error')
      expect(connectors[2]).toHaveClass('cn-stepper-connector-skipped')
    })
  })

  describe('SubSteps', () => {
    test('render under active parent', () => {
      render(
        <Stepper.Root value="step1" onValueChange={vi.fn()}>
          <Stepper.Step value="step1" title="First">
            <Stepper.SubStep value="sub1" title="Sub One" />
            <Stepper.SubStep value="sub2" title="Sub Two" />
          </Stepper.Step>
          <Stepper.Step value="step2" title="Second" />
        </Stepper.Root>
      )
      expect(screen.getByText('Sub One')).toBeInTheDocument()
      expect(screen.getByText('Sub Two')).toBeInTheDocument()
    })

    test('hidden when parent is not active', () => {
      render(
        <Stepper.Root value="step2" onValueChange={vi.fn()}>
          <Stepper.Step value="step1" title="First">
            <Stepper.SubStep value="sub1" title="Sub One" />
          </Stepper.Step>
          <Stepper.Step value="step2" title="Second" />
        </Stepper.Root>
      )
      expect(screen.queryByText('Sub One')).not.toBeInTheDocument()
    })

    test('parent is active when value is a substep', () => {
      render(
        <Stepper.Root value="sub1" onValueChange={vi.fn()}>
          <Stepper.Step value="step1" title="First">
            <Stepper.SubStep value="sub1" title="Sub One" />
            <Stepper.SubStep value="sub2" title="Sub Two" />
          </Stepper.Step>
          <Stepper.Step value="step2" title="Second" />
        </Stepper.Root>
      )
      // SubSteps should be visible since parent is active
      expect(screen.getByText('Sub One')).toBeInTheDocument()
      expect(screen.getByText('Sub Two')).toBeInTheDocument()
    })

    test('substeps do not affect N/M counter', () => {
      render(
        <Stepper.Root value="step1" onValueChange={vi.fn()} title="Setup">
          <Stepper.Step value="step1" title="First">
            <Stepper.SubStep value="sub1" title="Sub One" />
            <Stepper.SubStep value="sub2" title="Sub Two" />
          </Stepper.Step>
          <Stepper.Step value="step2" title="Second" />
        </Stepper.Root>
      )
      expect(screen.getByText('Step 1/2')).toBeInTheDocument()
    })

    test('placeholder rendered when hasSubSteps with no children', () => {
      const { container } = render(
        <Stepper.Root value="step1" onValueChange={vi.fn()}>
          <Stepper.Step value="step1" title="First" hasSubSteps />
          <Stepper.Step value="step2" title="Second" />
        </Stepper.Root>
      )
      expect(container.querySelector('.cn-stepper-substep-placeholder')).toBeInTheDocument()
    })

    test('substep shows explicit state classes', () => {
      const { container } = render(
        <Stepper.Root value="sub2" onValueChange={vi.fn()}>
          <Stepper.Step value="step1" title="First">
            <Stepper.SubStep value="sub1" title="Sub One" state="completed" />
            <Stepper.SubStep value="sub2" title="Sub Two" state="active" />
            <Stepper.SubStep value="sub3" title="Sub Three" state="error" />
            <Stepper.SubStep value="sub4" title="Sub Four" state="upcoming" />
          </Stepper.Step>
        </Stepper.Root>
      )
      expect(container.querySelector('.cn-stepper-substep-completed')).toBeInTheDocument()
      expect(container.querySelector('.cn-stepper-substep-active')).toBeInTheDocument()
      expect(container.querySelector('.cn-stepper-substep-error')).toBeInTheDocument()
      expect(container.querySelector('.cn-stepper-substep-upcoming')).toBeInTheDocument()
    })

    test('substep branch and indicator have state-specific styling', () => {
      const { container } = render(
        <Stepper.Root value="sub2" onValueChange={vi.fn()}>
          <Stepper.Step value="step1" title="First">
            <Stepper.SubStep value="sub1" title="Sub One" state="completed" />
            <Stepper.SubStep value="sub2" title="Sub Two" state="active" />
            <Stepper.SubStep value="sub3" title="Sub Three" state="error" />
            <Stepper.SubStep value="sub4" title="Sub Four" state="upcoming" />
          </Stepper.Step>
        </Stepper.Root>
      )
      // Verify branch elements render within state containers
      expect(container.querySelector('.cn-stepper-substep-completed .cn-stepper-substep-branch')).toBeInTheDocument()
      expect(container.querySelector('.cn-stepper-substep-active .cn-stepper-substep-branch')).toBeInTheDocument()
      expect(container.querySelector('.cn-stepper-substep-error .cn-stepper-substep-branch')).toBeInTheDocument()
      expect(container.querySelector('.cn-stepper-substep-upcoming .cn-stepper-substep-branch')).toBeInTheDocument()
      // Verify indicator elements render within state containers
      expect(container.querySelector('.cn-stepper-substep-completed .cn-stepper-substep-indicator')).toBeInTheDocument()
      expect(container.querySelector('.cn-stepper-substep-active .cn-stepper-substep-indicator')).toBeInTheDocument()
      expect(container.querySelector('.cn-stepper-substep-error .cn-stepper-substep-indicator')).toBeInTheDocument()
      expect(container.querySelector('.cn-stepper-substep-upcoming .cn-stepper-substep-indicator')).toBeInTheDocument()
    })
  })

  describe('Active substep unmount falls back to parent', () => {
    test('calls onValueChange with parent when active substep unmounts', async () => {
      const onValueChange = vi.fn()

      function TestComponent() {
        const [showSub, setShowSub] = React.useState(true)
        return (
          <>
            <button data-testid="remove-sub" onClick={() => setShowSub(false)}>
              Remove
            </button>
            <Stepper.Root value="sub1" onValueChange={onValueChange}>
              <Stepper.Step value="step1" title="First">
                {showSub && <Stepper.SubStep value="sub1" title="Sub One" />}
                <Stepper.SubStep value="sub2" title="Sub Two" />
              </Stepper.Step>
              <Stepper.Step value="step2" title="Second" />
            </Stepper.Root>
          </>
        )
      }

      render(<TestComponent />)
      await userEvent.click(screen.getByTestId('remove-sub'))
      await waitFor(() => {
        expect(onValueChange).toHaveBeenCalledWith('step1')
      })
    })
  })

  describe('Navigation', () => {
    test('clicking a completed step calls onValueChange', async () => {
      const onValueChange = vi.fn()

      render(
        <Stepper.Root value="step2" onValueChange={onValueChange}>
          <Stepper.Step value="step1" title="First" />
          <Stepper.Step value="step2" title="Second" />
        </Stepper.Root>
      )

      await userEvent.click(screen.getAllByRole('button')[0])
      expect(onValueChange).toHaveBeenCalledWith('step1')
    })

    test('clicking an upcoming step does nothing', async () => {
      const onValueChange = vi.fn()

      render(
        <Stepper.Root value="step1" onValueChange={onValueChange}>
          <Stepper.Step value="step1" title="First" />
          <Stepper.Step value="step2" title="Second" />
        </Stepper.Root>
      )

      await userEvent.click(screen.getAllByRole('button')[1])
      expect(onValueChange).not.toHaveBeenCalled()
    })

    test('clicking a disabled step does nothing', async () => {
      const onValueChange = vi.fn()

      render(
        <Stepper.Root value="step2" onValueChange={onValueChange}>
          <Stepper.Step value="step1" title="First" disabled />
          <Stepper.Step value="step2" title="Second" />
        </Stepper.Root>
      )

      await userEvent.click(screen.getAllByRole('button')[0])
      expect(onValueChange).not.toHaveBeenCalled()
    })
  })

  describe('Navigation Guard', () => {
    test('onBeforeChange returning true allows navigation', async () => {
      const onValueChange = vi.fn()
      const onBeforeChange = vi.fn().mockReturnValue(true)

      render(
        <Stepper.Root value="step2" onValueChange={onValueChange} onBeforeChange={onBeforeChange}>
          <Stepper.Step value="step1" title="First" />
          <Stepper.Step value="step2" title="Second" />
        </Stepper.Root>
      )

      await userEvent.click(screen.getAllByRole('button')[0])
      expect(onBeforeChange).toHaveBeenCalledWith('step2', 'step1')
      expect(onValueChange).toHaveBeenCalledWith('step1')
    })

    test('onBeforeChange returning false blocks silently', async () => {
      const onValueChange = vi.fn()
      const onBeforeChange = vi.fn().mockReturnValue(false)

      render(
        <Stepper.Root value="step2" onValueChange={onValueChange} onBeforeChange={onBeforeChange}>
          <Stepper.Step value="step1" title="First" />
          <Stepper.Step value="step2" title="Second" />
        </Stepper.Root>
      )

      await userEvent.click(screen.getAllByRole('button')[0])
      expect(onBeforeChange).toHaveBeenCalledWith('step2', 'step1')
      expect(onValueChange).not.toHaveBeenCalled()
    })

    test('onBeforeChange returning string shows confirmation dialog', async () => {
      const onValueChange = vi.fn()
      const onBeforeChange = vi.fn().mockReturnValue('Are you sure?')

      render(
        <Stepper.Root value="step2" onValueChange={onValueChange} onBeforeChange={onBeforeChange}>
          <Stepper.Step value="step1" title="First" />
          <Stepper.Step value="step2" title="Second" />
        </Stepper.Root>
      )

      await userEvent.click(screen.getAllByRole('button')[0])
      expect(await screen.findByText('Are you sure?')).toBeInTheDocument()
      expect(onValueChange).not.toHaveBeenCalled()
    })

    test('confirming dialog proceeds with navigation', async () => {
      const onValueChange = vi.fn()
      const onBeforeChange = vi.fn().mockReturnValue('Are you sure?')

      render(
        <Stepper.Root value="step2" onValueChange={onValueChange} onBeforeChange={onBeforeChange}>
          <Stepper.Step value="step1" title="First" />
          <Stepper.Step value="step2" title="Second" />
        </Stepper.Root>
      )

      await userEvent.click(screen.getAllByRole('button')[0])
      const confirmBtn = await screen.findByRole('button', { name: /confirm/i })
      await userEvent.click(confirmBtn)
      expect(onValueChange).toHaveBeenCalledWith('step1')
    })

    test('canceling dialog blocks navigation', async () => {
      const onValueChange = vi.fn()
      const onBeforeChange = vi.fn().mockReturnValue('Are you sure?')

      render(
        <Stepper.Root value="step2" onValueChange={onValueChange} onBeforeChange={onBeforeChange}>
          <Stepper.Step value="step1" title="First" />
          <Stepper.Step value="step2" title="Second" />
        </Stepper.Root>
      )

      await userEvent.click(screen.getAllByRole('button')[0])
      const cancelBtn = await screen.findByRole('button', { name: /cancel/i })
      await userEvent.click(cancelBtn)
      expect(onValueChange).not.toHaveBeenCalled()
    })
  })

  describe('Blocking', () => {
    test('steps after blocking step are disabled', () => {
      render(
        <Stepper.Root value="step1" onValueChange={vi.fn()}>
          <Stepper.Step value="step1" title="First" blocking />
          <Stepper.Step value="step2" title="Second" />
          <Stepper.Step value="step3" title="Third" />
        </Stepper.Root>
      )
      const buttons = screen.getAllByRole('button')
      expect(buttons[0]).not.toBeDisabled() // blocking step itself is active
      expect(buttons[1]).toBeDisabled() // after blocking
      expect(buttons[2]).toBeDisabled() // after blocking
    })

    test('steps after blocking step have upcoming state', () => {
      render(
        <Stepper.Root value="step1" onValueChange={vi.fn()}>
          <Stepper.Step value="step1" title="First" blocking />
          <Stepper.Step value="step2" title="Second" />
          <Stepper.Step value="step3" title="Third" />
        </Stepper.Root>
      )
      const buttons = screen.getAllByRole('button')
      expect(buttons[1]).toHaveClass('cn-stepper-step-upcoming')
      expect(buttons[2]).toHaveClass('cn-stepper-step-upcoming')
    })
  })

  describe('Keyboard Navigation', () => {
    test('ArrowDown moves focus to next navigable step', () => {
      render(
        <Stepper.Root value="step2" onValueChange={vi.fn()}>
          <Stepper.Step value="step1" title="First" />
          <Stepper.Step value="step2" title="Second" />
          <Stepper.Step value="step3" title="Third" />
        </Stepper.Root>
      )
      const buttons = screen.getAllByRole('button')
      buttons[0].focus()
      fireEvent.keyDown(buttons[0], { key: 'ArrowDown' })
      expect(buttons[1]).toHaveFocus()
    })

    test('ArrowUp moves focus to previous step', () => {
      render(
        <Stepper.Root value="step2" onValueChange={vi.fn()}>
          <Stepper.Step value="step1" title="First" />
          <Stepper.Step value="step2" title="Second" />
          <Stepper.Step value="step3" title="Third" />
        </Stepper.Root>
      )
      const buttons = screen.getAllByRole('button')
      buttons[1].focus()
      fireEvent.keyDown(buttons[1], { key: 'ArrowUp' })
      expect(buttons[0]).toHaveFocus()
    })

    test('ArrowDown skips disabled steps', () => {
      render(
        <Stepper.Root value="step1" onValueChange={vi.fn()}>
          <Stepper.Step value="step1" title="First" />
          <Stepper.Step value="step2" title="Second" />
          <Stepper.Step value="step3" title="Third" />
        </Stepper.Root>
      )
      // Only step1 is navigable (step2, step3 are upcoming/disabled)
      const buttons = screen.getAllByRole('button')
      buttons[0].focus()
      fireEvent.keyDown(buttons[0], { key: 'ArrowDown' })
      // Should stay on step1 since there's nothing else navigable
      expect(buttons[0]).toHaveFocus()
    })

    test('Home moves to first navigable step', () => {
      render(
        <Stepper.Root value="step3" onValueChange={vi.fn()}>
          <Stepper.Step value="step1" title="First" />
          <Stepper.Step value="step2" title="Second" />
          <Stepper.Step value="step3" title="Third" />
        </Stepper.Root>
      )
      const buttons = screen.getAllByRole('button')
      buttons[2].focus()
      fireEvent.keyDown(buttons[2], { key: 'Home' })
      expect(buttons[0]).toHaveFocus()
    })

    test('End moves to last navigable step', () => {
      render(
        <Stepper.Root value="step3" onValueChange={vi.fn()}>
          <Stepper.Step value="step1" title="First" />
          <Stepper.Step value="step2" title="Second" />
          <Stepper.Step value="step3" title="Third" />
        </Stepper.Root>
      )
      const buttons = screen.getAllByRole('button')
      buttons[0].focus()
      fireEvent.keyDown(buttons[0], { key: 'End' })
      expect(buttons[2]).toHaveFocus()
    })

    test('only active step has tabIndex 0', () => {
      render(
        <Stepper.Root value="step2" onValueChange={vi.fn()}>
          <Stepper.Step value="step1" title="First" />
          <Stepper.Step value="step2" title="Second" />
          <Stepper.Step value="step3" title="Third" />
        </Stepper.Root>
      )
      const buttons = screen.getAllByRole('button')
      expect(buttons[0]).toHaveAttribute('tabindex', '-1')
      expect(buttons[1]).toHaveAttribute('tabindex', '0')
      // buttons[2] is disabled, no tabindex
    })
  })

  describe('Accessibility', () => {
    test('root nav has aria-label', () => {
      render(
        <Stepper.Root value="step1" onValueChange={vi.fn()}>
          <Stepper.Step value="step1" title="First" />
        </Stepper.Root>
      )
      expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Progress steps')
    })

    test('active step has aria-current="step"', () => {
      render(
        <Stepper.Root value="step2" onValueChange={vi.fn()}>
          <Stepper.Step value="step1" title="First" />
          <Stepper.Step value="step2" title="Second" />
        </Stepper.Root>
      )
      const buttons = screen.getAllByRole('button')
      expect(buttons[0]).not.toHaveAttribute('aria-current')
      expect(buttons[1]).toHaveAttribute('aria-current', 'step')
    })

    test('step buttons have descriptive aria-label', () => {
      render(
        <Stepper.Root value="step1" onValueChange={vi.fn()}>
          <Stepper.Step value="step1" title="First Step" />
          <Stepper.Step value="step2" title="Second Step" />
        </Stepper.Root>
      )
      const buttons = screen.getAllByRole('button')
      expect(buttons[0]).toHaveAttribute('aria-label', 'Step 1 of 2: First Step')
      expect(buttons[1]).toHaveAttribute('aria-label', 'Step 2 of 2: Second Step')
    })

    test('disabled step has aria-disabled', () => {
      render(
        <Stepper.Root value="step1" onValueChange={vi.fn()}>
          <Stepper.Step value="step1" title="First" />
          <Stepper.Step value="step2" title="Second" />
        </Stepper.Root>
      )
      const buttons = screen.getAllByRole('button')
      expect(buttons[1]).toHaveAttribute('aria-disabled', 'true')
    })

    test('live region announces step changes', async () => {
      const { container, rerender } = render(
        <Stepper.Root value="step1" onValueChange={vi.fn()}>
          <Stepper.Step value="step1" title="First" />
          <Stepper.Step value="step2" title="Second" />
        </Stepper.Root>
      )

      rerender(
        <Stepper.Root value="step2" onValueChange={vi.fn()}>
          <Stepper.Step value="step1" title="First" />
          <Stepper.Step value="step2" title="Second" />
        </Stepper.Root>
      )

      const liveRegion = container.querySelector('[aria-live="polite"]')
      expect(liveRegion).toHaveTextContent('Step 2 of 2')
    })
  })

  describe('Animation Classes', () => {
    test('forward navigation applies transitioning class', () => {
      const { rerender } = render(
        <Stepper.Root value="step1" onValueChange={vi.fn()}>
          <Stepper.Step value="step1" title="First" />
          <Stepper.Step value="step2" title="Second" />
          <Stepper.Step value="step3" title="Third" />
        </Stepper.Root>
      )

      rerender(
        <Stepper.Root value="step2" onValueChange={vi.fn()}>
          <Stepper.Step value="step1" title="First" />
          <Stepper.Step value="step2" title="Second" />
          <Stepper.Step value="step3" title="Third" />
        </Stepper.Root>
      )

      expect(document.querySelector('.cn-stepper-step-transitioning')).toBeInTheDocument()
    })

    test('backward navigation does NOT apply transitioning class', () => {
      const { rerender } = render(
        <Stepper.Root value="step2" onValueChange={vi.fn()}>
          <Stepper.Step value="step1" title="First" />
          <Stepper.Step value="step2" title="Second" />
          <Stepper.Step value="step3" title="Third" />
        </Stepper.Root>
      )

      rerender(
        <Stepper.Root value="step1" onValueChange={vi.fn()}>
          <Stepper.Step value="step1" title="First" />
          <Stepper.Step value="step2" title="Second" />
          <Stepper.Step value="step3" title="Third" />
        </Stepper.Root>
      )

      expect(document.querySelector('.cn-stepper-step-transitioning')).not.toBeInTheDocument()
    })

    test('no animation on initial mount', () => {
      render(
        <Stepper.Root value="step2" onValueChange={vi.fn()}>
          <Stepper.Step value="step1" title="First" />
          <Stepper.Step value="step2" title="Second" />
        </Stepper.Root>
      )

      expect(document.querySelector('.cn-stepper-step-transitioning')).not.toBeInTheDocument()
    })

    test('animation class removed after 600ms', () => {
      vi.useFakeTimers()

      const { rerender } = render(
        <Stepper.Root value="step1" onValueChange={vi.fn()}>
          <Stepper.Step value="step1" title="First" />
          <Stepper.Step value="step2" title="Second" />
        </Stepper.Root>
      )

      rerender(
        <Stepper.Root value="step2" onValueChange={vi.fn()}>
          <Stepper.Step value="step1" title="First" />
          <Stepper.Step value="step2" title="Second" />
        </Stepper.Root>
      )

      expect(document.querySelector('.cn-stepper-step-transitioning')).toBeInTheDocument()

      act(() => {
        vi.advanceTimersByTime(600)
      })

      expect(document.querySelector('.cn-stepper-step-transitioning')).not.toBeInTheDocument()

      vi.useRealTimers()
    })

    test('list has locked class during animation', () => {
      const { container, rerender } = render(
        <Stepper.Root value="step1" onValueChange={vi.fn()}>
          <Stepper.Step value="step1" title="First" />
          <Stepper.Step value="step2" title="Second" />
        </Stepper.Root>
      )

      rerender(
        <Stepper.Root value="step2" onValueChange={vi.fn()}>
          <Stepper.Step value="step1" title="First" />
          <Stepper.Step value="step2" title="Second" />
        </Stepper.Root>
      )

      expect(container.querySelector('.cn-stepper-list-locked')).toBeInTheDocument()
    })

    test('source step has leaving class, target has entering class', () => {
      const { rerender } = render(
        <Stepper.Root value="step1" onValueChange={vi.fn()}>
          <Stepper.Step value="step1" title="First" />
          <Stepper.Step value="step2" title="Second" />
          <Stepper.Step value="step3" title="Third" />
        </Stepper.Root>
      )

      rerender(
        <Stepper.Root value="step2" onValueChange={vi.fn()}>
          <Stepper.Step value="step1" title="First" />
          <Stepper.Step value="step2" title="Second" />
          <Stepper.Step value="step3" title="Third" />
        </Stepper.Root>
      )

      expect(document.querySelector('.cn-stepper-indicator-leaving')).toBeInTheDocument()
      expect(document.querySelector('.cn-stepper-indicator-entering')).toBeInTheDocument()
    })
  })

  describe('Skeleton State', () => {
    test('renders skeleton rows when no children', () => {
      const { container } = render(<Stepper.Root value="" onValueChange={vi.fn()} title="Setup" />)
      const skeletons = container.querySelectorAll('.cn-stepper-skeleton-item')
      expect(skeletons).toHaveLength(3) // default
    })

    test('respects custom skeletonCount', () => {
      const { container } = render(<Stepper.Root value="" onValueChange={vi.fn()} title="Setup" skeletonCount={5} />)
      const skeletons = container.querySelectorAll('.cn-stepper-skeleton-item')
      expect(skeletons).toHaveLength(5)
    })

    test('skeleton disappears when steps mount', () => {
      const { container, rerender } = render(<Stepper.Root value="" onValueChange={vi.fn()} title="Setup" />)
      expect(container.querySelectorAll('.cn-stepper-skeleton-item')).toHaveLength(3)

      rerender(
        <Stepper.Root value="step1" onValueChange={vi.fn()} title="Setup">
          <Stepper.Step value="step1" title="First" />
        </Stepper.Root>
      )
      expect(container.querySelectorAll('.cn-stepper-skeleton-item')).toHaveLength(0)
    })

    test('title still renders in skeleton state', () => {
      render(<Stepper.Root value="" onValueChange={vi.fn()} title="Setup Wizard" />)
      expect(screen.getByText('Setup Wizard')).toBeInTheDocument()
    })
  })

  describe('Text Overflow', () => {
    test('step title is rendered', () => {
      render(
        <Stepper.Root value="step1" onValueChange={vi.fn()}>
          <Stepper.Step value="step1" title="A very long title" />
        </Stepper.Root>
      )
      expect(screen.getByText('A very long title')).toBeInTheDocument()
      expect(screen.getByText('A very long title').closest('.cn-stepper-step-title')).toBeInTheDocument()
    })

    test('step title has tooltip wrapper with correct content', () => {
      const { container } = render(
        <Stepper.Root value="step1" onValueChange={vi.fn()}>
          <Stepper.Step value="step1" title="A very long title" />
        </Stepper.Root>
      )
      const tooltipWrapper = container.querySelector('[data-tooltip-content="A very long title"]')
      expect(tooltipWrapper).toBeInTheDocument()
    })

    test('substep title has tooltip wrapper', () => {
      const { container } = render(
        <Stepper.Root value="step1" onValueChange={vi.fn()}>
          <Stepper.Step value="step1" title="First">
            <Stepper.SubStep value="sub1" title="A long substep title" />
          </Stepper.Step>
        </Stepper.Root>
      )
      const tooltipWrapper = container.querySelector('[data-tooltip-content="A long substep title"]')
      expect(tooltipWrapper).toBeInTheDocument()
    })
  })
})
