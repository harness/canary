import { get, isArray, isEmpty, isObject, isUndefined, merge, set } from 'lodash-es'
import * as zod from 'zod'

import type { AnyFormikValue, IFormDefinition, IGlobalValidationConfig, IInputDefinition } from '../../types/types'

export function processValidationParseResponse(anyArray: string | Record<string, unknown>): string | undefined {
  const error = typeof anyArray === 'string' ? JSON.parse(anyArray) : anyArray

  if (typeof error === 'string') {
    return error
  }

  if (isArray(error)) {
    return processValidationParseResponse(error[0])
  }

  const errorObj = error as { message: string }
  if (isObject(errorObj) && errorObj?.message) {
    return error?.message
  }

  return 'Unknown error'
}

/**
 * Internal type used for preparing data model for creating schema
 */
type SchemaTreeNode = { [key: string]: SchemaTreeNode } & {
  _input?: IInputDefinition
  _isList?: boolean
  _isArrayItem?: boolean
  _schema?: zod.ZodObject<zod.ZodRawShape>
  _schemaObj?: { [key: string]: SchemaTreeNode }
  _requiredOnly?: boolean
}

export interface IGetValidationSchemaOptions<T = any> {
  /**
   * Metadata is passed down to validation callbacks
   */
  metadata?: T
  /**
   * If formik model is nested, use prefix to extract data form matching.
   *
   * e.g. to get form data form {formData: {...}} use "formData." as prefix
   */
  prefix?: string
  /**
   * global validation configuration applies to all inputs
   */
  validationConfig?: IGlobalValidationConfig
  // TODO: check this
  utils?: {
    getValuesWithDependencies?: (values: AnyFormikValue, input: IInputDefinition) => AnyFormikValue
  }
}

export function getValidationSchema<T = any>(
  inputs: IFormDefinition,
  values: AnyFormikValue,
  options?: IGetValidationSchemaOptions<T>
): zod.ZodObject<zod.ZodRawShape> {
  let schemaTreeNode: SchemaTreeNode = {}

  // 1. Prepare three model
  populateSchemaTreeRec(schemaTreeNode, inputs.inputs, values, options)

  // console.log('Internal model:')
  // console.log(schemaTreeNode)

  if (options?.prefix) {
    const prefixWithoutDot = options?.prefix.replace(/.$/, '')
    schemaTreeNode = set({}, prefixWithoutDot, schemaTreeNode)
  }

  // 2. Generate schema from model
  const schema = zod.object(generateSchemaRec(schemaTreeNode, values, options))

  // console.log('Schema:')
  // console.log(schema)

  return schema
}

function generateSchemaRec(schemaObj: SchemaTreeNode, values: AnyFormikValue, options?: IGetValidationSchemaOptions) {
  const objectSchemas: { [key: string]: zod.Schema<unknown> } = {}

  Object.keys(schemaObj).forEach(key => {
    const { _requiredOnly, _schemaObj, _input, _isList, _isArrayItem, _schema /*...nestedSchemaObj*/ } = schemaObj[key]
    if (_isList && _schemaObj && _input) {
      const arraySchema = zod.array(zod.object(generateSchemaRec(_schemaObj, values, options))).optional()
      const enhancedSchema = getSchemaForArray(_schema, _input, values, options, arraySchema)
      objectSchemas[key] = enhancedSchema!
    } else if (_isArrayItem && _input) {
      const innerSchema = _schemaObj?.___array
        ? generateSchemaRec({ ___array: _schemaObj.___array }, values, options)
        : { ___array: zod.any() }
      const arraySchema = zod.array(innerSchema.___array).optional()
      const enhancedSchema = getSchemaForArray(_schema, _input, values, options, arraySchema)
      objectSchemas[key] = enhancedSchema!
    } else if (_schema && _input) {
      const enhancedSchema: zod.Schema<unknown> = getSchemaForPrimitive(_schema, _input, options)
      objectSchemas[key] = enhancedSchema
      // TODO check this
      // objectSchemas[key] = !isEmpty(nestedSchemaObj)
      //   ? addNestedSchema(nestedSchemaObj, enhancedSchema, options)
      //   : enhancedSchema
    } else if (_requiredOnly && _input) {
      objectSchemas[key] = getRequiredSchema(_input, options)

      // TODO check this
      // if only required (no schema in place)
      // let requiredSchema = chainRequiredSchema(Yup.mixed(), _input!.inputType, options)
      // requiredSchema =
      //   options?.globalValidationConfig?.globalValidation?.(requiredSchema, _input!) ?? requiredSchema
      // requiredSchema.when(_input?.path!, {
      //   is: value => {
      //     return true
      //   },
      //   then: (schema2: Yup.MixedSchema) =>
      //     options?.globalValidationConfig?.globalValidation?.(schema2, _input!) ?? schema2
      // })
      //const requiredSchema = _input ? composeSchema(, _input, values, options) : Yup.mixed() //getRequiredSchema(_input?.inputType!, options)
      // ovo >>
      // objectSchemas[key] = !isEmpty(nestedSchemaObj)
      //   ? addNestedSchema(nestedSchemaObj, requiredSchema, options)
      //   : requiredSchema
    } else {
      objectSchemas[key] = zod.object(generateSchemaRec(schemaObj[key], values, options)).optional()
    }
  })

  return objectSchemas
}

function getSchemaForPrimitive(
  schema: zod.Schema<unknown> | undefined,
  input: IInputDefinition,
  options?: IGetValidationSchemaOptions
) {
  return zod.string().superRefine(async (value, ctx) => {
    // 1. Required validation
    if (input.required) {
      const requiredSchemaResponse = await getRequiredSchema(input, options).safeParseAsync(value)
      if (!requiredSchemaResponse.success) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: `Required field`
        })
      }
    }

    // 2. Global validation
    if (options?.validationConfig?.globalValidation) {
      const validationRes = options?.validationConfig?.globalValidation(value, input!, options.metadata)

      if (validationRes.error) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: validationRes.error
        })
      }

      if (!validationRes.continue) {
        return true
      }
    }

    //3. Input validation
    if (schema) {
      const schemaResponse = await schema.safeParseAsync(value)

      if (!schemaResponse.success) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: processValidationParseResponse(schemaResponse?.error.message)
        })
      }
    }
  })
}

function getSchemaForArray(
  schema: zod.Schema | undefined,
  input: IInputDefinition,
  _values: AnyFormikValue, // TODO remove this
  options?: IGetValidationSchemaOptions,
  arraySchema?: zod.ZodTypeAny
) {
  return zod
    .any()
    .superRefine(async (value: any, ctx) => {
      // 1. Required validation
      const requiredSchema = getRequiredSchema(input, options)
      const requiredSchemaResult = await requiredSchema.safeParseAsync(value)
      if (input.required && !requiredSchemaResult.success) {
        // TODO: move this logic to utils. (check if there is better solution)
        const message = processValidationParseResponse(requiredSchemaResult.error.message)
        ctx.addIssue({ code: zod.ZodIssueCode.custom, message: message, fatal: true })
        return zod.NEVER
      }
      if (!input.required && !requiredSchemaResult.success) {
        return zod.NEVER
      }

      // 2. Global validation
      if (options?.validationConfig?.globalValidation) {
        const validationRes = options?.validationConfig?.globalValidation(value, input, options.metadata)

        if (validationRes.error) {
          ctx.addIssue({
            code: zod.ZodIssueCode.custom,
            message: processValidationParseResponse(validationRes.error)
          })
          return zod.NEVER
        } else if (!validationRes.continue) {
          return zod.NEVER
        }
      }

      // 3. Prevent more validation if value is not an array
      if (!isArray(value)) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: "'Value is not array'"
        })
        return zod.NEVER
      }

      // 4. Input validation
      if (schema) {
        const schemaResult = await schema.safeParseAsync(value)

        if (!schemaResult.success) {
          ctx.addIssue({
            code: zod.ZodIssueCode.custom,
            message: processValidationParseResponse(schemaResult.error.message)
          })
          return zod.NEVER
        }
      }

      // NOTE: THIS IS MOVED TO pipe(...) - delete following block
      // // 5. Return dynamically created validation for nested inputs
      // const arraySchemaResponse = await arraySchema?.safeParseAsync(value)
      // if (!arraySchemaResponse?.success) {
      //   ctx.addIssue({
      //     code: zod.ZodIssueCode.custom,
      //     message: arraySchemaResponse?.error.message
      //   })
      // }
    })
    .pipe(arraySchema ?? zod.any())
}

function populateSchemaTreeRec<T = any>(
  schemaObj: SchemaTreeNode,
  inputsArr: IInputDefinition[],
  values: AnyFormikValue,
  options?: IGetValidationSchemaOptions<T>,
  utils?: {
    getValuesWithDependencies?: (values: AnyFormikValue, input: IInputDefinition) => AnyFormikValue
  }
): void {
  inputsArr.forEach(input => {
    const valuesWithDependencies = utils?.getValuesWithDependencies
      ? utils?.getValuesWithDependencies(values, input)
      : values

    if (!input.isVisible || input.isVisible?.(valuesWithDependencies, options?.metadata)) {
      const existingSchema = get(schemaObj, input.path)
      if (input.validation?.schema) {
        set(
          schemaObj,
          input.path,
          merge(existingSchema, {
            _schema: input.validation?.schema,
            _input: input
          })
        )
      } else if (input.required) {
        set(schemaObj, input.path, merge(existingSchema, { _requiredOnly: true, _input: input }))
      }
      if (input.inputs) {
        populateSchemaTreeRec(schemaObj, input.inputs, values, options, utils)
      }

      // handle list
      if (input.inputType === 'list') {
        const listSchemaObj: SchemaTreeNode = {}
        populateSchemaTreeRec(
          listSchemaObj,
          (input.inputConfig as { inputs: (IInputDefinition & { relativePath: string })[] }).inputs.map(item => ({
            ...item,
            path: item.relativePath
          })),
          values,
          options,
          utils
        )

        const existingSchema = get(schemaObj, input.path)
        set(schemaObj, input.path, merge(existingSchema, { _schemaObj: listSchemaObj, _isList: true, _input: input }))
      }

      // handle array
      if (!input.validation?.schema && (input.inputType as string) === 'array') {
        let arraySchemaObj = {}
        populateSchemaTreeRec(
          arraySchemaObj,
          [{ ...(input.inputConfig as { input: IInputDefinition }).input, path: '___array' }],
          values,
          options,
          utils
        )

        set(
          schemaObj,
          input.path,
          merge(existingSchema, {
            _schemaObj: arraySchemaObj,
            _schema: input.validation?.schema,
            _isArrayItem: true,
            _input: input
          })
        )
      }
    }
  })
}

function getRequiredSchema(input: IInputDefinition, options?: IGetValidationSchemaOptions): zod.Schema<unknown> {
  if (options?.validationConfig?.requiredSchemaPerInput?.[input.inputType]) {
    return options?.validationConfig?.requiredSchemaPerInput?.[input.inputType]
  } else if (options?.validationConfig?.requiredSchema) {
    return options?.validationConfig?.requiredSchema
  }

  const requiredMessage =
    options?.validationConfig?.requiredMessagePerInput?.[input.inputType] ??
    options?.validationConfig?.requiredMessage ??
    'Required fields'

  // Default "required value" validation
  return zod.any().superRefine((value, ctx) => {
    if (typeof value === 'object' && isEmpty(value)) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        message: requiredMessage
      })
    }
    if (isUndefined(value) || value === '') {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        message: requiredMessage
      })
    }
  })
}
