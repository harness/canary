import { IFormDefinition } from '@harnessio/forms'

import { InputConfigType } from '../form-inputs/types'
import { getRunStepFormDefinition } from './run-step-common'
import { RUN_TEST_STEP_IDENTIFIER } from './types'

const RUN_TEST_STEP_DESCRIPTION = 'Run test step description.'

const runTestStepFormDefinition: IFormDefinition<InputConfigType> = getRunStepFormDefinition(RUN_TEST_STEP_IDENTIFIER)

export { RUN_TEST_STEP_IDENTIFIER, RUN_TEST_STEP_DESCRIPTION, runTestStepFormDefinition }
