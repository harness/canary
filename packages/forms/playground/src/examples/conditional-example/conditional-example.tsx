import { getTransformers, outputTransformValues, RenderForm, RootForm, unsetHiddenInputsValues } from '../../../../src'
import inputComponentFactory from '../../implementation/factory/factory'
import { formDefinition } from './form-definition'

function ConditionalExample() {
  const onSubmit = values => {
    const transformers = getTransformers(formDefinition)
    const values2 = outputTransformValues(values, transformers)
    const values3 = unsetHiddenInputsValues(formDefinition, values2)

    console.log(values3)
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

export default ConditionalExample
