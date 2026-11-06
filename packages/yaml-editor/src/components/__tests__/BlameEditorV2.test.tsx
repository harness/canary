import { useEffect } from 'react'

import { act, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { editorMockApi } from '../../../config/mocks/monaco-editor-react'
import { flushMutations, triggerIntersection } from '../../../config/test-observers'
import { BlameItem } from '../../types/blame'
import { BlameEditorV2 } from '../BlameEditorV2'

beforeEach(() => editorMockApi.reset())

const blameData: BlameItem[] = [
  { fromLineNumber: 1, toLineNumber: 2, infoContent: <div>info</div> },
  { fromLineNumber: 3, toLineNumber: 3 }
]

describe('BlameEditorV2', () => {
  it('seeds the code and draws view-zones and decorations for every blamed line on mount', () => {
    render(<BlameEditorV2 code={'a\nb\nc'} language="yaml" blameData={blameData} />)

    const editor = editorMockApi.lastEditor
    expect(editor?.setValue).toHaveBeenCalledWith('a\nb\nc')
    expect(editor?.changeViewZones).toHaveBeenCalled()
    const decorations = editor?.createDecorationsCollection.mock.calls[0][0] as unknown[]
    expect(decorations).toHaveLength(3)
  })

  it('renders an instance-scoped style block and the editor', () => {
    const { container } = render(<BlameEditorV2 code="a" language="yaml" blameData={blameData} />)
    expect(container.querySelector('style')?.innerHTML).toContain('.monaco-editor-')
    expect(screen.getByTestId('monaco-editor')).toBeInTheDocument()
  })

  it('renders infoContent lazily, only once its view-zone intersects the viewport', () => {
    const mounted = vi.fn()
    const Info = () => {
      useEffect(() => mounted(), [])
      return <div>info</div>
    }
    const data: BlameItem[] = [{ fromLineNumber: 1, toLineNumber: 2, infoContent: <Info /> }]

    render(<BlameEditorV2 code="a" language="yaml" blameData={data} />)
    // Not mounted yet: the view-zone holder has not intersected the viewport.
    expect(mounted).not.toHaveBeenCalled()

    act(() => triggerIntersection())
    expect(mounted).toHaveBeenCalledTimes(1)
  })

  it('offsets the line numbers from the scrollable content when positioned center', () => {
    const { container, rerender } = render(
      <BlameEditorV2 className="holder" code="a" language="yaml" blameData={blameData} lineNumbersPosition="center" />
    )
    const holder = container.querySelector('.holder') as HTMLDivElement

    const linesContent = document.createElement('div')
    linesContent.className = 'lines-content'
    linesContent.style.left = '5px'
    holder.appendChild(linesContent)

    rerender(
      <BlameEditorV2 className="holder" code="a" language="yaml" blameData={blameData} lineNumbersPosition="center" />
    )
    flushMutations()

    expect(holder.style.getPropertyValue('--line-number-offset')).toBe('471px')
    expect(holder.style.getPropertyValue('--line-number-display')).toBe('block')
  })
})
