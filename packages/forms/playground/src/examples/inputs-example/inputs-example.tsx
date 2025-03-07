import { RenderForm, RootForm } from '../../../../src'
import inputComponentFactory from '../../implementation/factory/factory'
import { formDefinition } from './form-definition'

function InputsExample() {
  const onSubmit = values => {
    console.log(values)
  }

  return (
    <RootForm onSubmit={onSubmit} resolver={undefined} mode={undefined}>
      {rootForm => (
        <>
          <RenderForm factory={inputComponentFactory} inputs={formDefinition} />
          <button onClick={() => rootForm.submitForm()}>Submit</button>
        </>
      )}
    </RootForm>
  )
}

export default InputsExample
