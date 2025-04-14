import { RefObject, useEffect } from 'react'

import * as monaco from 'monaco-editor'

import { useYamlEditorContext } from '../components/YamlProvider'

export type UseProblems = (arg: {
  instanceId?: string
  monacoRef: RefObject<typeof monaco | undefined>
  editorRef: RefObject<monaco.editor.IStandaloneCodeEditor | null | undefined>
}) => void

export const useProblems: UseProblems = ({ monacoRef, editorRef, instanceId }): void => {
  const { setMarkers } = useYamlEditorContext()

  useEffect(() => {
    let handle: monaco.IDisposable

    const timeoutHandle = setTimeout(() => {
      const editor = monacoRef.current?.editor

      if (!editor) return

      // NOTE: Handler editor.onDidChangeMarkers triggers on any schema validation. Its a global event for all YamlEditor instances.
      handle = editor.onDidChangeMarkers(uris => {
        const model = editorRef.current?.getModel()
        if (!model) return

        const modelUri = model.uri.toString()

        if (uris.some(uri => uri.toString() === modelUri)) {
          // Marker change occurred for this editor's model
          const markers = monaco.editor.getModelMarkers({ resource: model.uri })
          setMarkers(markers)
        }
      })
    }, 100)

    return () => {
      clearTimeout(timeoutHandle)
      handle?.dispose()
    }
  }, [monacoRef, instanceId, setMarkers])
}
