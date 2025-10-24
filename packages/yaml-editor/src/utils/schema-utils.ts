import { Uri } from 'monaco-editor'
import { yamlDefaults } from 'monaco-yaml'

let isYamlMonacoConfigured = false

export function configureSchema(schemaConfig: any) {
  if (isYamlMonacoConfigured) return

  const config = {
    hover: true,
    completion: true,
    enableSchemaRequest: false,
    validate: true,
    schemas: [schemaConfig]
  }

  isYamlMonacoConfigured = true

  // NOTE: this is for monaco-editor@0.50.0 version
  // return configureMonacoYaml(monaco, config)

  yamlDefaults.setDiagnosticsOptions({ ...config })
}

export const schemaIdToUrl = (id: string): string => {
  return Uri.parse(`file://${id}`).toString()
}

export const schemaIdToUri = (id: string): Uri => {
  return Uri.parse(schemaIdToUrl(id))
}
