import * as z from 'zod'

import type { IFormDefinition, IInputDefinition } from '../../../../src'
import { InputConfigType, InputType } from '../../implementation/types/input-types'

type IInputConfigWithConfig = IInputDefinition & InputConfigType

const inputs: IInputConfigWithConfig[] = [
  // Slot 1: Dynamic Array
  {
    inputType: InputType.slot,
    path: 'slot_array',
    label: 'Dynamic Array (tags)',
    inputConfig: {
      debug: true
    },
    inputs: [
      {
        inputType: InputType.array,
        path: 'tags',
        label: 'Tags',
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

  // Slot 2: Dynamic List
  {
    inputType: InputType.slot,
    path: 'slot_list',
    label: 'Dynamic List (contributors)',
    inputConfig: {
      debug: true
    },
    inputs: [
      {
        inputType: InputType.list,
        path: 'contributors',
        label: 'Contributors',
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
  },

  // Slot 3: Tuple - Simple values
  {
    inputType: InputType.slot,
    path: 'slot_coordinates',
    label: 'Tuple: Coordinates (simple values)',
    inputConfig: {
      debug: true
    },
    inputs: [
      {
        inputType: InputType.text,
        path: 'coordinates.0',
        label: 'X Coordinate (Position 0)',
        required: true,
        validation: {
          schema: z.coerce.number().min(0, 'X must be non-negative')
        }
      },
      {
        inputType: InputType.text,
        path: 'coordinates.1',
        label: 'Y Coordinate (Position 1)',
        required: true,
        validation: {
          schema: z.coerce.number().min(0, 'Y must be non-negative')
        }
      }
    ]
  },

  // Slot 4: Tuple - Nested objects
  {
    inputType: InputType.slot,
    path: 'slot_servers',
    label: 'Tuple: Servers (nested objects)',
    inputConfig: {
      debug: true
    },
    inputs: [
      {
        inputType: InputType.text,
        path: 'servers.0.name',
        label: 'Primary Server Name (Position 0)',
        required: true
      },
      {
        inputType: InputType.text,
        path: 'servers.0.url',
        label: 'Primary Server URL (Position 0)',
        required: true,
        validation: {
          schema: z.string().url('Invalid URL format')
        }
      },
      {
        inputType: InputType.text,
        path: 'servers.1.name',
        label: 'Backup Server Name (Position 1)',
        required: true
      },
      {
        inputType: InputType.text,
        path: 'servers.1.url',
        label: 'Backup Server URL (Position 1)',
        required: true,
        validation: {
          schema: z.string().url('Invalid URL format')
        }
      }
    ]
  },

  // Slot 5: Tuple - Mixed schemas per position
  {
    inputType: InputType.slot,
    path: 'slot_owners',
    label: 'Tuple: Owners (mixed schemas per position)',
    inputConfig: {
      debug: true
    },
    inputs: [
      {
        inputType: InputType.text,
        path: 'owners.0.name',
        label: 'Primary Owner Name (Position 0)',
        required: true,
        validation: {
          schema: z.string().min(2, 'Name must be at least 2 characters')
        }
      },
      {
        inputType: InputType.text,
        path: 'owners.0.email',
        label: 'Primary Owner Email (Position 0)',
        required: true,
        validation: {
          schema: z.string().email('Invalid email format')
        }
      },
      {
        inputType: InputType.text,
        path: 'owners.1.name',
        label: 'Secondary Owner Name (Position 1)',
        required: true,
        validation: {
          schema: z.string().min(2, 'Name must be at least 2 characters')
        }
      },
      {
        inputType: InputType.text,
        path: 'owners.1.email',
        label: 'Secondary Owner Email (Position 1)',
        required: true,
        validation: {
          schema: z.string().email('Invalid email format')
        }
      },
      {
        inputType: InputType.text,
        path: 'owners.2.name',
        label: 'Technical Contact Name (Position 2)',
        required: false
      },
      {
        inputType: InputType.select,
        path: 'owners.2.role',
        label: 'Technical Contact Role (Position 2)',
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

  // Slot 6: Tuple - Sparse indices
  {
    inputType: InputType.slot,
    path: 'slot_priorities',
    label: 'Tuple: Priorities (sparse indices 0, 5)',
    inputConfig: {
      debug: true
    },
    inputs: [
      {
        inputType: InputType.text,
        path: 'priorities.0',
        label: 'Highest Priority (Position 0)',
        required: true
      },
      {
        inputType: InputType.text,
        path: 'priorities.5',
        label: 'Lowest Priority (Position 5)',
        required: true
      }
    ]
  }
]

export const formDefinition: IFormDefinition<InputConfigType> = {
  inputs
}
