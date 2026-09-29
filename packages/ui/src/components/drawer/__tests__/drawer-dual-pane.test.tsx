import React from 'react'

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

import { Drawer } from '../index'

// Drawer.Steps / Drawer.Step / Drawer.SubStep are thin wrappers over the design-system Stepper
// (Stepper.Root / Stepper.StepGroup / nested Stepper.Step), so the rendered markup is the shared
// `cn-stepper-*` chrome and the state engine is the base Stepper's value-driven derivation. These
// tests exercise that behavior through the drawer's public API.

vi.mock('vaul', () => {
  const DrawerRoot = ({ children, ...props }: any) => (
    <div data-testid="drawer-root" {...props}>
      {children}
    </div>
  )
  DrawerRoot.displayName = 'DrawerRoot'

  const DrawerNestedRoot = ({ children, ...props }: any) => (
    <div data-testid="drawer-nested-root" {...props}>
      {children}
    </div>
  )
  DrawerNestedRoot.displayName = 'DrawerNestedRoot'

  const DrawerTrigger = ({ children, asChild, ...props }: any) =>
    asChild ? (
      <>{children}</>
    ) : (
      <button data-testid="drawer-trigger" type="button" {...props}>
        {children}
      </button>
    )
  DrawerTrigger.displayName = 'DrawerTrigger'

  const DrawerContent = React.forwardRef(({ children, ...props }: any, ref) => (
    <div ref={ref} data-testid="drawer-content" {...props}>
      {children}
    </div>
  ))
  DrawerContent.displayName = 'DrawerContent'

  const DrawerPortal = ({ children }: any) => <div data-testid="drawer-portal">{children}</div>
  DrawerPortal.displayName = 'DrawerPortal'

  const DrawerOverlay = ({ children, ...props }: any) => (
    <div data-testid="drawer-overlay" {...props}>
      {children}
    </div>
  )
  DrawerOverlay.displayName = 'DrawerOverlay'

  const DrawerClose = ({ children, asChild, ...props }: any) =>
    asChild ? (
      <>{children}</>
    ) : (
      <button data-testid="drawer-close" type="button" {...props}>
        {children}
      </button>
    )
  DrawerClose.displayName = 'DrawerClose'

  const DrawerTitleComponent = React.forwardRef<any, any>(({ children, ...props }, ref) => (
    <h2 ref={ref} data-testid="drawer-title" {...props}>
      {children}
    </h2>
  ))
  DrawerTitleComponent.displayName = 'DrawerTitle'

  const DrawerDescriptionComponent = React.forwardRef<any, any>(({ children, ...props }, ref) => (
    <p ref={ref} data-testid="drawer-description" {...props}>
      {children}
    </p>
  ))
  DrawerDescriptionComponent.displayName = 'DrawerDescription'

  return {
    Drawer: {
      Root: DrawerRoot,
      NestedRoot: DrawerNestedRoot,
      Trigger: DrawerTrigger,
      Content: DrawerContent,
      Portal: DrawerPortal,
      Overlay: DrawerOverlay,
      Close: DrawerClose,
      Title: DrawerTitleComponent,
      Description: DrawerDescriptionComponent
    }
  }
})

vi.mock('@/context', async () => {
  const actual = await vi.importActual('@/context')

  return {
    ...actual,
    usePortal: () => ({ portalContainer: document.body }),
    DialogOpenContext: {
      Provider: ({ children }: any) => <>{children}</>
    },
    useRegisterDialog: () => ({ handleCloseAutoFocus: vi.fn() })
  }
})

vi.mock('@/components', async () => {
  const actual = await vi.importActual('@/components')

  const MockScrollArea = React.forwardRef<any, any>(({ children, className, classNameContent, ...props }, ref) => (
    <div ref={ref} data-testid="scroll-area" className={className} {...props}>
      <div className={classNameContent}>{children}</div>
    </div>
  ))
  MockScrollArea.displayName = 'ScrollArea'

  return {
    ...actual,
    ScrollArea: MockScrollArea,
    useScrollArea: () => ({
      isTop: true,
      isBottom: false,
      onScrollTop: vi.fn(),
      onScrollBottom: vi.fn()
    })
  }
})

const renderDualPane = (currentStep: string, onValueChange = vi.fn(), { title }: { title?: React.ReactNode } = {}) =>
  render(
    <Drawer.Root open>
      <Drawer.Content>
        <Drawer.DualPane>
          <Drawer.Steps value={currentStep} onValueChange={onValueChange} title={title}>
            <Drawer.Step value="details" title="Details" description="Basic information" />
            <Drawer.Step value="configuration" title="Configuration" />
            <Drawer.Step value="review" title="Review" description="Confirm before submitting" />
          </Drawer.Steps>
          <Drawer.DualPaneMain>
            <Drawer.Header>
              <Drawer.Title>Main pane title</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <p>Main pane content</p>
            </Drawer.Body>
          </Drawer.DualPaneMain>
        </Drawer.DualPane>
      </Drawer.Content>
    </Drawer.Root>
  )

describe('Drawer dual pane layout', () => {
  test('renders dual-pane structure with independent scroll areas', async () => {
    renderDualPane('details')

    // The rail is the outer navigation landmark; Stepper.Root adds its own "Progress steps" nav.
    expect(screen.getByRole('navigation', { name: 'Drawer steps' })).toBeInTheDocument()
    expect(screen.getByText('Main pane title')).toBeInTheDocument()
    expect(screen.getByText('Main pane content')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getAllByTestId('scroll-area')).toHaveLength(2)
    })
  })

  test('derives active, completed, and upcoming step states', async () => {
    renderDualPane('configuration')

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Step 1 of 3: Details' })).toHaveClass('cn-stepper-step-completed')
      expect(screen.getByRole('button', { name: 'Step 2 of 3: Configuration' })).toHaveClass('cn-stepper-step-active')
      expect(screen.getByRole('button', { name: 'Step 3 of 3: Review' })).toHaveClass('cn-stepper-step-upcoming')
    })
  })

  test('sets aria-current on the active step', async () => {
    renderDualPane('configuration')

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Step 2 of 3: Configuration' })).toHaveAttribute('aria-current', 'step')
    })
  })

  test('renders optional descriptions only when provided', async () => {
    renderDualPane('details')

    await waitFor(() => {
      expect(screen.getByText('Basic information')).toBeInTheDocument()
      expect(
        screen
          .getByText('Configuration')
          .closest('.cn-stepper-step')
          ?.querySelector('.cn-stepper-step-description')
      ).toBeNull()
      expect(screen.getByText('Confirm before submitting')).toBeInTheDocument()
    })
  })

  test('fires onValueChange for completed steps and blocks upcoming steps', async () => {
    const onValueChange = vi.fn()
    renderDualPane('configuration', onValueChange)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Step 1 of 3: Details' })).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Step 1 of 3: Details' }))
    expect(onValueChange).toHaveBeenCalledWith('details')

    // Upcoming steps render as disabled buttons, so clicking them is a no-op.
    fireEvent.click(screen.getByRole('button', { name: 'Step 3 of 3: Review' }))
    expect(onValueChange).toHaveBeenCalledTimes(1)
  })

  test('renders an optional title above the step list', async () => {
    renderDualPane('details', vi.fn(), { title: 'Create new workspace' })

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Create new workspace' })).toBeInTheDocument()
    })
  })

  test('renders a numbered indicator for upcoming and active steps and a check for completed steps', async () => {
    renderDualPane('configuration')

    await waitFor(() => {
      const completedStep = screen.getByRole('button', { name: 'Step 1 of 3: Details' })
      const activeStep = screen.getByRole('button', { name: 'Step 2 of 3: Configuration' })
      const upcomingStep = screen.getByRole('button', { name: 'Step 3 of 3: Review' })

      // Completed steps swap the number for a check icon.
      expect(completedStep.querySelector('.cn-stepper-indicator-number')).toBeNull()
      expect(completedStep.querySelector('.cn-stepper-indicator svg')).not.toBeNull()

      expect(activeStep.querySelector('.cn-stepper-indicator-number')?.textContent).toBe('2')
      expect(upcomingStep.querySelector('.cn-stepper-indicator-number')?.textContent).toBe('3')
    })
  })
})

describe('Drawer.SubStep', () => {
  const renderWithSubsteps = (currentStep: string, onValueChange = vi.fn()) =>
    render(
      <Drawer.Root open>
        <Drawer.Content>
          <Drawer.DualPane>
            <Drawer.Steps value={currentStep} onValueChange={onValueChange} title="Create new workspace">
              <Drawer.Step value="step1" title="Step 1" description="Description" />
              <Drawer.Step value="step2" title="Step 2" description="Description">
                <Drawer.SubStep value="step2.1" title="Step 2.1" />
                <Drawer.SubStep value="step2.2" title="Step 2.2" />
                <Drawer.SubStep value="step2.3" title="Step 2.3" />
              </Drawer.Step>
              <Drawer.Step value="step3" title="Step 3" description="Description" />
            </Drawer.Steps>
            <Drawer.DualPaneMain>
              <Drawer.Body>
                <p>Main pane</p>
              </Drawer.Body>
            </Drawer.DualPaneMain>
          </Drawer.DualPane>
        </Drawer.Content>
      </Drawer.Root>
    )

  test('does not render substeps until the parent step is reached (progressive disclosure)', async () => {
    renderWithSubsteps('step1')

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Step 1 of 3: Step 1' })).toBeInTheDocument()
    })
    expect(screen.queryByText('Step 2.1')).not.toBeInTheDocument()
  })

  test('renders the substep list once the parent step is active', async () => {
    renderWithSubsteps('step2')

    await waitFor(() => {
      expect(screen.getByText('Step 2.1')).toBeInTheDocument()
    })
    expect(screen.getByText('Step 2.1').closest('.cn-stepper-nested-step-list')).not.toBeNull()
  })

  test('selecting a parent step activates its first substep and leaves the rest upcoming', async () => {
    renderWithSubsteps('step2')

    await waitFor(() => {
      expect(screen.getByText('Step 2.1').closest('.cn-stepper-nested-step')).toHaveClass('cn-stepper-nested-step-active')
      expect(screen.getByText('Step 2.2').closest('.cn-stepper-nested-step')).toHaveClass(
        'cn-stepper-nested-step-upcoming'
      )
      expect(screen.getByText('Step 2.3').closest('.cn-stepper-nested-step')).toHaveClass(
        'cn-stepper-nested-step-upcoming'
      )
    })
  })

  test('derives substep states (completed / active / upcoming) from the active substep value', async () => {
    renderWithSubsteps('step2.2')

    await waitFor(() => {
      const completed = screen.getByText('Step 2.1').closest('.cn-stepper-nested-step') as HTMLElement
      const active = screen.getByText('Step 2.2').closest('.cn-stepper-nested-step') as HTMLElement
      const upcoming = screen.getByText('Step 2.3').closest('.cn-stepper-nested-step') as HTMLElement

      expect(completed).toHaveClass('cn-stepper-nested-step-completed')
      expect(active).toHaveClass('cn-stepper-nested-step-active')
      expect(upcoming).toHaveClass('cn-stepper-nested-step-upcoming')

      // Completed → check icon, active → dot, upcoming → ordinal placeholder.
      expect(completed.querySelector('svg')).not.toBeNull()
      expect(active.querySelector('.cn-stepper-nested-step-dot')).not.toBeNull()
      expect(upcoming.querySelector('.cn-stepper-nested-step-ordinal')).not.toBeNull()
    })
  })

  test('treats the parent step as active and keeps later top-level steps upcoming when a substep is active', async () => {
    renderWithSubsteps('step2.2')

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Step 2 of 3: Step 2' })).toHaveClass('cn-stepper-step-active')
      expect(screen.getByRole('button', { name: 'Step 3 of 3: Step 3' })).toHaveClass('cn-stepper-step-upcoming')
      expect(screen.getByRole('button', { name: 'Step 1 of 3: Step 1' })).toHaveClass('cn-stepper-step-completed')
    })
  })

  test('sets aria-current on the active substep', async () => {
    renderWithSubsteps('step2.2')

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Step 2.2' })).toHaveAttribute('aria-current', 'step')
    })
  })

  test('renders every substep of the active parent as a navigable button', async () => {
    renderWithSubsteps('step2.2')

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Step 2.1' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Step 2.2' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Step 2.3' })).toBeInTheDocument()
    })
  })

  test('clicking a completed substep calls onValueChange with the substep value', async () => {
    const onValueChange = vi.fn()
    renderWithSubsteps('step2.2', onValueChange)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Step 2.1' })).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Step 2.1' }))

    expect(onValueChange).toHaveBeenCalledWith('step2.1')
  })

  test('nested steps are always navigable — clicking an upcoming substep navigates to it', async () => {
    const onValueChange = vi.fn()
    renderWithSubsteps('step2.2', onValueChange)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Step 2.3' })).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Step 2.3' }))

    expect(onValueChange).toHaveBeenCalledWith('step2.3')
  })

  test('clicking a previous top-level step from inside a substep navigates to that step', async () => {
    const onValueChange = vi.fn()
    renderWithSubsteps('step2.2', onValueChange)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Step 1 of 3: Step 1' })).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Step 1 of 3: Step 1' }))

    expect(onValueChange).toHaveBeenCalledWith('step1')
  })

  test('a top-level step that was previously visited stays navigable as completed even after the user moves backwards past it', async () => {
    const onValueChange = vi.fn()
    const tree = (currentStep: string) => (
      <Drawer.Root open>
        <Drawer.Content>
          <Drawer.DualPane>
            <Drawer.Steps value={currentStep} onValueChange={onValueChange} title="Create new workspace">
              <Drawer.Step value="step1" title="Step 1" description="Description" />
              <Drawer.Step value="step2" title="Step 2" description="Description">
                <Drawer.SubStep value="step2.1" title="Step 2.1" />
                <Drawer.SubStep value="step2.2" title="Step 2.2" />
                <Drawer.SubStep value="step2.3" title="Step 2.3" />
              </Drawer.Step>
              <Drawer.Step value="step3" title="Step 3" description="Description" />
            </Drawer.Steps>
            <Drawer.DualPaneMain>
              <Drawer.Body>main</Drawer.Body>
            </Drawer.DualPaneMain>
          </Drawer.DualPane>
        </Drawer.Content>
      </Drawer.Root>
    )

    const { rerender } = render(tree('step1'))

    // Walk forward to step3 to mark it as visited, then back to a substep of step2.
    rerender(tree('step3'))
    rerender(tree('step2.2'))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Step 3 of 3: Step 3' })).toHaveClass('cn-stepper-step-completed')
    })

    fireEvent.click(screen.getByRole('button', { name: 'Step 3 of 3: Step 3' }))

    expect(onValueChange).toHaveBeenCalledWith('step3')
  })

  test('throws when Drawer.SubStep is rendered outside a Drawer.Step', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() =>
      render(
        <Drawer.Root open>
          <Drawer.Content>
            <Drawer.DualPane>
              <Drawer.Steps value="step1">
                <Drawer.SubStep value="orphan" title="Orphan substep" />
              </Drawer.Steps>
              <Drawer.DualPaneMain>
                <Drawer.Body>main</Drawer.Body>
              </Drawer.DualPaneMain>
            </Drawer.DualPane>
          </Drawer.Content>
        </Drawer.Root>
      )
    ).toThrow(/Drawer\.SubStep must be used inside a Drawer\.Step/)

    consoleError.mockRestore()
  })
})

describe('Drawer.Rail (generic rail)', () => {
  const renderRail = (railProps: Partial<React.ComponentProps<typeof Drawer.Rail>> = {}) =>
    render(
      <Drawer.Root open>
        <Drawer.Content>
          <Drawer.DualPane>
            <Drawer.Rail aria-label="Glossary" {...railProps}>
              <dl>
                <dt>API</dt>
                <dd>Application Programming Interface</dd>
                <dt>SDK</dt>
                <dd>Software Development Kit</dd>
              </dl>
            </Drawer.Rail>
            <Drawer.DualPaneMain>
              <Drawer.Body>
                <p>Reference glossary while completing the form.</p>
              </Drawer.Body>
            </Drawer.DualPaneMain>
          </Drawer.DualPane>
        </Drawer.Content>
      </Drawer.Root>
    )

  test('renders an aside with the rail chrome class and forwarded aria-label', () => {
    renderRail()

    const rail = screen.getByRole('complementary', { name: 'Glossary' })
    expect(rail.tagName).toBe('ASIDE')
    expect(rail).toHaveClass('cn-drawer-dual-pane-rail')
  })

  test('renders the title heading when title prop is provided', () => {
    renderRail({ title: 'Reference' })

    expect(screen.getByRole('heading', { name: 'Reference' })).toBeInTheDocument()
  })

  test('omits the title heading when title prop is not provided', () => {
    renderRail()

    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  test('renders arbitrary children inside the rail body (no enforced list semantics)', () => {
    renderRail({ title: 'Glossary' })

    expect(screen.getByText('Application Programming Interface')).toBeInTheDocument()
    expect(screen.getByText('Software Development Kit')).toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })
})

describe('Nested drawers inside a dual pane drawer', () => {
  test('a Drawer.Root inside Drawer.DualPaneMain renders as a nested root', () => {
    render(
      <Drawer.Root open>
        <Drawer.Content>
          <Drawer.DualPane>
            <Drawer.Steps value="details" aria-label="Pipeline steps">
              <Drawer.Step value="details" title="Details" />
            </Drawer.Steps>
            <Drawer.DualPaneMain>
              <Drawer.Body>
                <Drawer.Root open>
                  <Drawer.Content>
                    <Drawer.Title>Nested from main pane</Drawer.Title>
                  </Drawer.Content>
                </Drawer.Root>
              </Drawer.Body>
            </Drawer.DualPaneMain>
          </Drawer.DualPane>
        </Drawer.Content>
      </Drawer.Root>
    )

    expect(screen.getAllByTestId('drawer-root')).toHaveLength(1)
    expect(screen.getAllByTestId('drawer-nested-root')).toHaveLength(1)
    expect(screen.getByText('Nested from main pane')).toBeInTheDocument()
  })

  test('a Drawer.Root inside Drawer.Rail renders as a nested root', () => {
    render(
      <Drawer.Root open>
        <Drawer.Content>
          <Drawer.DualPane>
            <Drawer.Rail aria-label="Reference">
              <Drawer.Root open>
                <Drawer.Content>
                  <Drawer.Title>Nested from rail</Drawer.Title>
                </Drawer.Content>
              </Drawer.Root>
            </Drawer.Rail>
            <Drawer.DualPaneMain>
              <Drawer.Body>
                <p>Main pane</p>
              </Drawer.Body>
            </Drawer.DualPaneMain>
          </Drawer.DualPane>
        </Drawer.Content>
      </Drawer.Root>
    )

    expect(screen.getAllByTestId('drawer-root')).toHaveLength(1)
    expect(screen.getAllByTestId('drawer-nested-root')).toHaveLength(1)
    expect(screen.getByText('Nested from rail')).toBeInTheDocument()
  })

  test('multiple nesting levels inside a dual pane stack as nested roots', () => {
    render(
      <Drawer.Root open>
        <Drawer.Content>
          <Drawer.DualPane>
            <Drawer.Steps value="details" aria-label="Pipeline steps">
              <Drawer.Step value="details" title="Details" />
            </Drawer.Steps>
            <Drawer.DualPaneMain>
              <Drawer.Body>
                <Drawer.Root open>
                  <Drawer.Content>
                    <Drawer.Title>Level 1 nested</Drawer.Title>
                    <Drawer.Body>
                      <Drawer.Root open>
                        <Drawer.Content>
                          <Drawer.Title>Level 2 nested</Drawer.Title>
                        </Drawer.Content>
                      </Drawer.Root>
                    </Drawer.Body>
                  </Drawer.Content>
                </Drawer.Root>
              </Drawer.Body>
            </Drawer.DualPaneMain>
          </Drawer.DualPane>
        </Drawer.Content>
      </Drawer.Root>
    )

    expect(screen.getAllByTestId('drawer-root')).toHaveLength(1)
    expect(screen.getAllByTestId('drawer-nested-root')).toHaveLength(2)
    expect(screen.getByText('Level 1 nested')).toBeInTheDocument()
    expect(screen.getByText('Level 2 nested')).toBeInTheDocument()
  })
})
