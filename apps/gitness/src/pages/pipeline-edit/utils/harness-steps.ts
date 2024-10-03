import { RUN_STEP_DESCRIPTION, RUN_STEP_IDENTIFIER } from '@harnessio/playground'

type HarnessSteps = {
  identifier: string
  description: string
}
export const harnessSteps: HarnessSteps[] = [
  {
    identifier: RUN_STEP_IDENTIFIER,
    description: RUN_STEP_DESCRIPTION
  },
  {
    identifier: 'group',
    description: 'Add sequence of serial steps'
  },
  {
    identifier: 'parallel',
    description: 'Add parallel steps'
  }
]
