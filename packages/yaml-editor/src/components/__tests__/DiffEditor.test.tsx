import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { editorMockApi } from '../../../config/mocks/monaco-editor-react'
import { CodeDiffEditor } from '../DiffEditor'

beforeEach(() => editorMockApi.reset())

describe('CodeDiffEditor', () => {
  it('passes original, modified, language and the resolved theme to the diff editor', () => {
    render(<CodeDiffEditor original="a: 1" modified="a: 2" language="yaml" theme="light" height="100px" />)

    expect(screen.getByTestId('monaco-editor')).toHaveAttribute('data-language', 'yaml')
    expect(screen.getByTestId('monaco-editor')).toHaveAttribute('data-theme', 'light')
    expect(editorMockApi.lastProps?.original).toBe('a: 1')
    expect(editorMockApi.lastProps?.modified).toBe('a: 2')
  })

  it('merges caller options over the diff defaults (codeLens stays off)', () => {
    render(<CodeDiffEditor original="x" modified="y" language="json" options={{ readOnly: true }} />)

    const options = editorMockApi.lastProps?.options as Record<string, unknown>
    expect(options.readOnly).toBe(true)
    expect(options.codeLens).toBe(false)
  })
})
