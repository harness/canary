import { IconProps } from '@harnessio/canary'

import {
  getIsActionStep,
  getIsBackgroundStep,
  getIsRunStep,
  getIsRunTestStep,
  getIsTemplateStep
} from './commonStepUtil'

export const getIconBasedOnStep = (step: any): IconProps['name'] => {
  if (getIsRunStep(step)) return 'run'

  if (getIsRunTestStep(step)) return 'run-test'

  if (getIsBackgroundStep(step)) return 'cog-6'

  if (getIsActionStep(step)) return 'github-actions'

  if (getIsTemplateStep(step)) return 'harness-plugin'

  /**
   * Yet to add Bitrise plugins,
   * Request backend to add a property to identify bitrise-plugin
   */

  return 'harness'
}
