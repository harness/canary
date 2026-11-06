import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { editorMockApi } from '../../../config/mocks/monaco-editor-react'
import { flushMutations } from '../../../config/test-observers'
import { BlameItem } from '../../types/blame'
import { BlameEditor } from '../BlameEditor'

beforeEach(() => editorMockApi.reset())

const blameData: BlameItem[] = [
  {
    fromLineNumber: 1,
    toLineNumber: 2,
    commitInfo: { title: 'init', author: { when: new Date().toISOString(), initials: 'SA' } }
  },
  {
    fromLineNumber: 3,
    toLineNumber: 3,
    commitInfo: { title: 'next', author: { when: new Date().toISOString(), initials: 'SA' } }
  }
] as unknown as BlameItem[]

describe('BlameEditor', () => {
  it('seeds the code, draws separator view-zones and blame decorations on mount', () => {
    render(<BlameEditor code={'a\nb\nc'} language="yaml" blameData={blameData} />)

    const editor = editorMockApi.lastEditor
    expect(editor?.setValue).toHaveBeenCalledWith('a\nb\nc')
    expect(editor?.changeViewZones).toHaveBeenCalled()
    expect(editor?.createDecorationsCollection).toHaveBeenCalled()
    // One decoration per blamed line (lines 1,2,3).
    const decorations = editor?.createDecorationsCollection.mock.calls[0][0] as unknown[]
    expect(decorations).toHaveLength(3)
  })

  it('skips separator view-zones when showSeparators is false', () => {
    render(<BlameEditor code="a" language="yaml" blameData={blameData} showSeparators={false} />)
    expect(editorMockApi.lastEditor?.changeViewZones).not.toHaveBeenCalled()
  })

  it('renders a style block scoped to the editor instance', () => {
    const { container } = render(<BlameEditor code="a" language="yaml" blameData={blameData} />)
    expect(container.querySelector('style')?.innerHTML).toContain('.monaco-editor-')
    expect(screen.getByTestId('monaco-editor')).toBeInTheDocument()
  })

  it('pushes new code into the editor when the code prop changes', () => {
    const { rerender } = render(<BlameEditor code="a" language="yaml" blameData={blameData} />)
    const editor = editorMockApi.lastEditor
    editor?.setValue.mockClear()

    rerender(<BlameEditor code="b" language="yaml" blameData={blameData} />)
    expect(editor?.setValue).toHaveBeenCalledWith('b')
  })

  it('offsets the line numbers from the scrollable content when positioned center', () => {
    const { container, rerender } = render(
      <BlameEditor className="holder" code="a" language="yaml" blameData={blameData} lineNumbersPosition="center" />
    )
    const holder = container.querySelector('.holder') as HTMLDivElement

    // The editor renders the scrollable `.lines-content` element asynchronously; simulate it, then
    // re-run the positioning effect (it has no deps, so it runs on every render).
    const linesContent = document.createElement('div')
    linesContent.className = 'lines-content'
    linesContent.style.left = '5px'
    holder.appendChild(linesContent)

    rerender(
      <BlameEditor className="holder" code="a" language="yaml" blameData={blameData} lineNumbersPosition="center" />
    )
    flushMutations()

    // 450 (blame width) + 16 + 5 (lines-content left)
    expect(holder.style.getPropertyValue('--line-number-offset')).toBe('471px')
    expect(holder.style.getPropertyValue('--line-number-display')).toBe('block')
  })
})
