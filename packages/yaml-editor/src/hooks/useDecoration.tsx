import React, { RefObject, useEffect, useMemo, useState } from 'react'
import * as monaco from 'monaco-editor'
import { getOutlineModel, processOutlineModel } from '../utils/outline-model-to-path'

type UseDecoration = (arg: {
  editorRef?: RefObject<monaco.editor.IStandaloneCodeEditor>
  selection?: {
    path: string
    className: string
    revealInCenter?: boolean
  }
}) => void

export const useDecoration: UseDecoration = ({ editorRef, selection }) => {
  const [range, setRange] = useState<monaco.IRange>()

  const computeRange = useMemo(
    () =>
      async (_editorRef?: RefObject<monaco.editor.IStandaloneCodeEditor>, path?: string, revealInCenter?: boolean) => {
        const model = editorRef?.current?.getModel()

        if (!model || !path) {
          return setRange(undefined)
        }

        const outlineModel = await getOutlineModel(model)
        const pathSymbolMap = processOutlineModel(outlineModel)
        const range = pathSymbolMap.get(path)?.range

        if (range) {
          setRange(range)

          if (revealInCenter) {
            editorRef?.current?.revealLineInCenter(range.startLineNumber)
          }
        }
      },
    []
  )

  useEffect(() => {
    const timeout = setTimeout(() => computeRange(editorRef, selection?.path, selection?.revealInCenter), 100)

    return () => clearTimeout(timeout)
  }, [selection?.path, selection?.revealInCenter, editorRef, computeRange])

  useEffect(() => {
    if (!range) return

    const decorations = editorRef?.current?.createDecorationsCollection([
      {
        range,
        options: {
          isWholeLine: false,
          className: selection?.className
        }
      }
    ])

    return () => decorations?.clear()
  }, [range, editorRef, selection?.className])
}
