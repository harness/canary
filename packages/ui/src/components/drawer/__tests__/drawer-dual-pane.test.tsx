import React from 'react'

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

import { Drawer } from '../index'

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
      expect(screen.getByRole('button', { name: /Details Basic information/ })).toHaveClass(
        'cn-drawer-dual-pane-step-completed'
      )
      expect(screen.getByRole('button', { name: 'Configuration' })).toHaveClass('cn-drawer-dual-pane-step-active')
      expect(screen.getByText('Review').closest('.cn-drawer-dual-pane-step')).toHaveClass(
        'cn-drawer-dual-pane-step-upcoming'
      )
    })
  })

  test('sets aria-current on the active step', async () => {
    renderDualPane('configuration')

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Configuration' })).toHaveAttribute('aria-current', 'step')
    })
  })

  test('renders optional descriptions only when provided', async () => {
    renderDualPane('details')

    await waitFor(() => {
      expect(screen.getByText('Basic information')).toBeInTheDocument()
      expect(
        screen
          .getByText('Configuration')
          .closest('.cn-drawer-dual-pane-step')
          ?.querySelector('.cn-drawer-dual-pane-step-description')
      ).toBeNull()
      expect(screen.getByText('Confirm before submitting')).toBeInTheDocument()
    })
  })

  test('fires onValueChange for completed steps and blocks upcoming steps', async () => {
    const onValueChange = vi.fn()
    renderDualPane('configuration', onValueChange)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Details Basic information/ })).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: /Details Basic information/ }))
    expect(onValueChange).toHaveBeenCalledWith('details')

    fireEvent.click(screen.getByText('Review'))
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
      const completedStep = screen.getByRole('button', { name: /Details Basic information/ })
      const activeStep = screen.getByRole('button', { name: 'Configuration' })
      const upcomingStep = screen.getByText('Review').closest('.cn-drawer-dual-pane-step') as HTMLElement

      expect(completedStep.querySelector('.cn-drawer-dual-pane-step-indicator-icon')).not.toBeNull()
      expect(completedStep.querySelector('.cn-drawer-dual-pane-step-indicator-number')).toBeNull()

      expect(activeStep.querySelector('.cn-drawer-dual-pane-step-indicator-number')?.textContent).toBe('2')
      expect(upcomingStep.querySelector('.cn-drawer-dual-pane-step-indicator-number')?.textContent).toBe('3')
    })
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

  test('collapses the substep list when the parent step is not active', async () => {
    renderWithSubsteps('step1')

    await waitFor(() => {
      const list = screen.getByText('Step 2.1').closest('.cn-drawer-dual-pane-substeps-list') as HTMLElement
      expect(list).toHaveAttribute('data-state', 'collapsed')
    })
  })

  test('expands the substep list when the parent step is active', async () => {
    renderWithSubsteps('step2')

    await waitFor(() => {
      const list = screen.getByText('Step 2.1').closest('.cn-drawer-dual-pane-substeps-list') as HTMLElement
      expect(list).toHaveAttribute('data-state', 'expanded')
    })
  })

  test('renders substeps once the parent step becomes active and starts them as upcoming', async () => {
    renderWithSubsteps('step2')

    await waitFor(() => {
      expect(screen.getByText('Step 2.1').closest('.cn-drawer-dual-pane-substep')).toHaveClass(
        'cn-drawer-dual-pane-substep-upcoming'
      )
      expect(screen.getByText('Step 2.2').closest('.cn-drawer-dual-pane-substep')).toHaveClass(
        'cn-drawer-dual-pane-substep-upcoming'
      )
      expect(screen.getByText('Step 2.3').closest('.cn-drawer-dual-pane-substep')).toHaveClass(
        'cn-drawer-dual-pane-substep-upcoming'
      )
    })
  })

  test('derives substep states (completed / active / upcoming) from the active substep value', async () => {
    renderWithSubsteps('step2.2')

    await waitFor(() => {
      const completed = screen.getByText('Step 2.1').closest('.cn-drawer-dual-pane-substep') as HTMLElement
      const active = screen.getByText('Step 2.2').closest('.cn-drawer-dual-pane-substep') as HTMLElement
      const upcoming = screen.getByText('Step 2.3').closest('.cn-drawer-dual-pane-substep') as HTMLElement

      expect(completed).toHaveClass('cn-drawer-dual-pane-substep-completed')
      expect(active).toHaveClass('cn-drawer-dual-pane-substep-active')
      expect(upcoming).toHaveClass('cn-drawer-dual-pane-substep-upcoming')

      expect(completed.querySelector('.cn-drawer-dual-pane-substep-indicator-icon')).not.toBeNull()
      expect(active.querySelector('.cn-drawer-dual-pane-substep-indicator-dot')).not.toBeNull()
      expect(upcoming.querySelector('.cn-drawer-dual-pane-substep-indicator-icon')).not.toBeNull()
    })
  })

  test('treats the parent step as active and keeps later top-level steps upcoming when a substep is active', async () => {
    renderWithSubsteps('step2.2')

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Step 2 Description/ })).toHaveClass('cn-drawer-dual-pane-step-active')
      expect(screen.getByText('Step 3').closest('.cn-drawer-dual-pane-step')).toHaveClass(
        'cn-drawer-dual-pane-step-upcoming'
      )
      expect(screen.getByRole('button', { name: /Step 1 Description/ })).toHaveClass(
        'cn-drawer-dual-pane-step-completed'
      )
    })
  })

  test('only sets aria-current on the actually selected substep, not on the parent step', async () => {
    renderWithSubsteps('step2.2')

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Step 2.2' })).toHaveAttribute('aria-current', 'step')
      expect(screen.getByRole('button', { name: /Step 2 Description/ })).not.toHaveAttribute('aria-current')
    })
  })

  test('completed and active substeps are buttons; upcoming substeps are not navigable', async () => {
    renderWithSubsteps('step2.2')

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Step 2.1' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Step 2.2' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Step 2.3' })).not.toBeInTheDocument()

      const upcoming = screen.getByText('Step 2.3').closest('.cn-drawer-dual-pane-substep') as HTMLElement
      expect(upcoming).toHaveAttribute('aria-disabled', 'true')
    })
  })

  test('clicking a navigable substep calls onValueChange with the substep value', async () => {
    const onValueChange = vi.fn()
    renderWithSubsteps('step2.2', onValueChange)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Step 2.1' })).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Step 2.1' }))

    expect(onValueChange).toHaveBeenCalledWith('step2.1')
  })

  test('clicking an upcoming/never-visited substep does not call onValueChange', async () => {
    const onValueChange = vi.fn()
    renderWithSubsteps('step2.2', onValueChange)

    await waitFor(() => {
      expect(screen.getByText('Step 2.3').closest('.cn-drawer-dual-pane-substep')).toBeInTheDocument()
    })

    const upcoming = screen.getByText('Step 2.3').closest('.cn-drawer-dual-pane-substep') as HTMLElement
    fireEvent.click(upcoming)

    expect(onValueChange).not.toHaveBeenCalled()
  })

  test('clicking a previous top-level step from inside a substep navigates to that step', async () => {
    const onValueChange = vi.fn()
    renderWithSubsteps('step2.2', onValueChange)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Step 1 Description/ })).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: /Step 1 Description/ }))

    expect(onValueChange).toHaveBeenCalledWith('step1')
  })

  test('a top-level step that was previously visited stays navigable as completed even after the user moves backwards past it', async () => {
    const onValueChange = vi.fn()
    const renderControlled = (currentStep: string) =>
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
                <Drawer.Body>main</Drawer.Body>
              </Drawer.DualPaneMain>
            </Drawer.DualPane>
          </Drawer.Content>
        </Drawer.Root>
      )

    const { rerender } = renderControlled('step1')

    // Walk forward to step3 to mark it as visited.
    rerender(
      <Drawer.Root open>
        <Drawer.Content>
          <Drawer.DualPane>
            <Drawer.Steps value="step3" onValueChange={onValueChange} title="Create new workspace">
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

    // Then walk back to a substep of step2.
    rerender(
      <Drawer.Root open>
        <Drawer.Content>
          <Drawer.DualPane>
            <Drawer.Steps value="step2.2" onValueChange={onValueChange} title="Create new workspace">
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

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Step 3 Description/ })).toHaveClass(
        'cn-drawer-dual-pane-step-completed'
      )
    })

    fireEvent.click(screen.getByRole('button', { name: /Step 3 Description/ }))

    expect(onValueChange).toHaveBeenCalledWith('step3')
  })

  test('a substep that was previously visited stays navigable as completed even after the user moves to an earlier substep', async () => {
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

    const { rerender } = render(tree('step2.1'))

    // Walk forward to the last substep, then back to the first.
    rerender(tree('step2.3'))
    rerender(tree('step2.1'))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Step 2.3' })).toHaveClass('cn-drawer-dual-pane-substep-completed')
    })

    fireEvent.click(screen.getByRole('button', { name: 'Step 2.3' }))

    expect(onValueChange).toHaveBeenCalledWith('step2.3')
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
