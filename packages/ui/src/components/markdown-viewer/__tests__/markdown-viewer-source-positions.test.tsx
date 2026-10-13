import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { MarkdownViewer } from '../index'

// The real CopyButton needs a TooltipProvider; the position attributes don't depend on it.
vi.mock('@/components', async importOriginal => ({
  ...(await importOriginal<typeof import('@/components')>()),
  CopyButton: () => null
}))

describe('MarkdownViewer withSourcePositions', () => {
  it('marks headings, paragraphs and list items with their source line numbers', () => {
    const source = ['# Title', '', 'First paragraph.', '', '- item one', '- item two'].join('\n')

    const { container } = render(<MarkdownViewer source={source} withSourcePositions />)

    const heading = container.querySelector('h1')
    expect(heading?.getAttribute('data-line-start')).toBe('1')
    expect(heading?.getAttribute('data-line-end')).toBe('1')

    const paragraph = container.querySelector('p')
    expect(paragraph?.getAttribute('data-line-start')).toBe('3')
    expect(paragraph?.getAttribute('data-line-end')).toBe('3')

    const items = Array.from(container.querySelectorAll('li'))
    expect(items.map(item => item.getAttribute('data-line-start'))).toEqual(['5', '6'])
  })

  it('marks fenced code blocks with the line range of the whole block', () => {
    const source = ['Intro', '', '```ts', 'const a = 1', '```'].join('\n')

    const { container } = render(<MarkdownViewer source={source} withSourcePositions />)

    const codeBlock = container.querySelector('pre')?.parentElement
    expect(codeBlock?.getAttribute('data-line-start')).toBe('3')
    expect(codeBlock?.getAttribute('data-line-end')).toBe('5')
  })

  it('adds no source-position attributes by default', () => {
    const source = ['# Title', '', 'Paragraph.', '', '- item'].join('\n')

    const { container } = render(<MarkdownViewer source={source} />)

    expect(container.querySelectorAll('[data-line-start]')).toHaveLength(0)
    expect(container.querySelectorAll('[data-line-end]')).toHaveLength(0)
  })
})
