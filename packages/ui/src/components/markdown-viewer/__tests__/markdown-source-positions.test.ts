import { describe, expect, it } from 'vitest'

import {
  getSourcePositionAttributes,
  rehypeSourcePositions,
  SOURCE_POSITION_BLOCK_TAGS
} from '../markdown-source-positions'

type TestNode = {
  type: string
  tagName?: string
  position?: { start: { line: number }; end: { line: number } }
  properties?: Record<string, unknown>
  children?: TestNode[]
}

const element = (tagName: string, startLine: number, endLine: number, children: TestNode[] = []): TestNode => ({
  type: 'element',
  tagName,
  position: { start: { line: startLine }, end: { line: endLine } },
  children
})

describe('rehypeSourcePositions', () => {
  it('writes the source line range onto block elements', () => {
    const paragraph = element('p', 2, 4)
    const tree: TestNode = { type: 'root', children: [paragraph] }

    rehypeSourcePositions()(tree)

    expect(paragraph.properties).toEqual({ dataLineStart: 2, dataLineEnd: 4 })
  })

  it('annotates nested blocks, so a list item gets its own range inside its list', () => {
    const item = element('li', 5, 5)
    const list = element('ul', 5, 6, [item, element('li', 6, 6)])
    const tree: TestNode = { type: 'root', children: [list] }

    rehypeSourcePositions()(tree)

    expect(item.properties).toEqual({ dataLineStart: 5, dataLineEnd: 5 })
    expect(list.properties).toBeUndefined()
  })

  it('leaves inline elements and nodes without positions alone', () => {
    const span = element('span', 3, 3)
    const unpositioned: TestNode = { type: 'element', tagName: 'p' }
    const tree: TestNode = { type: 'root', children: [element('p', 3, 3, [span]), unpositioned] }

    rehypeSourcePositions()(tree)

    expect(span.properties).toBeUndefined()
    expect(unpositioned.properties).toBeUndefined()
  })

  it('covers the block tags the viewer renders as blocks', () => {
    expect([...SOURCE_POSITION_BLOCK_TAGS].sort()).toEqual(
      ['blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'li', 'p', 'pre', 'table'].sort()
    )
  })
})

describe('getSourcePositionAttributes', () => {
  it('maps the written properties to data attributes', () => {
    expect(getSourcePositionAttributes({ properties: { dataLineStart: 7, dataLineEnd: 9 } })).toEqual({
      'data-line-start': 7,
      'data-line-end': 9
    })
  })

  it('returns no attributes when the element has no source positions', () => {
    expect(getSourcePositionAttributes({ properties: {} })).toEqual({})
    expect(getSourcePositionAttributes(undefined)).toEqual({})
  })

  it('returns no attributes when only one of the two positions is present', () => {
    expect(getSourcePositionAttributes({ properties: { dataLineStart: 7 } })).toEqual({})
  })
})
