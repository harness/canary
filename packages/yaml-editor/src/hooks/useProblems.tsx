import { RefObject, useEffect } from 'react'

import * as monaco from 'monaco-editor'

import { useYamlEditorContext } from '../components/YamlProvider'

export type UseProblems = (arg: { monacoRef: RefObject<typeof monaco | undefined> }) => void

export const useProblems: UseProblems = ({ monacoRef }): void => {
  const { setMarkers } = useYamlEditorContext()

  useEffect(() => {
    let handle: monaco.IDisposable

    const timeoutHandle = setTimeout(() => {
      const editor = monacoRef.current?.editor

      if (!editor) return

      handle = editor.onDidChangeMarkers(([resource]) => {
        const markers = editor.getModelMarkers({ resource })
        setMarkers(markers)
      })
    }, 100)

    return () => {
      clearTimeout(timeoutHandle)
      handle?.dispose()
    }
  }, [monacoRef])
}
