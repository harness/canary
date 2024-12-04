import * as monaco from 'monaco-editor'

import { InlineAction } from '../types/inline-actions'
import { PathSelector, SelectorType } from '../types/selectors'

export interface CommandArg<T> extends Pick<InlineAction<T>, 'onClick' | 'data'> {
  range: monaco.IRange
  symbols: monaco.languages.DocumentSymbol[]
  path: string
}

export interface GetCodeLensProps<T> {
  pathSymbolMap: Map<string, monaco.languages.DocumentSymbol>
  inlineActions?: { selectors: PathSelector[]; actions: InlineAction<T>[] }[]
  commandId: string | any // TODO
}

export function getCodeLens<T>(props: GetCodeLensProps<T>) {
  const { pathSymbolMap, inlineActions = [], commandId } = props

  const pathSymbolMapObj = Object.fromEntries(pathSymbolMap.entries())

  const lenses: monaco.languages.CodeLens[] = []

  inlineActions?.forEach(inlineAction => {
    const actions = inlineAction.actions
    const selectors = inlineAction.selectors

    selectors.forEach(selector => {
      switch (selector.type) {
        case SelectorType.ContainsPath: {
          selector.paths.forEach(partRegexp => {
            const pathSymbolArr = Object.keys(pathSymbolMapObj).map(path => ({
              fullPath: path,
              path,
              symbol: pathSymbolMapObj[path]
            }))

            //console.log(pathSymbolArr)

            let candidateRelativePaths = pathSymbolArr.filter(pathSymbol => {
              return pathSymbol.path.startsWith(selector.basePath)
            })

            candidateRelativePaths = candidateRelativePaths.map(pathSymbol => ({
              ...pathSymbol,
              path: pathSymbol.path.substring(selector.basePath.length)
            }))

            //console.log(candidateRelativePaths)

            const finalPaths = candidateRelativePaths.filter(pathSymbol => {
              return partRegexp.test(pathSymbol.path)
            })

            //console.log(finalPaths, 'finalPaths')

            finalPaths.forEach(pathSymbol => {
              const path = pathSymbol.fullPath
              const symbol = pathSymbol.symbol
              const range = symbol.range

              actions.forEach(action => {
                const commandArg = {
                  range,
                  symbols: [symbol],
                  onClick: action.onClick,
                  data: action.data,
                  path: path
                }

                lenses.push({
                  range,
                  command: {
                    id: commandId,
                    title: action.title,
                    arguments: [commandArg]
                  }
                })
              })
            })
          })
          break
        }
      }
    })
  })

  return lenses
}
