import { useEffect } from 'react'

import { addUpdateSchema, removeSchema, schemaIdToUrl } from '../utils/schema-utils'

export type UseSchema = (arg: { schemaConfig?: { schema: any; uri: string }; instanceId: string }) => void

export const useSchema: UseSchema = (props): void => {
  const { schemaConfig, instanceId } = props

  useEffect(() => {
    if (schemaConfig?.schema) {
      addUpdateSchema({
        fileMatch: [schemaIdToUrl(instanceId.toString())],
        ...schemaConfig
      })

      return () => {
        removeSchema(instanceId)
      }
    }
  }, [schemaConfig?.schema, instanceId])
}
