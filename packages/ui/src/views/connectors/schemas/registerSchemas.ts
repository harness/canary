import { ConnectorSchema, registerConnectorSchema, SchemaProperty } from '../ConnectorPayloadBuilder'
import { AWS_KMS_CONNECTOR_IDENTIFIER } from '../types'

// AWS KMS Connector Schema Types
type StringSchema = SchemaProperty & { type: 'string' }
type BooleanSchema = SchemaProperty & { type: 'boolean' }
type ArraySchema = SchemaProperty & { type: 'array'; items: SchemaProperty }

interface AwsKmsCredentialSpec extends SchemaProperty {
  type: 'object'
  properties: {
    accessKey: StringSchema
    secretKey: StringSchema
    delegateSelectors: ArraySchema
    roleArn: StringSchema
    externalName: StringSchema
    assumeStsRoleDuration: StringSchema
    iamRoleArn: StringSchema
  }
}

interface AwsKmsCredential extends SchemaProperty {
  type: 'object'
  properties: {
    type: StringSchema
    spec: AwsKmsCredentialSpec
  }
  required: ['type']
}

interface AwsKmsSchema extends ConnectorSchema {
  type: 'object'
  properties: {
    credential: AwsKmsCredential
    kmsArn: StringSchema
    region: StringSchema
    default: BooleanSchema
    executeOnDelegate: BooleanSchema
    delegateSelectors: ArraySchema
  }
  required: ['credential', 'kmsArn', 'region']
}

// AWS KMS Connector Schema
const awsKmsSchema: AwsKmsSchema = {
  type: 'object',
  properties: {
    credential: {
      type: 'object',
      properties: {
        type: { type: 'string' },
        spec: {
          type: 'object',
          properties: {
            accessKey: { type: 'string' },
            secretKey: { type: 'string' },
            delegateSelectors: { type: 'array', items: { type: 'string' } },
            roleArn: { type: 'string' },
            externalName: { type: 'string' },
            assumeStsRoleDuration: { type: 'string' },
            iamRoleArn: { type: 'string' }
          }
        }
      },
      required: ['type']
    },
    kmsArn: { type: 'string' },
    region: { type: 'string' },
    default: { type: 'boolean' },
    executeOnDelegate: { type: 'boolean' },
    delegateSelectors: { type: 'array', items: { type: 'string' } }
  },
  required: ['credential', 'kmsArn', 'region']
}

// Export schemas for external use
export const schemas: Record<string, ConnectorSchema> = {
  [AWS_KMS_CONNECTOR_IDENTIFIER]: awsKmsSchema
}

// Initialize all connector schemas
export const initializeConnectorSchemas = () => {
  // Register AWS KMS schema with exact identifier
  registerConnectorSchema(AWS_KMS_CONNECTOR_IDENTIFIER, awsKmsSchema)
}

// Register schemas on module load
initializeConnectorSchemas()

// import { registerConnectorSchema } from '../ConnectorPayloadBuilder'
// import { parseConnectorSchemas } from './SchemaParser'

// // Example usage of the schema parser
// export const registerSchemasFromYaml = (yamlResponse: any) => {
//   try {
//     // Parse all connector schemas from the YAML response
//     const schemas = parseConnectorSchemas(yamlResponse)

//     // Register each schema
//     Object.entries(schemas).forEach(([name, schema]) => {
//       // Convert connector name to match enum values (e.g., 'GithubConnector' -> 'Github')
//       const connectorType = name.replace('Connector', '').replace('DTO', '')
//       registerConnectorSchema(connectorType, schema)
//     })

//     console.log(`Successfully registered ${Object.keys(schemas).length} connector schemas`)
//   } catch (error) {
//     console.error('Error registering schemas:', error)
//     throw error
//   }
// }

// // Example YAML response handler
// export const initializeConnectorSchemas = async (yamlEndpoint: string) => {
//   try {
//     const response = await fetch(yamlEndpoint)
//     const yamlResponse = await response.json()
//     registerSchemasFromYaml(yamlResponse)
//   } catch (error) {
//     console.error('Error initializing connector schemas:', error)
//     throw error
//   }
// }
