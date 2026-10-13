import { RouterContextProvider } from '@/context/router-context'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { MarkdownViewer } from '../index'

// MarkdownViewer reads the router context. The provider builds a new context value on every render, so a
// parent re-render re-renders the viewer even though its props did not change.
describe('MarkdownViewer element stability', () => {
  it('keeps the same paragraph element when a parent re-renders the router context', () => {
    const source = ['# Title', '', 'First paragraph.'].join('\n')
    const tree = (
      <RouterContextProvider>
        <MarkdownViewer source={source} withSourcePositions />
      </RouterContextProvider>
    )

    const { container, rerender } = render(tree)
    const paragraph = container.querySelector('p')
    paragraph?.classList.add('kept-by-consumer')

    rerender(tree)

    expect(container.querySelector('p')).toBe(paragraph)
    expect(container.querySelector('p')?.classList.contains('kept-by-consumer')).toBe(true)
  })
})
