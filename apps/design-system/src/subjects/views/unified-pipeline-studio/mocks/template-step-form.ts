import { IInputConfigWithConfig } from '@harnessio/ui/views'

const inputs: IInputConfigWithConfig[] = [
  {
    inputType: 'text',
    path: `template.with.testpath1`,
    label: 'Input 1'
  },
  {
    inputType: 'text',
    path: `template.with.testpath2`,
    label: 'Input 2'
  },
  {
    inputType: 'text',
    path: `template.with.testpath3`,
    label: 'Input 3'
  }
]

export const templateStepForm = { inputs }
