import { useEffect } from 'react'

import { configureSchema, schemaIdToUrl } from '../utils/schema-utils'

export type UseSchema = (arg: { schemaConfig?: { schema: any; uri: string }; instanceId: string }) => void

export const useSchema: UseSchema = (props): void => {
  const { schemaConfig, instanceId } = props

  useEffect(() => {
    if (schemaConfig?.schema) {
      configureSchema({
        // If YAML file is opened matching this glob
        fileMatch: [schemaIdToUrl(instanceId.toString())],
        ...schemaConfig
      })
    }
  }, [schemaConfig?.schema, instanceId])
}
