import React from 'react'

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'

import { YamlOutput } from '../yaml-output'

vi.mock('@harnessio/yaml-editor', () => ({
  YamlEditor: ({ yamlRevision, onYamlRevisionChange, options }: any) => (
    <textarea
      data-testid="yaml-editor"
      readOnly={!!options?.readOnly}
      value={yamlRevision.yaml}
      onChange={e => onYamlRevisionChange({ yaml: e.target.value, revisionId: 1 }, {})}
    />
  )
}))
vi.mock('@hooks/use-monaco-theme', () => ({ useMonacoTheme: () => ({ defaultTheme: 'light-std-std', themes: [] }) }))

describe('YamlOutput', () => {
  test('renders value and title', () => {
    render(<YamlOutput value="pipeline: {}" title="my_ci_pipeline" />)
    expect(screen.getByDisplayValue('pipeline: {}')).toBeInTheDocument()
    expect(screen.getByText('my_ci_pipeline')).toBeInTheDocument()
  })

  test('fires onChange with edited yaml string', () => {
    const onChange = vi.fn()
    render(<YamlOutput value="a: 1" onChange={onChange} />)
    fireEvent.change(screen.getByTestId('yaml-editor'), { target: { value: 'a: 2' } })
    expect(onChange).toHaveBeenCalledWith('a: 2')
  })

  test('readOnly locks the editor', () => {
    render(<YamlOutput value="a: 1" readOnly />)
    expect(screen.getByTestId('yaml-editor')).toHaveAttribute('readOnly')
  })

  test('missing onChange sets readOnly', () => {
    render(<YamlOutput value="a: 1" />)
    expect(screen.getByTestId('yaml-editor')).toHaveAttribute('readOnly')
  })

  test('Run button fires onRun with current value', () => {
    const onRun = vi.fn()
    render(<YamlOutput value="a: 1" onRun={onRun} runLabel="Execute" />)
    fireEvent.click(screen.getByRole('button', { name: 'Execute' }))
    expect(onRun).toHaveBeenCalledWith('a: 1')
  })

  test('Run button respects runDisabled', () => {
    const onRun = vi.fn()
    render(<YamlOutput value="a: 1" onRun={onRun} runDisabled />)
    expect(screen.getByRole('button', { name: 'Run' })).toBeDisabled()
  })

  test('Visual toggle segment is disabled', () => {
    render(<YamlOutput value="a: 1" />)
    const buttons = screen.getAllByRole('radio')
    const visualButton = buttons.find(btn => btn.textContent?.toLowerCase().includes('visual'))
    expect(visualButton).toBeDisabled()
  })
})
