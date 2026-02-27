import { parse } from 'yaml'

export function parseYamlSafe(yaml: string) {
  let yamlObject: Record<string, unknown> | undefined = undefined
  let isYamlSyntaxValid = true

  try {
    yamlObject = parse(yaml)
  } catch (ex) {
    isYamlSyntaxValid = false
  }

  return {
    yamlObject,
    isYamlSyntaxValid
  }
}
