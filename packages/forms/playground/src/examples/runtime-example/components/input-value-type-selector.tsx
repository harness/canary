import { InputValueType } from '../types/types'

export interface InputLabelProps {
  inputValueType: InputValueType
  setInputValueType: (inputValueType: InputValueType) => void
}

function InputValueTypeSelection(props: InputLabelProps): JSX.Element {
  const { inputValueType, setInputValueType } = props

  return (
    <div style={{ display: 'flex' }}>
      <button
        className={inputValueType === 'fixed' ? 'active-button' : ''}
        onClick={() => {
          setInputValueType('fixed')
        }}
      >
        F
      </button>
      <button
        className={inputValueType === 'runtime' ? 'active-button' : ''}
        onClick={() => {
          setInputValueType('runtime')
        }}
      >
        R
      </button>
      <button
        className={inputValueType === 'expression' ? 'active-button' : ''}
        onClick={() => {
          setInputValueType('expression')
        }}
      >
        E
      </button>
    </div>
  )
}

export default InputValueTypeSelection
