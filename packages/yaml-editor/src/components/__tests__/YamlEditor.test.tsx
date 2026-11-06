import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { editorMockApi } from '../../../config/mocks/monaco-editor-react'
import { YamlEditor, YamlEditorProps } from '../YamlEditor'
import { YamlEditorContextProvider } from '../YamlProvider'

beforeEach(() => editorMockApi.reset())
afterEach(() => vi.useRealTimers())

const renderYaml = (props: Partial<YamlEditorProps<unknown>> & Pick<YamlEditorProps<unknown>, 'yamlRevision'>) => {
  const onYamlRevisionChange = props.onYamlRevisionChange ?? vi.fn()
  const utils = render(
    <YamlEditorContextProvider>
      <YamlEditor {...props} onYamlRevisionChange={onYamlRevisionChange} instanceId="inst-1" />
    </YamlEditorContextProvider>
  )
  return { ...utils, onYamlRevisionChange }
}

const fireChange = (value: string, versionId: number) =>
  (editorMockApi.lastProps?.onChange as (v: string, d: { versionId: number }) => void)(value, { versionId })

describe('YamlEditor', () => {
  it('mounts as a yaml editor, seeds the content and derives the model path from the instanceId', () => {
    renderYaml({ yamlRevision: { yaml: 'pipeline: {}' } })

    const el = screen.getByTestId('monaco-editor')
    expect(el).toHaveAttribute('data-language', 'yaml')
    expect(el).toHaveAttribute('data-path', 'file://inst-1')
    expect(editorMockApi.lastEditor?.setValue).toHaveBeenCalledWith('pipeline: {}')
  })

  it('reports edits back through onYamlRevisionChange', () => {
    const { onYamlRevisionChange } = renderYaml({ yamlRevision: { yaml: '' } })

    act(() => fireChange('a: 1', 4))

    expect(onYamlRevisionChange).toHaveBeenCalledWith(
      { yaml: 'a: 1', revisionId: 4 },
      expect.objectContaining({ versionId: 4 })
    )
  })

  it('animates content replacement line-by-line when animateOnUpdate is set', () => {
    vi.useFakeTimers()
    const { rerender, onYamlRevisionChange } = renderYaml({
      yamlRevision: { yaml: 'first', revisionId: 1 },
      animateOnUpdate: true
    })

    rerender(
      <YamlEditorContextProvider>
        <YamlEditor
          yamlRevision={{ yaml: 'l1\nl2', revisionId: 2 }}
          animateOnUpdate
          onYamlRevisionChange={onYamlRevisionChange}
          instanceId="inst-1"
        />
      </YamlEditorContextProvider>
    )

    const model = editorMockApi.lastEditor?.model
    // Animation starts by clearing the model, then writes a line per interval tick.
    expect(model?.setValue).toHaveBeenCalledWith('')
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(editorMockApi.lastEditor?.executeEdits).toHaveBeenCalledWith('addLine', expect.any(Array))
  })
})
