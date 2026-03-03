import * as z from 'zod'

import type { IFormDefinition, IInputDefinition } from '../../../../src'
import { InputConfigType, InputType } from '../../implementation/types/input-types'

type IInputConfigWithConfig = IInputDefinition & InputConfigType

const inputs: IInputConfigWithConfig[] = [
  // Slot 1: Tuple - Simple values
  {
    inputType: InputType.slot,
    path: 'slot_coordinates',
    label: 'Tuple - simple values',
    inputConfig: {
      debug: true
    },
    inputs: [
      {
        inputType: InputType.text,
        path: 'coordinates.0',
        label: 'coordinates.0',
        required: true,
        validation: {
          schema: z.coerce.number().min(0, 'X must be non-negative')
        }
      },
      {
        inputType: InputType.text,
        path: 'coordinates.1',
        label: 'coordinates.1',
        required: true,
        validation: {
          schema: z.coerce.number().min(0, 'Y must be non-negative')
        }
      }
    ]
  },

  // Slot 2: Tuple - Nested objects
  {
    inputType: InputType.slot,
    path: 'slot_servers',
    label: 'Tuple - nested objects',
    inputConfig: {
      debug: true
    },
    inputs: [
      {
        inputType: InputType.text,
        path: 'servers.0.name',
        label: 'servers.0.name',
        required: true
      },
      {
        inputType: InputType.text,
        path: 'servers.0.url',
        label: 'servers.0.url',
        required: true,
        validation: {
          schema: z.string().url('Invalid URL format')
        }
      },
      {
        inputType: InputType.text,
        path: 'servers.1.name',
        label: 'servers.1.name',
        required: true
      },
      {
        inputType: InputType.text,
        path: 'servers.1.url',
        label: 'servers.1.url',
        required: true,
        validation: {
          schema: z.string().url('Invalid URL format')
        }
      }
    ]
  },

  // Slot 3: Tuple - Mixed schemas per position
  {
    inputType: InputType.slot,
    path: 'slot_owners',
    label: 'Tuple - mixed schemas',
    inputConfig: {
      debug: true
    },
    inputs: [
      {
        inputType: InputType.text,
        path: 'owners.0.name',
        label: 'owners.0.name',
        required: true,
        validation: {
          schema: z.string().min(2, 'Name must be at least 2 characters')
        }
      },
      {
        inputType: InputType.text,
        path: 'owners.0.email',
        label: 'owners.0.email',
        required: true,
        validation: {
          schema: z.string().email('Invalid email format')
        }
      },
      {
        inputType: InputType.text,
        path: 'owners.1.name',
        label: 'owners.1.name',
        required: true,
        validation: {
          schema: z.string().min(2, 'Name must be at least 2 characters')
        }
      },
      {
        inputType: InputType.text,
        path: 'owners.1.email',
        label: 'owners.1.email',
        required: true,
        validation: {
          schema: z.string().email('Invalid email format')
        }
      },
      {
        inputType: InputType.text,
        path: 'owners.2.name',
        label: 'owners.2.name',
        required: false
      },
      {
        inputType: InputType.select,
        path: 'owners.2.role',
        label: 'owners.2.role',
        required: false,
        inputConfig: {
          options: [
            { label: 'Developer', value: 'developer' },
            { label: 'DevOps', value: 'devops' },
            { label: 'Tech Lead', value: 'tech_lead' },
            { label: 'Architect', value: 'architect' }
          ]
        }
      }
    ]
  },

  // Slot 4: Tuple - Sparse indices
  {
    inputType: InputType.slot,
    path: 'slot_priorities',
    label: 'Tuple - sparse indices',
    inputConfig: {
      debug: true
    },
    inputs: [
      {
        inputType: InputType.text,
        path: 'priorities.0',
        label: 'priorities.0',
        required: true
      },
      {
        inputType: InputType.text,
        path: 'priorities.5',
        label: 'priorities.5',
        required: true
      }
    ]
  },

  // Slot 5: Dynamic Array
  {
    inputType: InputType.slot,
    path: 'slot_array',
    label: 'Tags',
    inputConfig: {
      debug: true
    },
    inputs: [
      {
        inputType: InputType.array,
        path: 'tags',
        label: 'tags',
        required: true,
        inputConfig: {
          input: {
            inputType: InputType.text,
            label: 'Tag',
            required: true,
            validation: {
              schema: z.string().min(3, 'Tag must be at least 3 characters')
            }
          }
        }
      }
    ]
  },

  // Slot 6: Dynamic List
  {
    inputType: InputType.slot,
    path: 'slot_list',
    label: 'Contributors',
    inputConfig: {
      debug: true
    },
    inputs: [
      {
        inputType: InputType.list,
        path: 'contributors',
        label: 'contributors',
        required: true,
        inputConfig: {
          inputs: [
            {
              inputType: InputType.text,
              label: 'Name',
              relativePath: 'name',
              required: true
            },
            {
              inputType: InputType.text,
              label: 'Email',
              relativePath: 'email',
              required: true,
              validation: {
                schema: z.string().email('Invalid email format')
              }
            }
          ]
        }
      }
    ]
  }
]

export const formDefinition: IFormDefinition<InputConfigType> = {
  inputs
}
