import { forOwn } from 'lodash-es'
import { Pair, Scalar, YAMLMap, YAMLSeq, Document } from 'yaml'

type YamlVariableType = 'object' | 'array' | 'number' | 'string' | 'boolean' | 'undefined' | 'unknown'

function isPrimitiveType(type: YamlVariableType) {
  return ['number', 'string', 'boolean'].includes(type)
}

function getYamlElementType(el: YAMLMap | YAMLSeq | string | number | boolean | unknown): YamlVariableType {
  if (typeof el === 'undefined') {
    return 'undefined'
  } else if (el instanceof YAMLMap) {
    return 'object'
  } else if (el instanceof YAMLSeq) {
    return 'array'
  } else if (el instanceof Scalar) {
    return getYamlElementType(el.value)
  } else if (typeof el === 'number') {
    return 'number'
  } else if (typeof el === 'string') {
    return 'string'
  } else if (typeof el === 'boolean') {
    return 'boolean'
  }
  return 'unknown'
}

function getDataType(obj: Record<string, unknown> | unknown[] | string | number | boolean | unknown): YamlVariableType {
  if (typeof obj === 'undefined') {
    return 'undefined'
  } else if (obj instanceof Object && !(obj instanceof Array)) {
    return 'object'
  } else if (obj instanceof Array) {
    return 'array'
  } else if (typeof obj === 'number') {
    return 'number'
  } else if (typeof obj === 'string') {
    return 'string'
  } else if (typeof obj === 'boolean') {
    return 'boolean'
  }
  return 'unknown'
}

/** NOTE: updateYamlPrimitive mutates targetEl */
function updateYamlPrimitive(targetEl: Scalar, val: unknown) {
  targetEl.value = val
}

/** NOTE: updateYamlArray mutates targetEl */
function updateYamlArray(targetEl: YAMLSeq, arr: unknown[], doc: Document.Parsed) {
  targetEl.items = arr.reduce<unknown[]>((acc, arrItem, idx) => {
    const item = targetEl.items[idx]
    const yamlElementType = getYamlElementType(item)
    const dataType = getDataType(arrItem)

    // add element
    if (yamlElementType === 'undefined') {
      const yamlItem = doc.createNode(arrItem)
      acc.push(yamlItem)
      return acc
    }

    // update element if same type
    if (yamlElementType === dataType) {
      if (isPrimitiveType(yamlElementType)) {
        updateYamlPrimitive(item as Scalar, arr[idx])
      } else if (yamlElementType === 'object') {
        updateYamlObject(item as YAMLMap, arr[idx] as Record<string, unknown>, doc)
      } else if (yamlElementType === 'array') {
        updateYamlArray(item as YAMLSeq, arr[idx] as unknown[], doc)
      } else {
        console.log('Unknown data type:')
        console.log(item)
      }
    }
    // override element if different type
    else {
      const yamlItem = doc.createNode(arrItem)
      acc.push(yamlItem)
      return acc
    }

    acc.push(item)
    return acc
  }, [])

  // delete element
  if (targetEl.items.length > arr.length) {
    targetEl.items.splice(arr.length)
  }
}

/** NOTE: updateYamlObject mutates targetEl */
function updateYamlObject(targetEl: YAMLMap, obj: Record<string, unknown>, doc: Document.Parsed) {
  // update or delete
  targetEl.items = targetEl.items.reduce<Pair<unknown, unknown>[]>((acc, item) => {
    // TODO: this "if" may be not needed
    if (item.key instanceof Scalar) {
      const propertyName = item.key.value

      if (propertyName in obj) {
        const yamlElementType = getYamlElementType(item.value)
        const dataType = getDataType(obj[propertyName])

        if (dataType === 'undefined') {
          // NOTE: undefined value is ignored/deleted
          return acc
        }

        // update element if same type
        if (yamlElementType === dataType) {
          if (isPrimitiveType(yamlElementType)) {
            updateYamlPrimitive(item.value as Scalar, obj[propertyName])
          } else if (yamlElementType === 'object') {
            updateYamlObject(item.value as YAMLMap, obj[propertyName] as Record<string, unknown>, doc)
          } else if (yamlElementType === 'array') {
            updateYamlArray(item.value as YAMLSeq, obj[propertyName] as unknown[], doc)
          } else {
            console.log('Unknown data type:')
            console.log(item)
          }
        }
        // override element if different type
        else {
          const yamlItem = doc.createNode(obj[propertyName])
          item.value = yamlItem
        }

        acc.push(item)
      } else {
        // delete element
        // NOTE: No command required. We are deleting element by not adding it to acc.
      }
    }

    return acc
  }, [])

  // add elements
  const existingProperties: string[] = targetEl.items.map(item => (item.key instanceof Scalar ? item.key.value : ''))
  forOwn(obj, (objItem, key) => {
    if (!existingProperties.includes(key) && typeof objItem !== 'undefined') {
      const yamlItem = doc.createPair(key, objItem)
      targetEl.items.push(yamlItem)
    }
  })
}

export function updateYamlDocAtPath(path: string[], item: unknown, doc: Document.Parsed) {
  const targetEl = doc.getIn(path)
  const yamlElementType = getYamlElementType(targetEl)
  const dataType = getDataType(item)

  if (yamlElementType === dataType) {
    if (dataType === 'undefined') {
      doc.deleteIn(path)
    } else {
      if (isPrimitiveType(yamlElementType)) {
        doc.setIn(path, item)
      } else if (yamlElementType === 'object') {
        updateYamlObject(targetEl as YAMLMap, item as Record<string, unknown>, doc)
      } else if (yamlElementType === 'array') {
        updateYamlArray(targetEl as YAMLSeq, item as unknown[], doc)
      }
    }
  } else {
    doc.setIn(path, item)
  }
}
