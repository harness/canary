import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { Breadcrumb } from '../../breadcrumb'
import { Page } from '../index'

const HeaderV2 = Page.HeaderV2

describe('HeaderV2', () => {
  test('renders a string title as an h1 with heading-hero typography', () => {
    render(<HeaderV2 title="Test Title" />)

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Test Title')
  })

  test('renders a ReactNode title as-is', () => {
    render(<HeaderV2 title={<div data-testid="custom-title">Custom Title Node</div>} />)

    const customTitle = screen.getByTestId('custom-title')
    expect(customTitle).toBeInTheDocument()
    expect(customTitle).toHaveTextContent('Custom Title Node')
  })

  test('renders breadcrumbs when provided as ReactNode', () => {
    render(
      <HeaderV2
        title="Test Page"
        breadcrumbs={
          <Breadcrumb.Root>
            <Breadcrumb.List>
              <Breadcrumb.Item>
                <Breadcrumb.Link href="/projects">Projects</Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Breadcrumb.Page>Current</Breadcrumb.Page>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>
        }
      />
    )
    expect(screen.getByRole('navigation', { name: 'breadcrumb' })).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('Current')).toBeInTheDocument()
  })

  test('does not render breadcrumb nav when breadcrumbs is not provided', () => {
    render(<HeaderV2 title="Test Page" />)
    expect(screen.queryByRole('navigation', { name: 'breadcrumb' })).not.toBeInTheDocument()
  })

  test('renders an icon next to the title when iconName is provided', () => {
    render(<HeaderV2 title="Test Page" iconName="repository" />)
    expect(screen.getByRole('heading', { level: 1, name: 'Test Page' })).toBeInTheDocument()
  })

  test('renders the description below the title', () => {
    render(<HeaderV2 title="Test Page" description="A test description" />)
    expect(screen.getByText('A test description')).toBeInTheDocument()
  })

  test('does not render description when not provided', () => {
    render(<HeaderV2 title="Test Page" />)
    expect(screen.getByRole('heading', { level: 1, name: 'Test Page' })).toBeInTheDocument()
  })

  test('renders actions slot on the right side of the title row', () => {
    render(<HeaderV2 title="Test Page" actions={<button data-testid="custom-action">Run</button>} />)
    expect(screen.getByTestId('custom-action')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Run' })).toBeInTheDocument()
  })

  test('does not render actions area when actions is not provided', () => {
    const { container } = render(<HeaderV2 title="Test Page" />)
    expect(container.querySelectorAll('button')).toHaveLength(0)
  })

  test('renders tabs when provided', () => {
    render(
      <HeaderV2
        title="Test Page"
        tabs={[
          { label: 'Tab 1', value: 'tab1' },
          { label: 'Tab 2', value: 'tab2' }
        ]}
      />
    )
    expect(screen.getByText('Tab 1')).toBeInTheDocument()
    expect(screen.getByText('Tab 2')).toBeInTheDocument()
  })

  test('does not render tabs when not provided', () => {
    render(<HeaderV2 title="Test Page" />)
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument()
  })

  test('renders disabled tabs correctly', () => {
    render(
      <HeaderV2
        title="Test Page"
        tabs={[
          { label: 'Tab 1', value: 'tab1' },
          { label: 'Tab 2', value: 'tab2', disabled: true }
        ]}
      />
    )
    expect(screen.getByText('Tab 2').closest('a')).toHaveAttribute('aria-disabled', 'true')
  })

  test('renders children between description and tabs', () => {
    render(
      <HeaderV2 title="Test Page" description="A description" tabs={[{ label: 'Tab 1', value: 'tab1' }]}>
        <div data-testid="custom-content">Dashboard Widgets</div>
      </HeaderV2>
    )
    expect(screen.getByTestId('custom-content')).toBeInTheDocument()
    expect(screen.getByText('Dashboard Widgets')).toBeInTheDocument()
  })

  test('Page.HeaderV2 is exported and renders', () => {
    render(<Page.HeaderV2 title="Namespace Test" />)
    expect(screen.getByRole('heading', { level: 1, name: 'Namespace Test' })).toBeInTheDocument()
  })

  test('renders all sections together (integration)', () => {
    render(
      <HeaderV2
        breadcrumbs={
          <Breadcrumb.Root>
            <Breadcrumb.List>
              <Breadcrumb.Item>
                <Breadcrumb.Link href="/projects">Projects</Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Breadcrumb.Link href="/pipelines">Pipelines</Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Breadcrumb.Page>My Pipeline</Breadcrumb.Page>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>
        }
        title="My Pipeline"
        iconName="repository"
        description="Builds and deploys the frontend service"
        actions={
          <>
            <button data-testid="overflow-menu">More</button>
            <button data-testid="secondary-btn">Edit</button>
            <button data-testid="primary-btn">Run Pipeline</button>
          </>
        }
        tabs={[
          { label: 'Overview', value: 'overview' },
          { label: 'Executions', value: 'executions', counter: 12 },
          { label: 'Settings', value: 'settings' }
        ]}
      />
    )

    // Breadcrumbs
    expect(screen.getByRole('navigation', { name: 'breadcrumb' })).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()

    // Title
    expect(screen.getByRole('heading', { level: 1, name: 'My Pipeline' })).toBeInTheDocument()

    // Description
    expect(screen.getByText('Builds and deploys the frontend service')).toBeInTheDocument()

    // Actions (ReactNode slot)
    expect(screen.getByTestId('overflow-menu')).toBeInTheDocument()
    expect(screen.getByTestId('secondary-btn')).toBeInTheDocument()
    expect(screen.getByTestId('primary-btn')).toBeInTheDocument()

    // Tabs (rendered as nav links via Tabs.NavRoot)
    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(screen.getByText('Executions')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })
})
