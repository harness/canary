import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

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
})
