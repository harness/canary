import React from 'react'

import { render, screen } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'

import { Tabs } from '../../tabs'
import { Drawer } from '../index'

vi.mock('vaul', () => {
  const DrawerRoot = ({ children, ...props }: any) => (
    <div data-testid="drawer-root" {...props}>
      {children}
    </div>
  )
  DrawerRoot.displayName = 'DrawerRoot'

  const DrawerClose = ({ children, asChild, ...props }: any) =>
    asChild ? (
      <>{children}</>
    ) : (
      <button data-testid="drawer-close" {...props}>
        {children}
      </button>
    )
  DrawerClose.displayName = 'DrawerClose'

  const DrawerContent = React.forwardRef(({ children, ...props }: any, ref) => (
    <div ref={ref} data-testid="drawer-content" {...props}>
      {children}
    </div>
  ))
  DrawerContent.displayName = 'DrawerContent'

  const DrawerPortal = ({ children }: any) => <>{children}</>
  DrawerPortal.displayName = 'DrawerPortal'

  const DrawerOverlay = ({ children, ...props }: any) => (
    <div data-testid="drawer-overlay" {...props}>
      {children}
    </div>
  )
  DrawerOverlay.displayName = 'DrawerOverlay'

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
      Close: DrawerClose,
      Content: DrawerContent,
      Portal: DrawerPortal,
      Overlay: DrawerOverlay,
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

const HeaderV2 = Drawer.HeaderV2

describe('DrawerHeaderV2', () => {
  test('renders title', () => {
    render(<HeaderV2 title="Build #142" />)
    expect(screen.getByText('Build #142')).toBeInTheDocument()
  })

  test('renders description when provided', () => {
    render(<HeaderV2 title="Build #142" description="main branch" />)
    expect(screen.getByText('main branch')).toBeInTheDocument()
  })

  test('renders icon when provided', () => {
    const { container } = render(<HeaderV2 title="Build" icon="pipeline" />)
    expect(container.querySelector('.cn-drawer-header-v2-icon')).toBeInTheDocument()
  })

  test('renders logo when icon is an object with logo key', () => {
    const { container } = render(<HeaderV2 title="Build" icon={{ logo: 'github' }} />)
    expect(container.querySelector('.cn-drawer-header-v2-icon')).toBeInTheDocument()
  })

  test('renders close button by default', () => {
    render(<HeaderV2 title="Build" />)
    // DrawerPrimitive.Close with asChild renders children directly
    // The Button inside should be rendered
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  test('hides close button when hideClose=true', () => {
    render(<HeaderV2 title="Build" hideClose />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  test('renders actions in title row', () => {
    render(<HeaderV2 title="Build" actions={<button data-testid="action-btn">Actions</button>} />)
    expect(screen.getByTestId('action-btn')).toBeInTheDocument()
  })

  test('renders children (metadata slot)', () => {
    render(
      <HeaderV2 title="Build">
        <div data-testid="stats">Status: Success</div>
      </HeaderV2>
    )
    expect(screen.getByTestId('stats')).toBeInTheDocument()
  })

  test('renders tabs when provided', () => {
    render(
      <Tabs.Root defaultValue="logs">
        <HeaderV2
          title="Build"
          tabs={[
            { label: 'Logs', value: 'logs' },
            { label: 'Inputs', value: 'inputs' }
          ]}
        />
      </Tabs.Root>
    )
    expect(screen.getByRole('tablist')).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Logs' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Inputs' })).toBeInTheDocument()
  })

  test('does not render tabs when omitted', () => {
    render(<HeaderV2 title="Build" />)
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument()
  })

  test('hides actions when isLoading=true', () => {
    render(<HeaderV2 title="Build" isLoading actions={<button data-testid="action-btn">Actions</button>} />)
    expect(screen.queryByTestId('action-btn')).not.toBeInTheDocument()
  })

  test('shows skeleton for children when isLoading=true', () => {
    const { container } = render(
      <HeaderV2 title="Build" isLoading>
        <div data-testid="stats">Status: Success</div>
      </HeaderV2>
    )
    expect(screen.queryByTestId('stats')).not.toBeInTheDocument()
    expect(container.querySelector('.cn-skeleton-base')).toBeInTheDocument()
  })

  test('still renders tabs when isLoading=true', () => {
    render(
      <Tabs.Root defaultValue="logs">
        <HeaderV2 title="Build" isLoading tabs={[{ label: 'Logs', value: 'logs' }]} />
      </Tabs.Root>
    )
    expect(screen.getByRole('tablist')).toBeInTheDocument()
  })
})
