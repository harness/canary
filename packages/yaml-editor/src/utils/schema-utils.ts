import { Uri } from 'monaco-editor'
import { SchemasSettings, yamlDefaults } from 'monaco-yaml'

export function addUpdateSchema(schemaConfig: { fileMatch: string[]; schema: any; uri: string }) {
  const schemas = yamlDefaults?.diagnosticsOptions?.schemas ?? []

  const exitingSchemaIndex = schemas.findIndex(schema => schema.fileMatch[0] === schemaConfig.fileMatch[0])

  if (exitingSchemaIndex !== -1) {
    schemas[exitingSchemaIndex] = schemaConfig
  } else {
    schemas.push(schemaConfig)
  }

  setDiagnostics(schemas)
}

export function removeSchema(schemaId: string) {
  const existingSchemas = yamlDefaults?.diagnosticsOptions?.schemas ?? []

  const schemas = existingSchemas.filter(schemaItem => {
    return schemaItem.fileMatch[0] !== schemaIdToUrl(schemaId)
  })

  setDiagnostics(schemas)
}

function setDiagnostics(schemas: SchemasSettings[]) {
  const config = {
    hover: true,
    completion: true,
    enableSchemaRequest: false,
    validate: true,
    schemas
  }

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
