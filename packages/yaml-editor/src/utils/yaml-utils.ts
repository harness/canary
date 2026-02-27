import { parse } from 'yaml'

export function parseYamlSafe<T = Record<string, unknown>>(yaml: string): {
  yamlObject: T | undefined
  isYamlSyntaxValid: boolean
} {
  let yamlObject: T | undefined = undefined
  let isYamlSyntaxValid = true

  try {
    yamlObject = parse(yaml) as T
  } catch (ex) {
    isYamlSyntaxValid = false
  }

  return {
    yamlObject,
    isYamlSyntaxValid
  }
}
