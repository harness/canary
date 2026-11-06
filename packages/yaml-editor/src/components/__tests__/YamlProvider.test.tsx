import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { createFakeEditor } from '../../../config/mocks/monaco-editor-react'
import { useYamlEditorContext, YamlEditorContextProvider } from '../YamlProvider'

const editor = createFakeEditor()

const Consumer = () => {
  const ctx = useYamlEditorContext()
  return (
    <div>
      <span data-testid="markers">{ctx.markers.length}</span>
      <span data-testid="has-editor">{String(ctx.editor !== null)}</span>
      <button onClick={() => ctx.setMarkers([{ message: 'a' } as never, { message: 'b' } as never])}>markers</button>
      <button onClick={() => ctx.setEditor(editor as never)}>set-editor</button>
      <button onClick={() => ctx.updateCursorPosition({ column: 4, lineNumber: 9 })}>cursor</button>
    </div>
  )
}

const renderProvider = () =>
  render(
    <YamlEditorContextProvider>
      <Consumer />
    </YamlEditorContextProvider>
  )

describe('YamlEditorContextProvider', () => {
  it('starts with empty markers and no editor', () => {
    renderProvider()
    expect(screen.getByTestId('markers')).toHaveTextContent('0')
    expect(screen.getByTestId('has-editor')).toHaveTextContent('false')
  })

  it('updates markers through setMarkers', () => {
    renderProvider()
    fireEvent.click(screen.getByText('markers'))
    expect(screen.getByTestId('markers')).toHaveTextContent('2')
  })

  it('stores the editor and drives the cursor through updateCursorPosition', () => {
    renderProvider()
    fireEvent.click(screen.getByText('set-editor'))
    expect(screen.getByTestId('has-editor')).toHaveTextContent('true')

    fireEvent.click(screen.getByText('cursor'))
    expect(editor.setPosition).toHaveBeenCalledWith({ column: 4, lineNumber: 9 })
    expect(editor.revealLineInCenterIfOutsideViewport).toHaveBeenCalledWith(9)
    expect(editor.focus).toHaveBeenCalled()
  })

  it('no-ops updateCursorPosition when no editor is set', () => {
    // Default context value: updateCursorPosition is a safe noop.
    expect(() => {
      renderProvider()
      fireEvent.click(screen.getByText('cursor'))
    }).not.toThrow()
    vi.clearAllMocks()
  })
})
