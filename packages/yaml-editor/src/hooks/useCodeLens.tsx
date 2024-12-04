import { RefObject, useEffect } from 'react'

import * as monaco from 'monaco-editor'

import { InlineAction } from '../types/inline-actions'
import { PathSelector } from '../types/selectors'
import { getCodeLens } from '../utils/codelens-utils'
import { getOutlineModel, processOutlineModel } from '../utils/outline-model-to-path'

export function useCodeLenses<T>({
  editorRef,
  inlineActions
}: {
  editorRef: RefObject<monaco.editor.IStandaloneCodeEditor | undefined | null>
  inlineActions?: { selectors: PathSelector[]; actions: InlineAction<T>[] }[]
}): void {
  useEffect(() => {
    const disposable = monaco.languages.registerCodeLensProvider('yaml', {
      provideCodeLenses: async model => {
        const outlineModel = await getOutlineModel(model)
        const pathSymbolMap = processOutlineModel(outlineModel)

        const commandId = editorRef?.current?.addCommand(0, (_, { onClick, path, range, data }) => {
          onClick({ path, range, data })
        })

        if (!commandId) return

        const lenses = getCodeLens({ pathSymbolMap, inlineActions, commandId })

        return {
          lenses,
          dispose: () => undefined
        }
      }
    })

    return disposable.dispose
  }, [inlineActions, editorRef])
}
