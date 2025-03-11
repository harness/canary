import { FormData } from './types'

// Schema types
export type SchemaType = 'string' | 'number' | 'boolean' | 'array' | 'object';

export interface SchemaProperty {
  type: SchemaType;
  enum?: string[];
  items?: SchemaProperty;
  properties?: Record<string, SchemaProperty>;
  required?: string[];
}

export interface ConnectorSchema {
  type: SchemaType;
  properties: Record<string, SchemaProperty>;
  required?: string[];
}

// Base interfaces
export interface ConnectorSpec {
  auth?: AuthenticationSpec;
  delegateSelectors?: string[];
  ignoreTestConnection?: boolean;
}

export interface AuthenticationSpec {
  type: string;
}

// Base connector configuration
export interface ConnectorPayloadConfig<T extends ConnectorSpec = ConnectorSpec> {
  name: string;
  description?: string;
  projectIdentifier?: string;
  orgIdentifier?: string;
  identifier: string;
  tags?: string[];
  type: string;
  spec: T;
}

// Builder interface
export type ConnectorPayloadBuilder<T extends ConnectorSpec> = {
  buildPayload: (formData: FormData) => { connector: ConnectorPayloadConfig<T> }
}

// Base payload creator
export const createBasePayload = <T extends ConnectorSpec>(
  formData: FormData,
  type: string,
  spec: T
): ConnectorPayloadConfig<T> => ({
  name: formData.name,
  description: formData?.description,
  projectIdentifier: formData?.projectIdentifier,
  orgIdentifier: formData?.orgIdentifier,
  identifier: formData.identifier,
  tags: formData?.tags,
  type,
  spec
});

// Schema registry
export const ConnectorSchemaRegistry: Record<string, any> = {};

// Register a connector schema
export const registerConnectorSchema = (type: string, schema: any): void => {
  ConnectorSchemaRegistry[type] = schema;
};

// Get a connector builder
export const getConnectorBuilder = <T extends ConnectorSpec>(
  type: string
): ConnectorPayloadBuilder<T> => {
  const schema = ConnectorSchemaRegistry[type];
  if (!schema) {
    throw new Error(`No schema registered for connector type: ${type}`);
  }
  return {
    buildPayload: (formData: FormData) => ({
      connector: createBasePayload(formData, type, formData as unknown as T)
    })
  };
};

