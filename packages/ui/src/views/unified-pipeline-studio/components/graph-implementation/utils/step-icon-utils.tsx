import { IconV2, type IconPropsV2 } from '@components/icon-v2'

import {
  getIsActionStep,
  getIsBackgroundStep,
  getIsRunStep,
  getIsRunTestStep,
  getIsTemplateStep
} from './common-step-utils'

const getIconNameBasedOnStep = (step: any): IconPropsV2['name'] => {
  if (getIsRunStep(step)) return 'run'

  if (getIsRunTestStep(step)) return 'run-test'

  if (getIsBackgroundStep(step)) return 'settings'

  if (getIsActionStep(step)) return 'github-action'

  if (getIsTemplateStep(step)) return 'harness-plugins'

  /**
   * Yet to add Bitrise plugins,
   * Request backend to add a property to identify bitrise-plugin
   */

  return 'harness-plugins'
}

export const getIconBasedOnStep = (step: any): JSX.Element => {
  return <IconV2 size="lg" name={getIconNameBasedOnStep(step)} />
}
