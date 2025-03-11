import { useCallback } from 'react'
import type { FieldValues, Resolver, ResolverOptions } from 'react-hook-form'

import { toNestErrors } from '@hookform/resolvers'

import type { IFormDefinition } from '../../types/types'
import { getValidationSchema, IGetValidationSchemaOptions } from '../validation/zod-validation'
import { isZodError, parseErrorSchema } from './zod-resolver-utils'

export function useZodValidationResolver(
  formDefinition: IFormDefinition,
  options?: IGetValidationSchemaOptions
): Resolver<any, any> | undefined {
  return useCallback(
    async (data: FieldValues, _: any, resolverOptions: ResolverOptions<FieldValues>) => {
      try {
        const validationSchema = getValidationSchema(formDefinition, data, options)

        await validationSchema.parseAsync(data)

        return {
          values: data, // TODO: check this - values does not contains all data
          errors: {}
        }
      } catch (error: any) {
        if (isZodError(error)) {
          return {
            values: {},
            errors: toNestErrors(parseErrorSchema(error.errors, true), resolverOptions)
          }
        }

        throw error
      }
    },
    [formDefinition]
  )
}
