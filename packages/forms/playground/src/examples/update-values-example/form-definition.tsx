import * as z from 'zod'

import type { IFormDefinition, IInputDefinition } from '../../../../src'
import { InputConfigType, InputType } from '../../implementation/types/input-types'

type IInputConfigWithConfig = IInputDefinition & InputConfigType

const inputs: IInputConfigWithConfig[] = [
  {
    inputType: InputType.text,
    path: 'name',
    label: 'Name',
    placeholder: 'Enter your name',
    required: true,
    default: 'John Doe',
    validation: {
      schema: z.string().min(3, 'Name must be at least 3 characters')
    }
  },
  {
    inputType: InputType.text,
    path: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    required: true,
    default: 'john@example.com',
    validation: {
      schema: z.string().email('Invalid email address')
    }
  },
  {
    inputType: InputType.number,
    path: 'age',
    label: 'Age',
    required: true,
    default: 25,
    validation: {
      schema: z.number().min(18, 'Must be at least 18').max(100, 'Must be less than 100')
    }
  },
  {
    inputType: InputType.text,
    path: 'bio',
    label: 'Bio',
    placeholder: 'Tell us about yourself',
    default: 'Software engineer'
  },
  {
    inputType: InputType.boolean,
    path: 'active',
    label: 'Active',
    default: true
  }
]

export const formDefinition: IFormDefinition<InputConfigType> = {
  inputs
}
