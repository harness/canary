import { RenderForm, RootForm, useZodValidationResolver } from '../../../../src'
import inputComponentFactory from '../../implementation/factory/factory'
import { formDefinition } from './form-definition'

function ValidationExample() {
  const onSubmit = values => {
    console.log(values)
  }

  const resolver = useZodValidationResolver(formDefinition)

  return (
    <RootForm onSubmit={onSubmit} resolver={resolver} mode={undefined}>
      {rootForm => (
        <>
          <RenderForm factory={inputComponentFactory} inputs={formDefinition} />
          <button onClick={() => rootForm.submitForm()}>Submit</button>
        </>
      )}
    </RootForm>
  )
}

export default ValidationExample
