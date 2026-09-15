import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { Page } from '../index'

describe('Page', () => {
  test('uses the full available width by default', () => {
    const { container } = render(
      <Page.Root>
        <Page.Content>
          <div>Content</div>
        </Page.Content>
      </Page.Root>
    )

    expect(container.querySelector('#sandbox-layout-content')).not.toHaveClass('max-w-cn-page')
  })

  test('constrains non-scrollable pages to the page max width', () => {
    const { container } = render(
      <Page.Root maxWidth="page">
        <Page.Content>
          <div>Content</div>
        </Page.Content>
      </Page.Root>
    )

    expect(container.querySelector('#sandbox-layout-content')).toHaveClass('max-w-cn-page', 'mx-auto')
  })

  test('constrains the sticky header and content on scrollable pages', () => {
    render(
      <Page.Root maxWidth="page" scrollable>
        <Page.Header title="Page title" />
        <Page.Content>
          <div data-testid="page-body">Content</div>
        </Page.Content>
      </Page.Root>
    )

    expect(screen.getByRole('heading', { name: 'Page title' }).closest('.sticky')).toHaveClass(
      'max-w-cn-page',
      'mx-auto'
    )
    expect(screen.getByTestId('page-body').parentElement).toHaveClass('max-w-cn-page', 'mx-auto', 'w-full')
  })

  test('constrains HeaderV2 on scrollable pages', () => {
    render(
      <Page.Root maxWidth="page" scrollable>
        <Page.HeaderV2 title="Page title" />
      </Page.Root>
    )

    expect(screen.getByRole('heading', { name: 'Page title' }).closest('.sticky')).toHaveClass(
      'max-w-cn-page',
      'mx-auto'
    )
  })
})
