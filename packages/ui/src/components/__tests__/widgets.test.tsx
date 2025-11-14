import { render, screen, within } from '@testing-library/react'
import { vi } from 'vitest'

import { Widgets } from '../widgets'

const tMock = vi.fn((key: string, fallback?: string) => fallback ?? key)

vi.mock('@/components', () => ({
  Layout: {
    Vertical: ({ children, className, ...props }: any) => (
      <div data-component="layout-vertical" data-testid="layout-vertical" className={className} {...props}>
        {children}
      </div>
    ),
    Flex: ({ children, className, ...props }: any) => (
      <div data-component="layout-flex" data-testid="layout-flex" className={className} {...props}>
        {children}
      </div>
    )
  },
  Link: ({ children, to, suffixIcon, ...props }: any) => (
    <a data-component="link" data-suffix-icon={suffixIcon} href={to} {...props}>
      {children}
    </a>
  ),
  ScrollArea: ({ children, classNameContent, ...props }: any) => (
    <div data-component="scroll-area" data-testid="scroll-area" data-class-name-content={classNameContent} {...props}>
      {children}
    </div>
  ),
  Text: ({ children, as, variant, ...props }: any) => (
    <span data-component="text" data-as={as} data-variant={variant} {...props}>
      {children}
    </span>
  )
}))

vi.mock('@/context', () => ({
  useTranslation: () => ({
    t: tMock
  })
}))

describe('Widgets', () => {
  beforeEach(() => {
    tMock.mockClear()
  })

  describe('Root', () => {
    it('renders single column layout when not enough children for two columns', () => {
      const { container } = render(
        <Widgets.Root>
          <div data-testid="child">Content</div>
        </Widgets.Root>
      )

      const wrapper = container.firstElementChild as HTMLElement
      expect(wrapper).toHaveClass('gap-cn-3xl')
      expect(wrapper).toHaveClass('flex')
      expect(wrapper).toHaveClass('flex-col')
      expect(wrapper).not.toHaveClass('columns-2')
    })

    it('applies two-column layout and shares context with items', () => {
      const { container } = render(
        <Widgets.Root isTwoColumn>
          <Widgets.Item title="First widget" moreLink={{ to: '/details' }}>
            <div data-testid="content-1">First content</div>
          </Widgets.Item>
          <Widgets.Item title="Table widget" isWidgetTable className="custom-item">
            <div data-testid="content-2">Second content</div>
          </Widgets.Item>
        </Widgets.Root>
      )

      const wrapper = container.firstElementChild as HTMLElement
      expect(wrapper).toHaveClass('columns-2')

      const itemContainers = screen.getAllByTestId('layout-vertical')
      expect(itemContainers[0]).toHaveClass('overflow-hidden')
      expect(itemContainers[0]).toHaveClass('break-inside-avoid')
      expect(itemContainers[1]).toHaveClass('break-inside-avoid')
    })
  })

  describe('Item', () => {
    it('renders title, link, and default styling', () => {
      render(
        <Widgets.Item title="Widget title" moreLink={{ to: '/more-info' }}>
          <div data-testid="child-content">Child data</div>
        </Widgets.Item>
      )

      const heading = screen.getByText('Widget title')
      expect(heading).toHaveAttribute('data-component', 'text')
      expect(heading).toHaveAttribute('data-as', 'h2')
      expect(heading).toHaveAttribute('data-variant', 'heading-subsection')

      const link = screen.getByRole('link', { name: 'View more' })
      expect(link).toHaveAttribute('href', '/more-info')
      expect(link).toHaveAttribute('data-suffix-icon', 'nav-arrow-right')
      expect(tMock).toHaveBeenCalledWith('component:widgets.viewMore', 'View more')

      const scrollArea = screen.getByTestId('scroll-area')
      expect(scrollArea).toHaveAttribute('data-class-name-content', 'w-full')
      expect(within(scrollArea).getByTestId('child-content')).toBeInTheDocument()

      const contentWrapper = scrollArea.parentElement as HTMLElement
      expect(contentWrapper.className).toContain('[contain:inline-size]')
      expect(contentWrapper).toHaveClass('border', 'border-cn-3', 'rounded-cn-3', 'p-cn-lg')
    })

    it('omits default frame for widget tables and merges custom classes under two column layout', () => {
      render(
        <Widgets.Root isTwoColumn>
          <Widgets.Item title="Widget with table" isWidgetTable className="custom-frame">
            <div>Table content</div>
          </Widgets.Item>
          <Widgets.Item title="Reference widget">Other content</Widgets.Item>
        </Widgets.Root>
      )

      const itemContainers = screen.getAllByTestId('layout-vertical')
      const firstWrapper = screen.getAllByTestId('scroll-area')[0].parentElement as HTMLElement
      expect(firstWrapper.className).toContain('[contain:inline-size]')
      expect(firstWrapper).not.toHaveClass('border')
      expect(firstWrapper).toHaveClass('custom-frame')

      expect(itemContainers[0]).toHaveClass('break-inside-avoid')
      expect(itemContainers[1]).toHaveClass('break-inside-avoid')
    })
  })
})
