import { z } from 'zod'

// Assuming these are defined elsewhere by the user
export const regexIdentifier = /^[a-zA-Z_][0-9a-zA-Z_]*$/

export const hyphenRegexIdentifier = /^[a-zA-Z_][0-9a-zA-Z_-]*$/

export const illegalIdentifiers = [
  'or',
  'and',
  'eq',
  'ne',
  'lt',
  'gt',
  'le',
  'ge',
  'div',
  'mod',
  'not',
  'null',
  'true',
  'false',
  'new',
  'var',
  'return',
  'step',
  'parallel',
  'stepGroup',
  'insert',
  'org',
  'account',
  'class',
  'shellScriptProvisioner'
]

export const identifierSchema = (config?: {
  allowHyphen?: boolean
  regexErrorMsg?: string
  requiredErrorMsg?: string
}) =>
  z
    .string()
    .regex(
      config?.allowHyphen ? hyphenRegexIdentifier : regexIdentifier,
      config?.regexErrorMsg ? config?.regexErrorMsg : 'Identifier can only contain alphanumerics, _ and $'
    )
    .min(1, config?.requiredErrorMsg ? config?.requiredErrorMsg : 'Identifier is required')
    .refine(val => !illegalIdentifiers.includes(val), {
      message: `Identifier must not be one of the following values: ${illegalIdentifiers.join(', ')}`
    })
