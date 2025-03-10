import { FormData } from './types'

export interface ConnectorPayloadConfig {
  name: string
  description?: string
  projectIdentifier?: string
  orgIdentifier?: string
  identifier: string
  tags?: string[]
  type: string
  spec: Record<string, any>
}

export type ConnectorPayloadBuilder = {
  buildPayload: (formData: FormData) => { connector: ConnectorPayloadConfig }
}

export const createBasePayload = (
  formData: FormData,
  type: string,
  spec: Record<string, any>
): ConnectorPayloadConfig => ({
  name: formData.name,
  description: formData?.description,
  projectIdentifier: formData?.projectIdentifier,
  orgIdentifier: formData?.orgIdentifier,
  identifier: formData.identifier,
  tags: formData?.tags,
  type,
  spec
})

export const createConnectorPayloadBuilder = (
  type: string,
  buildSpec: (formData: FormData) => Record<string, any>
): ConnectorPayloadBuilder => ({
  buildPayload: (formData: FormData) => ({
    connector: createBasePayload(formData, type, buildSpec(formData))
  })
})
