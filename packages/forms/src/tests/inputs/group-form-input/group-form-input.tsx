import { JSX, memo } from 'react'

import { InputComponent } from '../../../core'
import { RenderInputs } from '../../../form'
import { GroupFormInputProps, GroupFormInputValueType } from './group-form-input-types'

const GroupFormInputInternal = memo(function GroupInputInternal(props: GroupFormInputProps): JSX.Element {
  const { input, factory } = props
  const { label, inputs = [] } = input

  return (
    <div data-testid={`input-${label?.toLowerCase().replace(/\s+/g, '-')}`}>
      {inputs.map(nestedInput => (
        <div key={nestedInput.path}>
          <RenderInputs items={[nestedInput]} factory={factory} />
        </div>
      ))}
    </div>
  )
})

export class GroupFormInput extends InputComponent<GroupFormInputValueType> {
  public internalType = 'group'

  renderComponent(props: GroupFormInputProps): JSX.Element {
    return <GroupFormInputInternal {...props} />
  }
}
