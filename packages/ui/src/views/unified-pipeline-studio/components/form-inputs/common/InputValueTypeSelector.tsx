import { Button, DropdownMenu } from '@components/index'

import { InputValueType } from '../types/types'

export interface InputLabelProps {
  inputValueType: InputValueType
  setInputValueType: (inputValueType: InputValueType) => void
}

const getButtonLabel = (inputValueType: InputValueType) => {
  switch (inputValueType) {
    case 'fixed':
      return 'F'
    case 'expression':
      return 'E'
    case 'runtime':
      return 'R'
  }
}

function InputValueTypeSelection(props: InputLabelProps): JSX.Element {
  const { inputValueType, setInputValueType } = props

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger aria-label="options menu">
        <Button variant={'outline'}>{getButtonLabel(inputValueType)}</Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        <DropdownMenu.Item
          title="Fixed"
          onSelect={() => {
            setInputValueType('fixed')
          }}
        />
        <DropdownMenu.Item
          title="Runtime"
          onSelect={() => {
            setInputValueType('runtime')
          }}
        />
        <DropdownMenu.Item
          title="Expression"
          onSelect={() => {
            setInputValueType('expression')
          }}
        />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default InputValueTypeSelection
