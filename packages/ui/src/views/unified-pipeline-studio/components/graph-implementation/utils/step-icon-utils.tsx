import { Icon, IconProps } from '@components/icon'

import {
  getIsActionStep,
  getIsBackgroundStep,
  getIsRunStep,
  getIsRunTestStep,
  getIsTemplateStep
} from './common-step-utils'

const getIconNameBasedOnStep = (step: any): IconProps['name'] => {
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

export const getIconBasedOnStep = (step: any): JSX.Element => {
  return <Icon size={32} name={getIconNameBasedOnStep(step)} />
}
