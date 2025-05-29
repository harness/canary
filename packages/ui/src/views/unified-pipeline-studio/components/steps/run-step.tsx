import { getRunStepFormDefinition } from './run-step-common'
import { RUN_STEP_IDENTIFIER } from './types'

const RUN_STEP_DESCRIPTION =
  'Execute scripts in the shell session. The scripts can be executed on the pod/instance running a Harness Delegate or on a remote host in the infrastructure.'

const runStepFormDefinition = getRunStepFormDefinition(RUN_STEP_IDENTIFIER)

export { RUN_STEP_IDENTIFIER, RUN_STEP_DESCRIPTION, runStepFormDefinition }
