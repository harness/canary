import { editor, languages } from 'monaco-editor'

import { OutlineModelValueInternal, RootOutlineModelInternal } from '../types/monaco'
import { MonacoGlobals } from './monaco-globals'

export async function getOutlineModel(model: editor.ITextModel): Promise<RootOutlineModelInternal> {
  const monacoGlobals = MonacoGlobals.get()
  const { documentSymbolProvider } = monacoGlobals.StandaloneServices.get(monacoGlobals.ILanguageFeaturesService)
  const outlineModel = await monacoGlobals.OutlineModel.create(documentSymbolProvider, model)
  return outlineModel as unknown as RootOutlineModelInternal
}

export function processOutlineModel(outlineModel: RootOutlineModelInternal) {
  const pathSymbolMap: Map<string, languages.DocumentSymbol> = new Map()

  processChildrenRec({
    pathSymbolMap,
    parentPath: '',
    children: outlineModel.children,
    parentKind: languages.SymbolKind.Module
  })

  return pathSymbolMap
}

function processChildrenRec(props: {
  pathSymbolMap: Map<string, languages.DocumentSymbol>
  parentPath: string
  children: Map<string, OutlineModelValueInternal>
  parentKind: languages.SymbolKind
}) {
  switch (props.parentKind) {
    case languages.SymbolKind.Module: {
      processObject(props)
      break
    }
    case languages.SymbolKind.Array: {
      processArray(props)
      break
    }
    default: {
      processPrimitive(props)
    }
  }
}

function processObject(props: {
  pathSymbolMap: Map<string, languages.DocumentSymbol>
  parentPath: string
  children: Map<string, OutlineModelValueInternal>
  parentKind: languages.SymbolKind
}) {
  props.children.forEach(child => {
    let childPath = props.parentPath

    if (child.symbol) {
      childPath = props.parentPath ? `${props.parentPath}.${child.symbol.name}` : child.symbol.name

      props.pathSymbolMap.set(childPath, child.symbol)
    }

    processChildrenRec({
      pathSymbolMap: props.pathSymbolMap,
      parentPath: childPath,
      children: child.children,
      parentKind: child?.symbol?.kind ?? props.parentKind
    })
  })
}

function processArray(props: {
  pathSymbolMap: Map<string, languages.DocumentSymbol>
  parentPath: string
  children: Map<string, OutlineModelValueInternal>
  parentKind: languages.SymbolKind
}) {
  let idx = 0
  props.children.forEach(child => {
    const childPath = props.parentPath ? `${props.parentPath}.${idx}` : `${idx}`

    props.pathSymbolMap.set(childPath, child.symbol)

    idx += 1

    processChildrenRec({
      pathSymbolMap: props.pathSymbolMap,
      parentPath: childPath,
      children: child.children,
      parentKind: child.symbol.kind
    })
  })
}

function processPrimitive(props: {
  pathSymbolMap: Map<string, languages.DocumentSymbol>
  parentPath: string
  children: Map<string, OutlineModelValueInternal>
  parentKind: languages.SymbolKind
}) {
  const child = props.children.get('0')

  if (child) {
    const childPath = props.parentPath ? `${props.parentPath}.${child.symbol.name}` : child?.symbol.name

    props.pathSymbolMap.set(childPath, child.symbol)
  }
}
