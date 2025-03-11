// Import schema registration first

import { getConnectorBuilder } from './ConnectorPayloadBuilder'
import { AwsKmsSpec, schemas } from './schemas'
import { AWS_KMS_CONNECTOR_IDENTIFIER } from './types'

// Register schema before getting the builder
const schema = schemas[AWS_KMS_CONNECTOR_IDENTIFIER]
if (!schema) {
  throw new Error(`Schema not found for ${AWS_KMS_CONNECTOR_IDENTIFIER}`)
}

// Get the builder for AWS KMS connector
export const awsKmsBuilder = getConnectorBuilder<AwsKmsSpec>(AWS_KMS_CONNECTOR_IDENTIFIER)
