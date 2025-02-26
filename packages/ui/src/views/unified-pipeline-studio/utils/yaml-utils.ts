import { parseDocument, YAMLSeq } from 'yaml'

import { updateYamlDocAtPath } from './yaml-doc-utils'

// TODO: split this to addToArray and insertInArray
export function injectItemInArray(
  yaml: string,
  injectData: { path: string; position: 'after' | 'before' | 'in' | undefined; item: unknown }
): string {
  const { path, position, item } = injectData

  // if position is "last", path points to an array
  if (position === 'in') {
    const doc = parseDocument(yaml)

    const pathArr = path.split('.')
    // NOTE: exception for minimal pipeline: "pipeline: {}"
    if (path === 'pipeline' || path === 'pipeline.stages') {
      const pl = doc.getIn(['pipeline']) as { flow: boolean }
      pl.flow = false
    }

    if (!doc.hasIn(pathArr)) {
      // NOTE: if array does not exist, add array with item
      doc.addIn(pathArr, [item])
    } else {
      doc.addIn(pathArr, item)
    }

    const arr = doc.getIn(path.split('.')) as { flow: boolean } //as Collection
    arr.flow = false

    return doc.toString()
  }
  // if position is "after" or "before", path points to an array element
  else if (position === 'after' || position === 'before') {
    const pathArr = path.split('.')
    const index = parseInt(pathArr.pop() ?? '0')

    const doc = parseDocument(yaml)

    const yamlItem = doc.createNode(item)
    const collection = doc.getIn(pathArr) as YAMLSeq
    collection.items.splice(position == 'before' ? index : index + 1, 0, yamlItem)

    return doc.toString()
  }

  return yaml
}

export function updateItemInArray(yaml: string, injectData: { path: string; item: unknown }): string {
  const { path, item } = injectData
  const pathArr = path.split('.')

  const doc = parseDocument(yaml)

  updateYamlDocAtPath(pathArr, item, doc)

  return doc.toString()
}

export function deleteItemInArray(yaml: string, data: { path: string }) {
  const { path } = data

  const doc = parseDocument(yaml)

  doc.deleteIn(path.split('.'))

  return doc.toString()
}
