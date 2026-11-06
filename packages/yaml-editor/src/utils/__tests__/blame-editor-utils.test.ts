import { describe, expect, it } from 'vitest'

import { BlameItem } from '../../types/blame'
import { createCommitMessage, getMonacoEditorCommitCss, getMonacoEditorCss } from '../blame-editor-utils'

describe('createCommitMessage', () => {
  const PREFIX = ' '.repeat(25)
  const SUFFIX = ' '.repeat(10)

  it('truncates messages longer than the limit with an ellipsis', () => {
    // limit 8 -> slice(0, 5) + '...'
    expect(createCommitMessage('abcdefghij', 8)).toBe(`${PREFIX}abcde...${SUFFIX}`)
  })

  it('right-pads messages shorter than the limit to the fixed width', () => {
    expect(createCommitMessage('abc', 6)).toBe(`${PREFIX}abc   ${SUFFIX}`)
  })

  it('leaves messages exactly at the limit unchanged', () => {
    expect(createCommitMessage('abcdef', 6)).toBe(`${PREFIX}abcdef${SUFFIX}`)
  })
})

describe('getMonacoEditorCss', () => {
  it('scopes every rule to the instance id and omits margin repositioning when left-aligned', () => {
    const left = getMonacoEditorCss({ instanceId: 'inst1', lineNumbersPosition: 'left' })
    expect(left).toContain('.monaco-editor-inst1 .blame-editor-separator')
    expect(left).not.toContain('editor-scrollable')
  })

  it('adds margin repositioning rules when centered', () => {
    const center = getMonacoEditorCss({ instanceId: 'inst1', lineNumbersPosition: 'center' })
    expect(center).toContain('.monaco-editor-inst1 .monaco-scrollable-element.editor-scrollable')
    expect(center).toContain('.monaco-editor-inst1 .margin')
  })
})

describe('getMonacoEditorCommitCss', () => {
  const baseBlame = (overrides: Partial<BlameItem> = {}): BlameItem =>
    ({
      fromLineNumber: 1,
      toLineNumber: 2,
      commitInfo: { author: { when: new Date().toISOString(), initials: 'SA' } },
      ...overrides
    }) as unknown as BlameItem

  it('emits a before/after rule for the first line and a filler rule for the rest', () => {
    const css = getMonacoEditorCommitCss({ instanceId: 'x', blameData: [baseBlame()], dateWidth: 50, avatarSize: 20 })

    // First line carries the commit date + avatar initials; the following line only gets a filler.
    expect(css).toContain('.blame-editor-commit-1:before')
    expect(css).toContain('.blame-editor-commit-1:after')
    expect(css).toContain("content: 'SA'")
    expect(css).toContain('.blame-editor-commit-2:before')
    expect(css).not.toContain('.blame-editor-commit-2:after')
  })

  it('uses the avatar url as a background when present', () => {
    const css = getMonacoEditorCommitCss({
      instanceId: 'x',
      blameData: [
        baseBlame({
          commitInfo: { author: { when: new Date().toISOString(), avatarUrl: 'http://a/b.png' } }
        } as Partial<BlameItem>)
      ],
      dateWidth: 50,
      avatarSize: 20
    })

    expect(css).toContain("background: url('http://a/b.png')")
  })
})
