import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { MarkdownViewer } from '../index'

vi.mock('@/components', async importOriginal => ({
  ...(await importOriginal<typeof import('@/components')>()),
  CopyButton: () => null
}))

type HastNode = {
  type: string
  tagName?: string
  properties?: Record<string, unknown>
  children?: HastNode[]
}

const visit = (node: HastNode, visitNode: (node: HastNode) => void) => {
  visitNode(node)
  node.children?.forEach(child => visit(child, visitNode))
}

describe('MarkdownViewer additionalRehypePlugins', () => {
  it('runs a consumer plugin before sanitizing and keeps an allowed list class', () => {
    const rehypeMarkItem = () => (tree: HastNode) => {
      visit(tree, node => {
        if (node.tagName === 'li') node.properties = { className: ['bg-cn-diff-success', 'not-a-diff-class'] }
      })
    }

    const { container } = render(
      <MarkdownViewer
        source="- [Typescript](#support)"
        additionalRehypePlugins={[{ rehypePlugin: rehypeMarkItem, allowedClasses: { li: ['bg-cn-diff-success'] } }]}
      />
    )

    const item = container.querySelector('li')
    expect(item?.classList.contains('bg-cn-diff-success')).toBe(true)
    expect(item?.classList.contains('not-a-diff-class')).toBe(false)
  })

  it('keeps a span class the plugin declared and drops one it did not', () => {
    const rehypeMarkWord = () => (tree: HastNode) => {
      visit(tree, node => {
        if (node.tagName !== 'p' || !node.children) return
        node.children = [
          {
            type: 'element',
            tagName: 'span',
            properties: { className: ['custom-mark', 'not-declared'] },
            children: node.children
          }
        ]
      })
    }

    const { container } = render(
      <MarkdownViewer
        source="Hello"
        additionalRehypePlugins={[{ rehypePlugin: rehypeMarkWord, allowedClasses: { span: ['custom-mark'] } }]}
      />
    )

    const word = container.querySelector('span')
    expect(word?.textContent).toBe('Hello')
    expect(word?.classList.contains('custom-mark')).toBe(true)
    expect(word?.classList.contains('not-declared')).toBe(false)
  })

  it('leaves the tree unchanged when no plugin is passed', () => {
    const { container } = render(<MarkdownViewer source="- item" />)

    expect(container.querySelector('li')?.className ?? '').not.toContain('bg-cn-diff-success')
  })
})
