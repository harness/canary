import { ConnectorSchema, SchemaProperty, SchemaType } from '../ConnectorPayloadBuilder'

interface BaseSchema {
  type: SchemaType
  description?: string
  required?: string[]
}

interface YamlProperty extends BaseSchema {
  enum?: string[]
  items?: YamlProperty
  properties?: Record<string, YamlProperty>
  $ref?: string
}

interface YamlConnectorSchema extends BaseSchema {
  properties: Record<string, YamlProperty>
  allOf?: Array<{
    $ref?: string
    properties?: Record<string, YamlProperty>
  }>
}

interface YamlApiResponse {
  data: {
    definitions: Record<string, YamlConnectorSchema>
  }
}

export class SchemaParser {
  private definitions: Record<string, YamlConnectorSchema>

  constructor(yamlResponse: YamlApiResponse) {
    this.definitions = yamlResponse.data.definitions
  }

  private convertProperty(prop: YamlProperty): SchemaProperty {
    const result: SchemaProperty = { type: prop.type }

    if (prop.$ref) {
      const refName = prop.$ref.replace('#/definitions/', '')
      const refDef = this.definitions[refName]
      if (refDef) {
        return this.convertSchema(refDef)
      }
    }

    if (prop.enum) result.enum = prop.enum
    if (prop.items) result.items = this.convertProperty(prop.items)
    if (prop.properties) {
      result.properties = {}
      for (const [key, value] of Object.entries(prop.properties)) {
        result.properties[key] = this.convertProperty(value)
      }
      if (prop.required) result.required = prop.required
    }

    return result
  }

  private convertSchema(schema: YamlConnectorSchema): ConnectorSchema {
    const result: ConnectorSchema = {
      type: schema.type,
      properties: {}
    }

    // Process base properties
    for (const [key, prop] of Object.entries(schema.properties)) {
      result.properties[key] = this.convertProperty(prop)
    }

    // Process inheritance
    if (schema.allOf) {
      for (const part of schema.allOf) {
        if (part.$ref) {
          const refName = part.$ref.replace('#/definitions/', '')
          const parentSchema = this.definitions[refName]
          if (parentSchema) {
            const converted = this.convertSchema(parentSchema)
            result.properties = {
              ...result.properties,
              ...converted.properties
            }
          }
        }
        if (part.properties) {
          for (const [key, prop] of Object.entries(part.properties)) {
            result.properties[key] = this.convertProperty(prop)
          }
        }
      }
    }

    if (schema.required) result.required = schema.required

    return result
  }

  public parseConnectorSchemas(): Record<string, ConnectorSchema> {
    const result: Record<string, ConnectorSchema> = {}

    for (const [name, schema] of Object.entries(this.definitions)) {
      // Only process connector schemas
      if (
        schema.allOf?.some(part => part.$ref === '#/definitions/ConnectorConfigDTO' || part.$ref?.includes('Connector'))
      ) {
        const connectorName = name.replace('Connector', '').replace('DTO', '')
        result[connectorName] = this.convertSchema(schema)
      }
    }

    return result
  }
}

// Helper function to parse YAML API response
export const parseConnectorSchemas = (yamlResponse: YamlApiResponse): Record<string, ConnectorSchema> => {
  const parser = new SchemaParser(yamlResponse)
  return parser.parseConnectorSchemas()
}
