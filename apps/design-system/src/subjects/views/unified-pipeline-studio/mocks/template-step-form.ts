import { IInputConfigWithConfig, InputType } from '@harnessio/ui/views'

const inputs: IInputConfigWithConfig[] = [
  {
    inputType: InputType.text,
    path: `with.testpath1`,
    label: 'Input 1'
  },
  {
    inputType: InputType.text,
    path: `with.testpath2`,
    label: 'Input 2'
  },
  {
    inputType: InputType.text,
    path: `with.testpath3`,
    label: 'Input 3'
  }
]

export const templateStepForm = { inputs }
