import { Icon, IconProps } from '@harnessio/ui/components'

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

  if (getIsTemplateStep(step)) {
    switch (step.template.uses) {
      case 'slack':
        return 'rocket'
        break
      case 'docker':
        return 'star'
        break
    }
  }

  /**
   * Yet to add Bitrise plugins,
   * Request backend to add a property to identify bitrise-plugin
   */

  return 'harness'
}

export const getIconBasedOnStep = (step: any): JSX.Element => {
  console.log(step)
  return <Icon className="size-6" name={getIconNameBasedOnStep(step)} />
}
