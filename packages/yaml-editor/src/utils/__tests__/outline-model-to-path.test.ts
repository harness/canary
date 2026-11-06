import { languages } from 'monaco-editor'
import { describe, expect, it, vi } from 'vitest'

import { OutlineModelValueInternal, RootOutlineModelInternal } from '../../types/monaco'
import { MonacoGlobals } from '../monaco-globals'
import { getOutlineModel, processOutlineModel } from '../outline-model-to-path'

const {
  Module,
  Array: ArrayKind,
  String: StringKind
} = languages.SymbolKind as unknown as {
  Module: number
  Array: number
  String: number
}

const sym = (name: string, kind: number): languages.DocumentSymbol =>
  ({
    name,
    kind,
    range: { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 }
  }) as unknown as languages.DocumentSymbol

const node = (
  symbol: languages.DocumentSymbol,
  children: Record<string, OutlineModelValueInternal> = {}
): OutlineModelValueInternal => ({ symbol, children: new Map(Object.entries(children)) })

describe('processOutlineModel', () => {
  it('flattens object, array and primitive nodes into dotted paths', () => {
    // pipeline (object)
    //   name: build          (primitive scalar)
    //   stages:              (array)
    //     - step: echo       (object -> primitive scalar)
    const root: RootOutlineModelInternal = {
      children: new Map(
        Object.entries({
          pipeline: node(sym('pipeline', Module), {
            name: node(sym('name', StringKind), { '0': node(sym('build', StringKind)) }),
            stages: node(sym('stages', ArrayKind), {
              '0': node(sym('stage1', Module), {
                step: node(sym('step', StringKind), { '0': node(sym('echo', StringKind)) })
              })
            })
          })
        })
      )
    }

    const map = processOutlineModel(root)

    expect([...map.keys()].sort()).toEqual(
      [
        'pipeline',
        'pipeline.name',
        'pipeline.name.build',
        'pipeline.stages',
        'pipeline.stages.0',
        'pipeline.stages.0.step',
        'pipeline.stages.0.step.echo'
      ].sort()
    )
    expect(map.get('pipeline.stages.0')?.name).toBe('stage1')
  })

  it('returns an empty map for an empty outline', () => {
    expect(processOutlineModel({ children: new Map() }).size).toBe(0)
  })
})

describe('getOutlineModel', () => {
  it('creates an OutlineModel from the model and the language document-symbol provider', async () => {
    const documentSymbolProvider = { id: 'dsp' }
    const createResult = { children: new Map() }
    const create = vi.fn().mockResolvedValue(createResult)
    const ILanguageFeaturesService = Symbol('ILanguageFeaturesService')

    MonacoGlobals.set({
      ILanguageFeaturesService,
      OutlineModel: { create },
      StandaloneServices: { get: vi.fn().mockReturnValue({ documentSymbolProvider }) }
    } as unknown as Parameters<typeof MonacoGlobals.set>[0])

    const model = { id: 'model' } as unknown as Parameters<typeof getOutlineModel>[0]
    const result = await getOutlineModel(model)

    expect(create).toHaveBeenCalledWith(documentSymbolProvider, model)
    expect(result).toBe(createResult)
  })
})
