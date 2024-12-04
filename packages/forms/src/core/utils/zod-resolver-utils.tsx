import { appendErrors, type FieldError } from 'react-hook-form'

import * as zod from 'zod'

export const isZodError = (error: any): error is zod.ZodError => Array.isArray(error?.errors)

export const parseErrorSchema = (zodErrors: zod.ZodIssue[], validateAllFieldCriteria: boolean) => {
  const errors: Record<string, FieldError> = {}
  for (; zodErrors.length; ) {
    const error = zodErrors[0]
    const { code, message, path } = error
    const _path = path.join('.')

    if (!errors[_path]) {
      if ('unionErrors' in error) {
        const unionError = error.unionErrors[0].errors[0]

        errors[_path] = {
          message: unionError.message,
          type: unionError.code
        }
      } else {
        errors[_path] = { message, type: code }
      }
    }

    if ('unionErrors' in error) {
      error.unionErrors.forEach(unionError => unionError.errors.forEach(e => zodErrors.push(e)))
    }

    if (validateAllFieldCriteria) {
      const types = errors[_path].types
      const messages = types && types[error.code]

      errors[_path] = appendErrors(
        _path,
        validateAllFieldCriteria,
        errors,
        code,
        messages ? ([] as string[]).concat(messages as string[], error.message) : error.message
      ) as FieldError
    }

    zodErrors.shift()
  }

  return errors
}
