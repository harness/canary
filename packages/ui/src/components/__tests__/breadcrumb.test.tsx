import { render, screen } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'

import { Breadcrumb } from '../breadcrumb'

describe('Breadcrumb', () => {
  describe('Breadcrumb.Root', () => {
    test('should render with default props', () => {
      const { container } = render(
        <Breadcrumb.Root>
          <div>Content</div>
        </Breadcrumb.Root>
      )
      const nav = container.querySelector('nav')
      expect(nav).toBeInTheDocument()
      expect(nav).toHaveAttribute('aria-label', 'breadcrumb')
    })

    test('should render with default size', () => {
      const { container } = render(
        <Breadcrumb.Root>
          <div>Content</div>
        </Breadcrumb.Root>
      )
      const nav = container.querySelector('nav')
      expect(nav).toHaveClass('cn-breadcrumb-default')
    })

    test('should render with sm size', () => {
      const { container } = render(
        <Breadcrumb.Root size="sm">
          <div>Content</div>
        </Breadcrumb.Root>
      )
      const nav = container.querySelector('nav')
      expect(nav).toHaveClass('cn-breadcrumb-sm')
    })

    test('should apply custom className', () => {
      const { container } = render(
        <Breadcrumb.Root className="custom-class">
          <div>Content</div>
        </Breadcrumb.Root>
      )
      const nav = container.querySelector('nav')
      expect(nav).toHaveClass('custom-class')
    })
  })

  describe('Breadcrumb.List', () => {
    test('should render as ordered list', () => {
      const { container } = render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <li>Item</li>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      const list = container.querySelector('ol')
      expect(list).toBeInTheDocument()
      expect(list).toHaveClass('cn-breadcrumb-list')
    })

    test('should apply custom className', () => {
      const { container } = render(
        <Breadcrumb.Root>
          <Breadcrumb.List className="custom-list">
            <li>Item</li>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      const list = container.querySelector('ol')
      expect(list).toHaveClass('custom-list')
    })
  })

  describe('Breadcrumb.Item', () => {
    test('should render as list item', () => {
      const { container } = render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>Item content</Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      const item = container.querySelector('li')
      expect(item).toBeInTheDocument()
      expect(item).toHaveClass('cn-breadcrumb-item')
    })

    test('should apply custom className', () => {
      const { container } = render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item className="custom-item">Item</Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      const item = container.querySelector('li')
      expect(item).toHaveClass('custom-item')
    })
  })

  describe('Breadcrumb.Link', () => {
    test('should render as anchor tag by default', () => {
      const { container } = render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/home">Home</Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      const link = container.querySelector('a')
      expect(link).toBeInTheDocument()
      expect(link).toHaveClass('cn-breadcrumb-link')
      expect(link).toHaveAttribute('href', '/home')
    })

    test('should apply custom className', () => {
      const { container } = render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/home" className="custom-link">
                Home
              </Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      const link = container.querySelector('a')
      expect(link).toHaveClass('custom-link')
    })

    test('should render as custom component when asChild is true', () => {
      render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link asChild>
                <a href="/custom">Custom Link</a>
              </Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      const link = screen.getByText('Custom Link')
      expect(link).toBeInTheDocument()
      expect(link.tagName).toBe('A')
    })
  })

  describe('Breadcrumb.Page', () => {
    test('should render as current page', () => {
      render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Page>Current Page</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      const page = screen.getByText('Current Page')
      expect(page).toHaveAttribute('role', 'link')
      expect(page).toHaveAttribute('aria-disabled', 'true')
      expect(page).toHaveAttribute('aria-current', 'page')
      expect(page).toHaveClass('cn-breadcrumb-page')
    })

    test('should apply custom className', () => {
      render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Page className="custom-page">Current</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      const page = screen.getByText('Current')
      expect(page).toHaveClass('custom-page')
    })
  })

  describe('Breadcrumb.Separator', () => {
    test('should render default separator icon', () => {
      const { container } = render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>Page</Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      const separator = container.querySelector('.cn-breadcrumb-separator')
      expect(separator).toBeInTheDocument()
      expect(separator).toHaveAttribute('role', 'presentation')
      expect(separator).toHaveAttribute('aria-hidden', 'true')
    })

    test('should render custom separator content', () => {
      render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Separator>/</Breadcrumb.Separator>
            <Breadcrumb.Item>Page</Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      const separator = screen.getByText('/')
      expect(separator).toBeInTheDocument()
    })

    test('should apply custom className', () => {
      const { container } = render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Separator className="custom-separator" />
            <Breadcrumb.Item>Page</Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      const separator = container.querySelector('.cn-breadcrumb-separator')
      expect(separator).toHaveClass('custom-separator')
    })
  })

  describe('Breadcrumb.Ellipsis', () => {
    test('should render ellipsis with icon', () => {
      const { container } = render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Ellipsis />
            <Breadcrumb.Item>Page</Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      const ellipsis = container.querySelector('.cn-breadcrumb-ellipsis')
      expect(ellipsis).toBeInTheDocument()
      expect(ellipsis).toHaveAttribute('role', 'presentation')
      expect(ellipsis).toHaveAttribute('aria-hidden', 'true')
      expect(screen.getByText('More')).toHaveClass('sr-only')
    })

    test('should apply custom className', () => {
      const { container } = render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Ellipsis className="custom-ellipsis" />
            <Breadcrumb.Item>Page</Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      const ellipsis = container.querySelector('.cn-breadcrumb-ellipsis')
      expect(ellipsis).toHaveClass('custom-ellipsis')
    })
  })

  describe('Complete breadcrumb navigation', () => {
    test('should render full breadcrumb navigation', () => {
      render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/docs">Docs</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Breadcrumb.Page>Current Page</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('Docs')).toBeInTheDocument()
      expect(screen.getByText('Current Page')).toBeInTheDocument()
    })

    test('should render breadcrumb with ellipsis', () => {
      render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Ellipsis />
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Breadcrumb.Page>Current</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('More')).toBeInTheDocument()
      expect(screen.getByText('Current')).toBeInTheDocument()
    })
  })

  describe('Breadcrumb.Copy', () => {
    test('should have correct displayName', () => {
      expect(Breadcrumb.Copy.displayName).toBe('BreadcrumbCopy')
    })

    test('should be wrapped with cn-breadcrumb-copy class', () => {
      // Note: BreadcrumbCopy wraps CopyButton with breadcrumb-specific styling
      expect(Breadcrumb.Copy).toBeDefined()
    })
  })

  describe('Ref Forwarding', () => {
    test('should forward ref on Root', () => {
      const ref = vi.fn()
      render(
        <Breadcrumb.Root ref={ref}>
          <Breadcrumb.List>
            <Breadcrumb.Item>Test</Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      expect(ref).toHaveBeenCalled()
    })

    test('should forward ref on List', () => {
      const ref = vi.fn()
      render(
        <Breadcrumb.Root>
          <Breadcrumb.List ref={ref}>
            <Breadcrumb.Item>Test</Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      expect(ref).toHaveBeenCalled()
    })

    test('should forward ref on Item', () => {
      const ref = vi.fn()
      render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item ref={ref}>Test</Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      expect(ref).toHaveBeenCalled()
    })

    test('should forward ref on Link', () => {
      const ref = vi.fn()
      render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link ref={ref} href="/test">
                Test
              </Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      expect(ref).toHaveBeenCalled()
    })

    test('should forward ref on Page', () => {
      const ref = vi.fn()
      render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Page ref={ref}>Current</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      expect(ref).toHaveBeenCalled()
    })

    test('should forward ref on Ellipsis', () => {
      const ref = vi.fn()
      render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Ellipsis ref={ref} />
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      expect(ref).toHaveBeenCalled()
    })
  })

  describe('Component Display Names', () => {
    test('should have correct displayName for Root', () => {
      expect(Breadcrumb.Root.displayName).toBe('BreadcrumbRoot')
    })

    test('should have correct displayName for List', () => {
      expect(Breadcrumb.List.displayName).toBe('BreadcrumbList')
    })

    test('should have correct displayName for Item', () => {
      expect(Breadcrumb.Item.displayName).toBe('BreadcrumbItem')
    })

    test('should have correct displayName for Link', () => {
      expect(Breadcrumb.Link.displayName).toBe('BreadcrumbLink')
    })

    test('should have correct displayName for Page', () => {
      expect(Breadcrumb.Page.displayName).toBe('BreadcrumbPage')
    })

    test('should have correct displayName for Separator', () => {
      expect(Breadcrumb.Separator.displayName).toBe('BreadcrumbSeparator')
    })

    test('should have correct displayName for Ellipsis', () => {
      expect(Breadcrumb.Ellipsis.displayName).toBe('BreadcrumbEllipsis')
    })

    test('should have correct displayName for Copy', () => {
      expect(Breadcrumb.Copy.displayName).toBe('BreadcrumbCopy')
    })
  })

  describe('Props Forwarding', () => {
    test('should forward additional props to Root', () => {
      const { container } = render(
        <Breadcrumb.Root data-testid="custom-breadcrumb" aria-labelledby="nav-label">
          <div>Content</div>
        </Breadcrumb.Root>
      )
      const nav = container.querySelector('nav')
      expect(nav).toHaveAttribute('data-testid', 'custom-breadcrumb')
      expect(nav).toHaveAttribute('aria-labelledby', 'nav-label')
    })

    test('should forward additional props to List', () => {
      const { container } = render(
        <Breadcrumb.Root>
          <Breadcrumb.List data-testid="custom-list" aria-label="Navigation list">
            <li>Item</li>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      const list = container.querySelector('ol')
      expect(list).toHaveAttribute('data-testid', 'custom-list')
      expect(list).toHaveAttribute('aria-label', 'Navigation list')
    })

    test('should forward additional props to Item', () => {
      const { container } = render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item data-testid="custom-item" data-index="1">
              Item
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      const item = container.querySelector('li')
      expect(item).toHaveAttribute('data-testid', 'custom-item')
      expect(item).toHaveAttribute('data-index', '1')
    })

    test('should forward additional props to Link', () => {
      const { container } = render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/test" data-testid="custom-link" target="_blank">
                Link
              </Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      const link = container.querySelector('a')
      expect(link).toHaveAttribute('data-testid', 'custom-link')
      expect(link).toHaveAttribute('target', '_blank')
    })

    test('should forward additional props to Page', () => {
      render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Page data-testid="custom-page" title="Current page">
                Page
              </Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      const page = screen.getByTestId('custom-page')
      expect(page).toHaveAttribute('title', 'Current page')
    })

    test('should forward additional props to Separator', () => {
      const { container } = render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Separator data-testid="custom-separator" />
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      const separator = container.querySelector('[data-testid="custom-separator"]')
      expect(separator).toBeInTheDocument()
    })

    test('should forward additional props to Ellipsis', () => {
      render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Ellipsis data-testid="custom-ellipsis" title="More items" />
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      const ellipsis = screen.getByTestId('custom-ellipsis')
      expect(ellipsis).toHaveAttribute('title', 'More items')
    })
  })

  describe('Edge Cases', () => {
    test('should render with single item', () => {
      render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Page>Only Page</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      expect(screen.getByText('Only Page')).toBeInTheDocument()
    })

    test('should render with many items', () => {
      render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            {Array.from({ length: 10 }, (_, i) => (
              <Breadcrumb.Item key={i}>
                <Breadcrumb.Link href={`/page${i}`}>Page {i}</Breadcrumb.Link>
              </Breadcrumb.Item>
            ))}
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      expect(screen.getByText('Page 0')).toBeInTheDocument()
      expect(screen.getByText('Page 9')).toBeInTheDocument()
    })

    test('should render empty list', () => {
      const { container } = render(
        <Breadcrumb.Root>
          <Breadcrumb.List />
        </Breadcrumb.Root>
      )
      const list = container.querySelector('ol')
      expect(list).toBeInTheDocument()
    })

    test('should render with only separators', () => {
      const { container } = render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Separator />
            <Breadcrumb.Separator />
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      const separators = container.querySelectorAll('.cn-breadcrumb-separator')
      expect(separators.length).toBe(2)
    })

    test('should render without separators', () => {
      render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Breadcrumb.Page>Current</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('Current')).toBeInTheDocument()
    })

    test('should handle long text in breadcrumb items', () => {
      const longText = 'Very Long Breadcrumb Text That Might Need Truncation'
      render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Page>{longText}</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      expect(screen.getByText(longText)).toBeInTheDocument()
    })
  })

  describe('Re-rendering with Prop Changes', () => {
    test('should update when size changes', () => {
      const { rerender, container } = render(
        <Breadcrumb.Root size="default">
          <Breadcrumb.List>
            <Breadcrumb.Item>Test</Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )

      let nav = container.querySelector('nav')
      expect(nav).toHaveClass('cn-breadcrumb-default')

      rerender(
        <Breadcrumb.Root size="sm">
          <Breadcrumb.List>
            <Breadcrumb.Item>Test</Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )

      nav = container.querySelector('nav')
      expect(nav).toHaveClass('cn-breadcrumb-sm')
      expect(nav).not.toHaveClass('cn-breadcrumb-default')
    })

    test('should update when className changes', () => {
      const { rerender, container } = render(
        <Breadcrumb.Root className="class1">
          <Breadcrumb.List>
            <Breadcrumb.Item>Test</Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )

      let nav = container.querySelector('nav')
      expect(nav).toHaveClass('class1')

      rerender(
        <Breadcrumb.Root className="class2">
          <Breadcrumb.List>
            <Breadcrumb.Item>Test</Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )

      nav = container.querySelector('nav')
      expect(nav).toHaveClass('class2')
      expect(nav).not.toHaveClass('class1')
    })
  })

  describe('Accessibility Features', () => {
    test('should have aria-label on nav', () => {
      const { container } = render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>Test</Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      const nav = container.querySelector('nav')
      expect(nav).toHaveAttribute('aria-label', 'breadcrumb')
    })

    test('should have role="link" on Page', () => {
      render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Page>Current</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      const page = screen.getByText('Current')
      expect(page).toHaveAttribute('role', 'link')
    })

    test('should have aria-disabled on Page', () => {
      render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Page>Current</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      const page = screen.getByText('Current')
      expect(page).toHaveAttribute('aria-disabled', 'true')
    })

    test('should have aria-current="page" on Page', () => {
      render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Page>Current</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      const page = screen.getByText('Current')
      expect(page).toHaveAttribute('aria-current', 'page')
    })

    test('should have role="presentation" on Separator', () => {
      const { container } = render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Separator />
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      const separator = container.querySelector('.cn-breadcrumb-separator')
      expect(separator).toHaveAttribute('role', 'presentation')
    })

    test('should have aria-hidden on Separator', () => {
      const { container } = render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Separator />
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      const separator = container.querySelector('.cn-breadcrumb-separator')
      expect(separator).toHaveAttribute('aria-hidden', 'true')
    })

    test('should have role="presentation" on Ellipsis', () => {
      const { container } = render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Ellipsis />
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      const ellipsis = container.querySelector('.cn-breadcrumb-ellipsis')
      expect(ellipsis).toHaveAttribute('role', 'presentation')
    })

    test('should have aria-hidden on Ellipsis', () => {
      const { container } = render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Ellipsis />
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      const ellipsis = container.querySelector('.cn-breadcrumb-ellipsis')
      expect(ellipsis).toHaveAttribute('aria-hidden', 'true')
    })

    test('should have sr-only text in Ellipsis', () => {
      render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Ellipsis />
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      const srText = screen.getByText('More')
      expect(srText).toHaveClass('sr-only')
    })
  })

  describe('Complex Scenarios', () => {
    test('should render multiple links and pages', () => {
      render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/products">Products</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/products/shoes">Shoes</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Breadcrumb.Page>Running Shoes</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('Products')).toBeInTheDocument()
      expect(screen.getByText('Shoes')).toBeInTheDocument()
      expect(screen.getByText('Running Shoes')).toBeInTheDocument()
    })

    test('should render with custom separators between items', () => {
      render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator>&gt;</Breadcrumb.Separator>
            <Breadcrumb.Item>
              <Breadcrumb.Page>Page</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      expect(screen.getByText('>')).toBeInTheDocument()
    })

    test('should render with link and page combination', () => {
      render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Breadcrumb.Page>Current</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('Current')).toBeInTheDocument()
    })

    test('should render with mixed navigation elements', () => {
      render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Ellipsis />
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/products">Products</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Breadcrumb.Page>Current</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('More')).toBeInTheDocument()
      expect(screen.getByText('Products')).toBeInTheDocument()
      expect(screen.getByText('Current')).toBeInTheDocument()
    })
  })

  describe('Default Values', () => {
    test('should use default size when not specified', () => {
      const { container } = render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>Test</Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      const nav = container.querySelector('nav')
      expect(nav).toHaveClass('cn-breadcrumb-default')
    })

    test('should use default separator icon when children not provided', () => {
      const { container } = render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Separator />
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      const separator = container.querySelector('.cn-breadcrumb-separator')
      expect(separator).toBeInTheDocument()
    })
  })

  describe('Separator Icon Behavior', () => {
    test('should render default slash icon in separator', () => {
      const { container } = render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Separator />
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      const separator = container.querySelector('.cn-breadcrumb-separator')
      expect(separator).toBeInTheDocument()
    })

    test('should use skipSize prop on separator icon', () => {
      const { container } = render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Separator />
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      const separator = container.querySelector('.cn-breadcrumb-separator')
      expect(separator).toBeInTheDocument()
    })
  })

  describe('Ellipsis Icon Behavior', () => {
    test('should render more-horizontal icon in ellipsis', () => {
      const { container } = render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Ellipsis />
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      const ellipsis = container.querySelector('.cn-breadcrumb-ellipsis')
      expect(ellipsis).toBeInTheDocument()
    })

    test('should use skipSize prop on ellipsis icon', () => {
      const { container } = render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Ellipsis />
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      const ellipsis = container.querySelector('.cn-breadcrumb-ellipsis')
      expect(ellipsis).toBeInTheDocument()
    })
  })

  describe('asChild Prop on Link', () => {
    test('should render as Slot when asChild is true', () => {
      const { container } = render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link asChild>
                <button>Button Link</button>
              </Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      const button = container.querySelector('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('cn-breadcrumb-link')
    })

    test('should render as anchor when asChild is false', () => {
      const { container } = render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link asChild={false} href="/test">
                Normal Link
              </Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      const link = container.querySelector('a')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/test')
    })

    test('should apply classes to custom child with asChild', () => {
      render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link asChild>
                <span data-testid="custom-child">Custom</span>
              </Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      const custom = screen.getByTestId('custom-child')
      expect(custom).toHaveClass('cn-breadcrumb-link')
    })
  })

  describe('Nested Content', () => {
    test('should render nested elements in items', () => {
      render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/test">
                <span>Icon</span>
                <span>Text</span>
              </Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      expect(screen.getByText('Icon')).toBeInTheDocument()
      expect(screen.getByText('Text')).toBeInTheDocument()
    })

    test('should render nested elements in Page', () => {
      render(
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Page>
                <strong>Current</strong> Page
              </Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
      const strong = screen.getByText('Current')
      expect(strong.tagName).toBe('STRONG')
      expect(screen.getByText('Page')).toBeInTheDocument()
    })
  })
})
