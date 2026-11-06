import type { languages } from 'monaco-editor'
import { describe, expect, it, vi } from 'vitest'

import { InlineAction } from '../../types/inline-actions'
import { SelectorType } from '../../types/selectors'
import { getCodeLens } from '../codelens-utils'

// Monaco's SymbolKind is an enum of numbers; we only need a couple of distinct values to discriminate on.
const SymbolKind = { Array: 17, String: 14 } as const

const makeSymbol = (name: string, kind: number): languages.DocumentSymbol => {
  const range = { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: name.length + 1 }
  return {
    name,
    kind,
    detail: '',
    range,
    selectionRange: range,
    tags: []
  } as unknown as languages.DocumentSymbol
}

const COMMAND_ID = 'my-command'

describe('getCodeLens', () => {
  it('returns no lenses when there are no inline actions', () => {
    const pathSymbolMap = new Map([['pipeline.stages.0.steps', makeSymbol('steps', SymbolKind.Array)]])

    expect(getCodeLens({ pathSymbolMap, commandId: COMMAND_ID })).toEqual([])
    expect(getCodeLens({ pathSymbolMap, inlineActions: [], commandId: COMMAND_ID })).toEqual([])
  })

  it('emits a lens for each matched path carrying the action, range and command metadata', () => {
    const stepsSymbol = makeSymbol('steps', SymbolKind.Array)
    const pathSymbolMap = new Map([
      ['pipeline.stages.0.steps', stepsSymbol],
      ['pipeline.name', makeSymbol('name', SymbolKind.String)] // outside basePath -> ignored
    ])

    const onClick = vi.fn()
    const lenses = getCodeLens<string>({
      pathSymbolMap,
      commandId: COMMAND_ID,
      inlineActions: [
        {
          selectors: [{ type: SelectorType.ContainsPath, basePath: 'pipeline.stages.', paths: [/^\d+\.steps$/] }],
          actions: [{ title: 'Add step', onClick, data: 'payload' }]
        }
      ]
    })

    expect(lenses).toHaveLength(1)
    expect(lenses[0].range).toBe(stepsSymbol.range)
    expect(lenses[0].command).toMatchObject({ id: COMMAND_ID, title: 'Add step' })

    const [commandArg] = lenses[0].command?.arguments as [
      { path: string; data: string; symbols: languages.DocumentSymbol[]; onClick: typeof onClick }
    ]
    expect(commandArg.path).toBe('pipeline.stages.0.steps')
    expect(commandArg.data).toBe('payload')
    expect(commandArg.symbols).toEqual([stepsSymbol])
    expect(commandArg.onClick).toBe(onClick)
  })

  it('produces a lens per action across every matching path', () => {
    const pathSymbolMap = new Map([
      ['pipeline.stages.0.steps', makeSymbol('steps', SymbolKind.Array)],
      ['pipeline.stages.1.steps', makeSymbol('steps', SymbolKind.Array)]
    ])

    const lenses = getCodeLens({
      pathSymbolMap,
      commandId: COMMAND_ID,
      inlineActions: [
        {
          selectors: [{ type: SelectorType.ContainsPath, basePath: 'pipeline.stages.', paths: [/^\d+\.steps$/] }],
          actions: [
            { title: 'Add step', onClick: vi.fn() },
            { title: 'Add stage', onClick: vi.fn() }
          ]
        }
      ]
    })

    // 2 matching paths x 2 actions.
    expect(lenses).toHaveLength(4)
    expect(lenses.map(l => l.command?.title)).toEqual(['Add step', 'Add stage', 'Add step', 'Add stage'])
  })

  it('suppresses an action for matches where shouldShow returns false while keeping the others', () => {
    // A real steps list (Array) and a scalar placeholder reference (String) share the same path shape.
    const pathSymbolMap = new Map([
      ['pipeline.stages.0.steps', makeSymbol('steps', SymbolKind.Array)],
      ['pipeline.stages.1.steps', makeSymbol('steps', SymbolKind.String)]
    ])

    const shouldShow = vi.fn(
      ({ symbol }: { path: string; symbol: languages.DocumentSymbol }) => symbol.kind === SymbolKind.Array
    )
    const action: InlineAction<undefined> = { title: 'Add step', onClick: vi.fn(), shouldShow }

    const lenses = getCodeLens({
      pathSymbolMap,
      commandId: COMMAND_ID,
      inlineActions: [
        {
          selectors: [{ type: SelectorType.ContainsPath, basePath: 'pipeline.stages.', paths: [/^\d+\.steps$/] }],
          actions: [action]
        }
      ]
    })

    expect(lenses).toHaveLength(1)
    const [commandArg] = lenses[0].command?.arguments as [{ path: string }]
    expect(commandArg.path).toBe('pipeline.stages.0.steps')
    // Guard is evaluated once per matched path.
    expect(shouldShow).toHaveBeenCalledTimes(2)
  })
})
