import * as z from 'zod'

import { IFormDefinition, IInputDefinition } from '../../../../src'
import { InputConfigType, InputType } from '../../implementation/types/input-types'

type IInputConfigWithConfig = IInputDefinition & InputConfigType

const inputs: IInputConfigWithConfig[] = [
  {
    inputType: InputType.array,
    path: 'rootArray',
    label: 'Array',
    required: true,
    inputConfig: {
      input: {
        inputType: InputType.text,
        label: 'First array prop',
        path: '',
        required: true,
        validation: {
          schema: z.string().refine(
            val => {
              return !isNaN(parseInt(val))
            },
            {
              message: 'Value is not a integer'
            }
          )
        }
      }
    }
  },
  {
    inputType: InputType.text,
    label: 'Text',
    path: 'stringProp',
    required: true,
    validation: {
      schema: values =>
        z.string().transform((val, ctx) => {
          const parsed = parseInt(val)
          if (isNaN(parsed)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Not a number'
            })
            return z.NEVER
          }

          if (!values.rootArray || values.rootArray.length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Array is empty. Please add something to array.'
            })
            return z.NEVER
          }

          return parsed
        })
    }
  },
  {
    inputType: InputType.text,
    label: 'First Input',
    path: 'firstInput',
    required: true
  },
  {
    inputType: InputType.text,
    label: 'Second Input',
    path: 'secondInput',
    required: true,
    validation: {
      schema: (values) => {
        const firstValue = values.firstInput
        return z.string().refine(
          val => {
            // Second input must be longer than first input
            return val.length > firstValue.length
          },
          {
            message: `Second input must be longer than "${firstValue}"`
          }
        )
      }
    }
  }
]

export const formDefinition: IFormDefinition<InputConfigType> = {
  inputs
}
